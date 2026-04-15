create table if not exists public.workspaces (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

drop policy if exists "workspace_read_all" on public.workspaces;
create policy "workspace_read_all"
on public.workspaces
for select
to anon, authenticated
using (true);

drop policy if exists "workspace_insert_authenticated" on public.workspaces;
create policy "workspace_insert_authenticated"
on public.workspaces
for insert
to authenticated
with check (true);

drop policy if exists "workspace_update_authenticated" on public.workspaces;
create policy "workspace_update_authenticated"
on public.workspaces
for update
to authenticated
using (true)
with check (true);

drop policy if exists "workspace_delete_authenticated" on public.workspaces;
create policy "workspace_delete_authenticated"
on public.workspaces
for delete
to authenticated
using (true);
