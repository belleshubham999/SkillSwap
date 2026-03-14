export type Role = 'developer' | 'founder' | 'admin';

export interface Profile { id: string; full_name: string; role: Role; avatar_url?: string; }
export interface Project {
  id: string; founder_id: string; title: string; description: string; problem: string;
  target_users: string; skills_required: string[]; tech_stack: string[]; timeline: string;
  compensation: string; equity_percent: number; status: 'draft' | 'published' | 'closed';
  validation_proof?: string;
}
export interface Application { id: string; project_id: string; developer_id: string; cover_letter: string; status: 'pending'|'accepted'|'rejected'; }
export interface Match { id: string; project_id: string; founder_id: string; developer_id: string; progress_status: 'active'|'completed'|'paused'; }
