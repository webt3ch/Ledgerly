-- The trigger runs as its owner when a new auth.users row is inserted.
-- It must not be directly callable through the exposed Data API.
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;
