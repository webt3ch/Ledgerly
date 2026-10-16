-- Expose only the required operations to authenticated users.
-- RLS policies still enforce per-user row ownership.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.notification_preferences from anon, authenticated;
revoke all on table public.workspace_snapshots from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.notification_preferences to authenticated;
grant select, insert, update on table public.workspace_snapshots to authenticated;
