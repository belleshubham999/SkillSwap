import { supabase } from '@/services/supabase';
import type { Project } from '@/types/domain';

export const getProjects = async (filters?: Record<string, string>) => {
  let q = supabase.from('projects_with_score').select('*').eq('status', 'published');
  if (filters?.skills) q = q.contains('skills_required', [filters.skills]);
  if (filters?.tech) q = q.contains('tech_stack', [filters.tech]);
  if (filters?.timeline) q = q.eq('timeline', filters.timeline);
  if (filters?.sort === 'equity') q = q.order('equity_percent', { ascending: false });
  else q = q.order('created_at', { ascending: false });
  const { data, error } = await q;
  if (error) throw error;
  return data as Project[];
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  const { data, error } = await supabase.from('projects').insert(project).select().single();
  if (error) throw error;
  return data;
};

export const applyToProject = async (payload: { project_id: string; cover_letter: string; availability_timeline: string; links: string[] }) => {
  const { data, error } = await supabase.from('applications').insert(payload).select().single();
  if (error) throw error;
  return data;
};
