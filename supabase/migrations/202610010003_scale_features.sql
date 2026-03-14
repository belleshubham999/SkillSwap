-- Scale + product expansion migration

alter table public.profiles
  add column if not exists username text unique,
  add column if not exists referral_code text unique default encode(gen_random_bytes(6), 'hex'),
  add column if not exists referred_by uuid references public.profiles(id),
  add column if not exists reputation_score numeric(6,2) not null default 50,
  add column if not exists profile_completeness numeric(5,2) not null default 0,
  add column if not exists github_username text,
  add column if not exists linkedin_verified boolean not null default false;

alter table public.developer_profiles
  add column if not exists years_experience int not null default 0,
  add column if not exists weekly_hours int not null default 5,
  add column if not exists preferred_difficulty text not null default 'intermediate' check (preferred_difficulty in ('beginner','intermediate','advanced')),
  add column if not exists featured_projects uuid[] default '{}';

alter table public.founder_profiles
  add column if not exists traction_metrics jsonb not null default '{}'::jsonb,
  add column if not exists founder_reputation numeric(6,2) not null default 50,
  add column if not exists trust_score numeric(6,2) not null default 0;

alter table public.projects
  add column if not exists difficulty_level text not null default 'intermediate' check (difficulty_level in ('beginner','intermediate','advanced')),
  add column if not exists search_document tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || array_to_string(skills_required, ' ') || ' ' || array_to_string(tech_stack, ' '))
  ) stored,
  add column if not exists trust_score numeric(6,2) default 0;

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  title text not null,
  description text not null,
  due_date date not null,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  deliverables text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  assignee_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.discussion_threads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.discussion_comments (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.discussion_threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  upvotes int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('developer','founder','ama')),
  title text not null,
  content text not null,
  upvotes int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  source_user_id uuid not null references public.profiles(id) on delete cascade,
  target_email text not null,
  conversion_user_id uuid references public.profiles(id) on delete set null,
  converted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  enabled boolean not null default false,
  tier text not null default 'starter' check (tier in ('starter','growth','pro'))
);

create table if not exists public.usage_events (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  event_group text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.rate_limits (
  key text primary key,
  hits int not null default 0,
  window_start timestamptz not null default timezone('utc', now())
);

create table if not exists public.abuse_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  entity text not null,
  entity_id text not null,
  reason text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_projects_search on public.projects using gin(search_document);
create index if not exists idx_projects_difficulty_status on public.projects(difficulty_level, status, created_at desc);
create index if not exists idx_dev_profiles_experience on public.developer_profiles(years_experience, weekly_hours);
create index if not exists idx_usage_events_group_created on public.usage_events(event_group, created_at desc);
create index if not exists idx_referrals_source_converted on public.referrals(source_user_id, converted, created_at desc);
create index if not exists idx_discussion_threads_project on public.discussion_threads(project_id, created_at desc);
create index if not exists idx_milestones_match_status on public.milestones(match_id, status, due_date);

create trigger trg_milestones_updated before update on public.milestones for each row execute function public.set_updated_at();

create or replace function public.calculate_founder_trust(p_founder_id uuid)
returns numeric
language sql
stable
as $$
  select least(100, greatest(0,
    coalesce((select profile_completeness from public.profiles where id = p_founder_id), 0) * 0.35 +
    coalesce((select count(*) * 5 from public.projects where founder_id = p_founder_id and status = 'published'), 0) * 0.25 +
    coalesce((select avg(r.rating) * 20 from public.reviews r join public.matches m on m.id = r.match_id where m.founder_id = p_founder_id), 0) * 0.25 +
    coalesce((select case when linkedin_verified then 10 else 0 end from public.profiles where id = p_founder_id), 0) * 0.10 +
    coalesce((select (traction_metrics->>'score')::numeric from public.founder_profiles where user_id = p_founder_id), 0) * 0.05
  ));
$$;

create or replace function public.upvote_post(p_post_id uuid)
returns int
language plpgsql
security definer
as $$
declare v_upvotes int;
begin
  update public.community_posts
  set upvotes = upvotes + 1
  where id = p_post_id
  returning upvotes into v_upvotes;

  return coalesce(v_upvotes, 0);
end;
$$;

create or replace function public.get_portfolio_by_username(p_username text)
returns jsonb
language plpgsql
security definer
as $$
declare output jsonb;
begin
  select jsonb_build_object(
    'profile', to_jsonb(p.*),
    'completed_projects', coalesce((
      select jsonb_agg(jsonb_build_object('project', pr.title, 'status', m.progress_status, 'tech_stack', pr.tech_stack))
      from public.matches m
      join public.projects pr on pr.id = m.project_id
      where m.developer_id = p.id and m.progress_status = 'completed'
    ), '[]'::jsonb),
    'testimonials', coalesce((
      select jsonb_agg(jsonb_build_object('rating', r.rating, 'feedback', r.feedback))
      from public.reviews r where r.reviewee_id = p.id
    ), '[]'::jsonb),
    'achievements', jsonb_build_array(
      case when p.reputation_score > 80 then 'Top Contributor' else 'Rising Builder' end
    )
  ) into output
  from public.profiles p
  where p.username = p_username;

  return output;
end;
$$;

create or replace view public.projects_scored as
select
  p.*,
  public.calculate_founder_trust(p.founder_id) as trust_score,
  coalesce((
    select (count(*)::numeric / nullif(cardinality(p.skills_required), 0)) * 45
    from unnest(p.skills_required) req
    join public.developer_profiles dp on dp.user_id = auth.uid()
    where req = any(dp.skills)
  ), 0) as skill_score,
  coalesce((
    select case
      when p.difficulty_level = 'beginner' and dp.years_experience <= 1 then 25
      when p.difficulty_level = 'intermediate' and dp.years_experience between 1 and 4 then 25
      when p.difficulty_level = 'advanced' and dp.years_experience >= 4 then 25
      else 10
    end
    from public.developer_profiles dp where dp.user_id = auth.uid()
  ), 0) as experience_score,
  coalesce((
    select least(20, coalesce(avg(r.rating), 0) * 4)
    from public.reviews r
    where r.reviewee_id = auth.uid()
  ), 0) as reputation_score,
  coalesce((
    select case when dp.weekly_hours >= 20 then 10 when dp.weekly_hours >= 10 then 7 else 3 end
    from public.developer_profiles dp where dp.user_id = auth.uid()
  ), 0) as availability_score,
  (
    coalesce((
      select (count(*)::numeric / nullif(cardinality(p.skills_required), 0)) * 45
      from unnest(p.skills_required) req
      join public.developer_profiles dp on dp.user_id = auth.uid()
      where req = any(dp.skills)
    ), 0)
    + coalesce((
      select case
        when p.difficulty_level = 'beginner' and dp.years_experience <= 1 then 25
        when p.difficulty_level = 'intermediate' and dp.years_experience between 1 and 4 then 25
        when p.difficulty_level = 'advanced' and dp.years_experience >= 4 then 25
        else 10
      end
      from public.developer_profiles dp where dp.user_id = auth.uid()
    ), 0)
    + coalesce((select least(20, coalesce(avg(r.rating), 0) * 4) from public.reviews r where r.reviewee_id = auth.uid()), 0)
    + coalesce((select case when dp.weekly_hours >= 20 then 10 when dp.weekly_hours >= 10 then 7 else 3 end from public.developer_profiles dp where dp.user_id = auth.uid()), 0)
  ) as match_score
from public.projects p;

alter table public.milestones enable row level security;
alter table public.issues enable row level security;
alter table public.discussion_threads enable row level security;
alter table public.discussion_comments enable row level security;
alter table public.community_posts enable row level security;
alter table public.referrals enable row level security;
alter table public.feature_flags enable row level security;
alter table public.usage_events enable row level security;
alter table public.rate_limits enable row level security;
alter table public.abuse_reports enable row level security;

create policy "milestones participants" on public.milestones for all using (
  exists (select 1 from public.matches m where m.id = milestones.match_id and (m.founder_id = auth.uid() or m.developer_id = auth.uid()))
) with check (
  exists (select 1 from public.matches m where m.id = milestones.match_id and (m.founder_id = auth.uid() or m.developer_id = auth.uid()))
);

create policy "issues participants" on public.issues for all using (
  exists (select 1 from public.matches m where m.id = issues.match_id and (m.founder_id = auth.uid() or m.developer_id = auth.uid()))
) with check (
  exists (select 1 from public.matches m where m.id = issues.match_id and (m.founder_id = auth.uid() or m.developer_id = auth.uid()))
);

create policy "threads read" on public.discussion_threads for select using (true);
create policy "threads write auth" on public.discussion_threads for insert with check (author_id = auth.uid());
create policy "comments read" on public.discussion_comments for select using (true);
create policy "comments write auth" on public.discussion_comments for insert with check (author_id = auth.uid());
create policy "posts read" on public.community_posts for select using (true);
create policy "posts write auth" on public.community_posts for insert with check (author_id = auth.uid());
create policy "referrals own" on public.referrals for all using (source_user_id = auth.uid()) with check (source_user_id = auth.uid());
create policy "feature flags read all" on public.feature_flags for select using (true);
create policy "usage own insert" on public.usage_events for insert with check (user_id = auth.uid());
create policy "usage admin read" on public.usage_events for select using (exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "abuse insert auth" on public.abuse_reports for insert with check (reporter_id = auth.uid());

create or replace function public.before_insert_application_notify()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.notifications(user_id, type, payload)
  select p.founder_id, 'new_application', jsonb_build_object('project_id', new.project_id, 'developer_id', new.developer_id)
  from public.projects p where p.id = new.project_id;

  insert into public.usage_events(user_id, event_name, event_group, metadata)
  values (new.developer_id, 'application_submitted', 'activation', jsonb_build_object('project_id', new.project_id));

  return new;
end;
$$;

drop trigger if exists trg_before_insert_application_notify on public.applications;
create trigger trg_before_insert_application_notify
after insert on public.applications
for each row execute function public.before_insert_application_notify();
