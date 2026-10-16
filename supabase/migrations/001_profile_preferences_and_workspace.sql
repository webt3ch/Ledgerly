-- Ledgerly cloud identity/preferences and a versioned sync envelope.
-- Review and apply only to the intended Supabase project.
-- The financial UI remains local-first until a sync adapter is implemented and tested.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  avatar_path text,
  locale text not null default 'it' check (locale in ('it','en','es')),
  display_currency char(3) not null default 'EUR' check (display_currency ~ '^[A-Z]{3}$'),
  time_zone text not null default 'Europe/Rome',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  subscription_renewals boolean not null default false,
  planned_payments boolean not null default false,
  budget_thresholds boolean not null default false,
  weekly_summary boolean not null default false,
  browser_permission text not null default 'default'
    check (browser_permission in ('default','granted','denied','unsupported')),
  updated_at timestamptz not null default now()
);

-- Transitional sync envelope for a future explicit local-to-cloud migration.
-- The payload is not exposed to unauthenticated visitors; row-level policies enforce ownership.
-- Move to normalized financial tables before adding shared/multi-user workspaces or bank feeds.
create table if not exists public.workspace_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1 check (schema_version > 0),
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  check (pg_column_size(payload) <= 2000000)
);

alter table public.profiles enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.workspace_snapshots enable row level security;

drop policy if exists "profile_select_own" on public.profiles;
create policy "profile_select_own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
drop policy if exists "profile_insert_own" on public.profiles;
create policy "profile_insert_own" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "profile_update_own" on public.profiles;
create policy "profile_update_own" on public.profiles
  for update to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "notification_preferences_select_own" on public.notification_preferences;
create policy "notification_preferences_select_own" on public.notification_preferences
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "notification_preferences_insert_own" on public.notification_preferences;
create policy "notification_preferences_insert_own" on public.notification_preferences
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "notification_preferences_update_own" on public.notification_preferences;
create policy "notification_preferences_update_own" on public.notification_preferences
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "workspace_snapshot_select_own" on public.workspace_snapshots;
create policy "workspace_snapshot_select_own" on public.workspace_snapshots
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "workspace_snapshot_insert_own" on public.workspace_snapshots;
create policy "workspace_snapshot_insert_own" on public.workspace_snapshots
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "workspace_snapshot_update_own" on public.workspace_snapshots;
create policy "workspace_snapshot_update_own" on public.workspace_snapshots
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Profile creation is triggered by Supabase Auth identity creation, without copying
-- unverified email addresses into user-editable profile fields.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 120)
  )
  on conflict (id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_ledgerly on auth.users;
create trigger on_auth_user_created_ledgerly
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
