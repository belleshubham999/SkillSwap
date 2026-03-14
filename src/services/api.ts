import { queryCache } from '@/services/cache/query-cache';
import { eventBus } from '@/services/events/event-bus';
import { jobQueue } from '@/services/queue/job-queue';
import { supabase } from '@/services/supabase';
import type { CommunityPost, Milestone, Project, ProjectRecommendation } from '@/types/domain';

type ProjectFilters = {
  skills?: string;
  tech?: string;
  timeline?: string;
  sort?: 'recent' | 'equity' | 'match';
  search?: string;
  page?: number;
  pageSize?: number;
};

export const getProjects = async (filters: ProjectFilters = {}) => {
  const page = filters.page ?? 0;
  const pageSize = filters.pageSize ?? 20;
  const from = page * pageSize;
  const to = from + pageSize - 1;
  const cacheKey = `projects:${JSON.stringify(filters)}`;

  const cached = queryCache.get<{ items: ProjectRecommendation[]; nextPage?: number }>(cacheKey);
  if (cached) return cached;

  let q = supabase
    .from('projects_scored')
    .select(
      'id,founder_id,title,description,problem,target_users,skills_required,tech_stack,timeline,compensation,equity_percent,difficulty_level,status,validation_proof,attachments,match_score,skill_score,experience_score,reputation_score,availability_score,trust_score,created_at',
      { count: 'exact' }
    )
    .eq('status', 'published')
    .range(from, to);

  if (filters.skills) q = q.contains('skills_required', [filters.skills]);
  if (filters.tech) q = q.contains('tech_stack', [filters.tech]);
  if (filters.timeline) q = q.eq('timeline', filters.timeline);
  if (filters.search) q = q.textSearch('search_document', filters.search, { type: 'websearch' });

  if (filters.sort === 'equity') q = q.order('equity_percent', { ascending: false });
  else if (filters.sort === 'match') q = q.order('match_score', { ascending: false });
  else q = q.order('created_at', { ascending: false });

  const { data, error, count } = await q;
  if (error) throw error;

  const result = {
    items: (data ?? []) as ProjectRecommendation[],
    nextPage: count && to + 1 < count ? page + 1 : undefined
  };

  queryCache.set(cacheKey, result, 30_000);
  return result;
};

export const getTopMatches = async () => {
  const { data, error } = await supabase
    .from('projects_scored')
    .select('id,title,description,match_score,skill_score,experience_score,reputation_score,availability_score,equity_percent')
    .eq('status', 'published')
    .order('match_score', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data as ProjectRecommendation[];
};

export const createProject = async (project: Omit<Project, 'id' | 'trust_score'>) => {
  const { data, error } = await supabase.from('projects').insert(project).select().single();
  if (error) throw error;
  jobQueue.push({ name: 'recompute-trust-score', payload: { founderId: project.founder_id } });
  queryCache.invalidate('projects:');
  return data;
};

export const applyToProject = async (payload: {
  project_id: string;
  cover_letter: string;
  availability_timeline: string;
  links: string[];
}) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('applications')
    .insert({ ...payload, developer_id: user.id })
    .select('id,project_id,developer_id,status')
    .single();

  if (error) throw error;

  eventBus.emit({
    type: 'application.created',
    payload: { projectId: payload.project_id, founderId: '' }
  });
  queryCache.invalidate('projects:');

  return data;
};

export const getMilestones = async (matchId: string) => {
  const { data, error } = await supabase
    .from('milestones')
    .select('id,match_id,title,description,due_date,status')
    .eq('match_id', matchId)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Milestone[];
};

export const updateMilestone = async (milestoneId: string, status: Milestone['status']) => {
  const { data, error } = await supabase
    .from('milestones')
    .update({ status })
    .eq('id', milestoneId)
    .select('id,match_id,status')
    .single();

  if (error) throw error;

  eventBus.emit({
    type: 'milestone.updated',
    payload: { matchId: data.match_id, status: data.status }
  });

  return data;
};

export const listCommunityPosts = async () => {
  const { data, error } = await supabase
    .from('community_posts')
    .select('id,author_id,category,title,content,upvotes')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as CommunityPost[];
};

export const upvotePost = async (postId: string) => {
  const { data, error } = await supabase.rpc('upvote_post', { p_post_id: postId });
  if (error) throw error;
  return data;
};

export const getPortfolio = async (username: string) => {
  const { data, error } = await supabase.rpc('get_portfolio_by_username', { p_username: username });
  if (error) throw error;
  return data;
};
