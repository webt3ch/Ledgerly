# Production status — 2026-10-16

## Repository state

- Public GitHub repository: https://github.com/webt3ch/Ledgerly
- Default branch: `main`
- `index.html`: self-contained local-first Ledgerly frontend.
- `config.js`: browser-safe Supabase configuration intentionally blank until a real project is configured.
- `supabase/migrations/001_profile_preferences_and_workspace.sql`: initial profile/preferences/workspace migration with RLS policies; it has **not** been applied to a live Supabase project from this environment.
- `beta/images/`: compressed visual references only. Historical beta source code and demo financial data are not included.
- `.github/workflows/quality.yml`: static release checks.
- `.github/workflows/deploy-vercel.yml`: production workflow is committed but gated off until repository owner configures Vercel secrets and sets `VERCEL_DEPLOY_ENABLED=true`.

## Implemented in source

- Self-contained local-first frontend with responsive layout, appearance settings, financial sections and IT/EN/ES UI.
- Optional Supabase Auth adapter for email/password registration and sign-in, password recovery, Google OAuth, Microsoft/Azure OAuth and sign-out.
- Optional workspace snapshot sync against `public.workspace_snapshots`, protected by user-owned RLS policies and revision checks; local/cloud merges are explicit rather than silent.
- Browser notification permission request is user-initiated.

## Not active / not production-verified

- Supabase project configuration and migration application.
- Email verification and password-recovery delivery.
- Google OAuth client and Microsoft Entra application/provider secrets in Supabase Auth.
- Cross-user RLS and concurrent-sync testing against a real cloud project.
- Vercel production deployment: the connected management integration returned HTTP 403 when creating a deployment, so there is no verified live URL yet.
- Remote push/email notification delivery and a server-side scheduler/worker.
- Full browser-to-cloud data export/deletion and end-to-end provider tests.

## Exact next actions

1. Configure Vercel GitHub Actions repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`; set Actions variable `VERCEL_DEPLOY_ENABLED=true`; then run the production deployment workflow.
2. Connect a Supabase project, apply the reviewed migration and set the public Supabase URL/key in `config.js`.
3. Configure Google and Microsoft/Azure providers with secrets stored only in Supabase Auth settings, and set exact redirect URLs for the Vercel deployment.
4. Test registration, email confirmation, recovery, OAuth callbacks, sign-out, two-user RLS isolation and local-to-cloud migration with real test users.
5. Activate remote notifications only after a server scheduler/worker, delivery providers, credentials, consent, retries and end-to-end delivery tests are in place.

Never commit service-role keys, database passwords, OAuth client secrets, mail-provider API keys or VAPID private keys. Do not advertise cloud login, sync, remote notifications or production hosting as active until they have been tested against the live services.
