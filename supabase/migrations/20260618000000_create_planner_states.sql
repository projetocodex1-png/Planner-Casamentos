create table if not exists public.planner_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.planner_states enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.planner_states to authenticated;

drop policy if exists "Users can read own planner state" on public.planner_states;
create policy "Users can read own planner state"
  on public.planner_states
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own planner state" on public.planner_states;
create policy "Users can insert own planner state"
  on public.planner_states
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own planner state" on public.planner_states;
create policy "Users can update own planner state"
  on public.planner_states
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
