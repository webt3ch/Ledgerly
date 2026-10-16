# Ledgerly authentication and cloud activation

Ledgerly's published local-first interface does not become a cloud application merely by adding OAuth buttons. Enable the providers only after the Supabase project, redirect URLs, database policies and frontend adapter are configured and tested.

## Required services
- Supabase Auth and PostgreSQL.
- A public Supabase project URL and publishable/anon key for the browser; never expose a service-role key.
- Google OAuth client ID/secret created in Google Cloud Console.
- Microsoft Entra application registration and client secret.
- Vercel project linked to the production repository.

## Supabase Auth
1. Create a Supabase project and apply reviewed SQL migrations.
2. In Authentication → URL Configuration, set the production site URL and exact allowed callback URLs for the Vercel domain and preview domain(s).
3. Enable email/password and configure email confirmation plus recovery email templates.
4. Enable Google and Microsoft providers only after client IDs/secrets are entered into the Supabase dashboard.
5. Test sign-in, sign-up, email confirmation, recovery and sign-out before enabling the provider buttons in production.

## Google
Create an OAuth client in Google Cloud Console. Configure the Supabase callback URL shown by Supabase as an authorized redirect URI. Keep the client secret in Supabase provider configuration, never in GitHub or client-side JavaScript.

## Microsoft
Register an application in Microsoft Entra ID, select the intended supported account types, and configure the exact Supabase callback URI. Store the client secret in Supabase only. Do not infer identity linkage from matching email addresses; account linking must require a verified authenticated session.

## Vercel runtime configuration
Use only public browser-safe settings in the client build:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never expose `SUPABASE_SERVICE_ROLE_KEY`, database passwords, OAuth client secrets, Resend API keys or VAPID private keys to the browser. Server secrets must be configured as encrypted Vercel environment variables for the appropriate environments.

## Cloud data and migration
Do not silently copy localStorage to the cloud. Use an explicit “Migrate local data” action, show a preview/count, create a backup first, require a signed-in user, validate the payload and make the import idempotent. Provide rollback or a recoverable error state.

## Go-live gates
- RLS tests demonstrate user A cannot read or modify user B's profile, preferences, transactions or workspace.
- OAuth callback and sign-out flows work on the production domain.
- Account deletion and export cover cloud data, not merely localStorage.
- The UI states clearly whether data is local or cloud-synced.
- Provider configuration, recovery email, backup/restore and failure handling are tested.

Until these gates are passed, email/Google/Microsoft sign-in and cross-device sync must be marked “not configured”, not represented as working.
