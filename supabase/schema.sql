-- The table. Every row belongs to exactly one auth user.
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null,
  role text not null,
  date date not null,
  status text not null check (
    status in ('Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected')
  ),
  url text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

-- Turn on RLS. Without this, the anon key can read everything.
alter table public.applications enable row level security;

-- SELECT: you can only see rows where user_id matches your JWT.
create policy "Users can read their own applications"
  on public.applications
  for select
  to authenticated
  using ( (select auth.uid()) = user_id );

-- INSERT: you can only create rows that belong to you.
create policy "Users can insert their own applications"
  on public.applications
  for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

-- UPDATE: you can only edit your own rows, and you can't reassign user_id.
create policy "Users can update their own applications"
  on public.applications
  for update
  to authenticated
  using ( (select auth.uid()) = user_id )
  with check ( (select auth.uid()) = user_id );

-- DELETE: you can only delete your own rows.
create policy "Users can delete their own applications"
  on public.applications
  for delete
  to authenticated
  using ( (select auth.uid()) = user_id );