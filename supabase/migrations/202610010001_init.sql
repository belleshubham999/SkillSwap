create extension if not exists pgcrypto;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('developer','founder','admin')),
  full_name text not null,
  avatar_url text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.developer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  skills text[] not null default '{}',
  experience text,
  availability text,
  github_url text,
  portfolio_url text,
  linkedin_url text,
  goals text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.founder_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  company text,
  startup_stage text,
  linkedin text,
  previous_exits text,
  website text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  problem text not null,
  target_users text not null,
  skills_required text[] not null default '{}',
  tech_stack text[] not null default '{}',
  timeline text not null,
  compensation text not null,
  equity_percent numeric(5,2) default 0 check (equity_percent between 0 and 100),
  validation_proof text,
  attachments text[] default '{}',
  status text not null default 'draft' check (status in ('draft','published','closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  developer_id uuid not null references public.profiles(id) on delete cascade,
  cover_letter text not null,
  availability_timeline text,
  links text[] default '{}',
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (project_id, developer_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  founder_id uuid not null references public.profiles(id) on delete cascade,
  developer_id uuid not null references public.profiles(id) on delete cascade,
  agreement_terms text,
  milestone_tracker jsonb not null default '[]'::jsonb,
  progress_status text not null default 'active' check (progress_status in ('active','completed','paused')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (project_id, developer_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  feedback text not null,
  flagged boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique(match_id, reviewer_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  receiver_id uuid references public.profiles(id) on delete set null,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique(user_id, project_id)
);

create table public.activity_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  entity text not null,
  entity_id text not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index idx_projects_status_created on public.projects(status, created_at desc);
create index idx_projects_skills on public.projects using gin(skills_required);
create index idx_projects_stack on public.projects using gin(tech_stack);
create index idx_apps_project on public.applications(project_id, status);
create index idx_matches_users on public.matches(founder_id, developer_id);
create index idx_notifications_user_created on public.notifications(user_id, created_at desc);
create index idx_messages_match_created on public.messages(match_id, created_at);
create index idx_activity_actor on public.activity_logs(actor_id, created_at desc);

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_dev_profiles_updated before update on public.developer_profiles for each row execute function public.set_updated_at();
create trigger trg_founder_profiles_updated before update on public.founder_profiles for each row execute function public.set_updated_at();
create trigger trg_projects_updated before update on public.projects for each row execute function public.set_updated_at();
create trigger trg_applications_updated before update on public.applications for each row execute function public.set_updated_at();
create trigger trg_matches_updated before update on public.matches for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, role, full_name)
  values (new.id, 'developer', coalesce(new.raw_user_meta_data->>'full_name', 'New User'))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.create_match_on_accept() returns trigger language plpgsql security definer as $$
declare p public.projects;
begin
  if new.status = 'accepted' and old.status is distinct from new.status then
    select * into p from public.projects where id = new.project_id;
    insert into public.matches(project_id, founder_id, developer_id, agreement_terms)
    values (new.project_id, p.founder_id, new.developer_id, 'Standard collaboration agreement')
    on conflict do nothing;
    insert into public.notifications(user_id, type, payload)
    values (new.developer_id, 'application_accepted', jsonb_build_object('project_id', new.project_id));
  end if;
  return new;
end $$;
create trigger trg_create_match_on_accept after update on public.applications for each row execute function public.create_match_on_accept();

create or replace view public.projects_with_score as
select p.*, coalesce((
  select (count(*)::numeric / nullif(cardinality(p.skills_required), 0)) * 100
  from unnest(p.skills_required) req
  join public.developer_profiles dp on dp.user_id = auth.uid()
  where req = any(dp.skills)
), 0) as match_score
from public.projects p;

alter table public.profiles enable row level security;
alter table public.developer_profiles enable row level security;
alter table public.founder_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.matches enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;
alter table public.bookmarks enable row level security;
alter table public.activity_logs enable row level security;

create policy "profiles read all" on public.profiles for select using (true);
create policy "profiles write self" on public.profiles for update using (auth.uid() = id);
create policy "dev write self" on public.developer_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "founder write self" on public.founder_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "project read published" on public.projects for select using (status = 'published' or founder_id = auth.uid());
create policy "project founder manage" on public.projects for all using (founder_id = auth.uid()) with check (founder_id = auth.uid());
create policy "applications read own" on public.applications for select using (developer_id = auth.uid() or exists(select 1 from public.projects p where p.id = project_id and p.founder_id = auth.uid()));
create policy "applications insert dev" on public.applications for insert with check (developer_id = auth.uid());
create policy "applications update founder" on public.applications for update using (exists(select 1 from public.projects p where p.id = project_id and p.founder_id = auth.uid()));
create policy "matches participants" on public.matches for select using (founder_id = auth.uid() or developer_id = auth.uid());
create policy "matches participants update" on public.matches for update using (founder_id = auth.uid() or developer_id = auth.uid());
create policy "reviews read all" on public.reviews for select using (true);
create policy "reviews participant insert" on public.reviews for insert with check (reviewer_id = auth.uid());
create policy "notifications own" on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "messages participants" on public.messages for select using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "messages send" on public.messages for insert with check (sender_id = auth.uid());
create policy "bookmarks own" on public.bookmarks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "activity admin" on public.activity_logs for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
