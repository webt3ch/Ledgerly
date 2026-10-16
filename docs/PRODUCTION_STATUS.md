# Production status (2026-10-16)

## Implemented in the repository

- Self-contained local-first Ledgerly frontend at the root `index.html`.
- Optional Supabase Auth adapter for email/password registration and sign-in, password recovery, Google OAuth, Microsoft/Azure OAuth and sign-out.
- Optional workspace snapshot sync against `public.workspace_snapshots`, with user-owned RLS policies, revision checks and explicit local/cloud merge prompts.
- Browser-safe `config.js` template with intentionally empty public values.
- Initial Supabase migration and a GitHub Actions static quality check.

## Not active until configured

- Supabase project and migration application.
- Email verification and recovery delivery.
- Google OAuth client and Microsoft Entra application/provider secrets inside Supabase Auth.
- Vercel deployment: the connected Vercel management tool currently rejects deployment creation with HTTP 403, so there is no verified live URL.
- Remote push/email notifications and the server-side scheduler/worker.
- Multi-user RLS tests and end-to-end provider tests against a real Supabase project.

Do not advertise cloud sign-in or sync as active until the project URL/key are configured, the migration is applied, provider callbacks work, and two separate test users pass isolation tests. Browser notification permission is distinct from remote notification delivery.

## Activating cloud auth

Follow [AUTH_SETUP.md](AUTH_SETUP.md). Put only the Supabase project URL and anon/publishable key in the browser configuration. OAuth client secrets, service-role keys and database passwords must never be committed.
