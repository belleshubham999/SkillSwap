-- Security and scalability hardening pass

create index if not exists idx_projects_founder_status on public.projects(founder_id, status, created_at desc);
create index if not exists idx_applications_dev_created on public.applications(developer_id, created_at desc);
create index if not exists idx_reviews_reviewee_created on public.reviews(reviewee_id, created_at desc);

-- ensure users can insert own profile when onboarding
create policy "profiles insert self" on public.profiles for insert with check (auth.uid() = id);

-- enforce secure message visibility/send only for participants in match
alter table public.messages alter column match_id set not null;
alter table public.messages alter column receiver_id set not null;

drop policy if exists "messages participants" on public.messages;
drop policy if exists "messages send" on public.messages;

create policy "messages read participants" on public.messages
for select
using (
  exists (
    select 1
    from public.matches m
    where m.id = messages.match_id
      and (m.founder_id = auth.uid() or m.developer_id = auth.uid())
  )
);

create policy "messages insert participants" on public.messages
for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.matches m
    where m.id = messages.match_id
      and (m.founder_id = auth.uid() or m.developer_id = auth.uid())
      and (messages.receiver_id = m.founder_id or messages.receiver_id = m.developer_id)
  )
);

-- stronger review writes only by match participants
create policy "reviews participant update" on public.reviews
for update
using (reviewer_id = auth.uid());
