export type Role = 'developer' | 'founder' | 'admin';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  role: Role;
  avatar_url?: string;
  reputation_score: number;
  trust_score?: number;
}

export interface Project {
  id: string;
  founder_id: string;
  title: string;
  description: string;
  problem: string;
  target_users: string;
  skills_required: string[];
  tech_stack: string[];
  timeline: string;
  compensation: string;
  equity_percent: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'closed';
  validation_proof?: string;
  attachments: string[];
  trust_score?: number;
}

export interface ProjectRecommendation extends Project {
  match_score: number;
  skill_score: number;
  experience_score: number;
  reputation_score: number;
  availability_score: number;
}

export interface Application {
  id: string;
  project_id: string;
  developer_id: string;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Match {
  id: string;
  project_id: string;
  founder_id: string;
  developer_id: string;
  progress_status: 'active' | 'completed' | 'paused';
}

export interface Milestone {
  id: string;
  match_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'todo' | 'in_progress' | 'done';
}

export interface CommunityPost {
  id: string;
  author_id: string;
  category: 'developer' | 'founder' | 'ama';
  title: string;
  content: string;
  upvotes: number;
}
