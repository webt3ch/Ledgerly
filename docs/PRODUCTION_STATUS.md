# Production status — 2026-10-16

## Repository state

- Public GitHub repository: https://github.com/webt3ch/Ledgerly
- Default branch: main
- index.html: self-contained local-first Ledgerly frontend.
- config.js: browser-safe Supabase configuration intentionally blank until a real project is configured.
- supabase/migrations/001_profile_preferences_and_workspace.sql: initial profile/preferences/workspace migration with RLS policies; it has not been applied to a live Supabase project.
- beta/images/: compressed visual references only. Historical beta source code and demo financial data are not included.
- .github/workflows/quality.yml: static release checks, passing on the latest checked commit.
- .github/workflows/deploy-vercel.yml: production workflow is committed and guarded; it skips deployment until the repository owner configures Vercel secrets and sets VERCEL_DEPLOY_ENABLED=true.

## Implemented in source

- Self-contained local-first frontend with responsive layout, appearance settings, financial sections and IT/EN/ES UI.
- Optional Supabase Auth adapter for email/password registration and sign-in, password recovery, Google OAuth, Microsoft/Azure OAuth and sign-out.
- Optional workspace snapshot sync against public.workspace_snapshots, protected by user-owned RLS policies and revision checks; local/cloud merges are explicit rather than silent.
- Browser notification permission request is user-initiated.

## Not active / not production-verified

- Supabase has no projects available in the connected account yet; the organization must be selected before a new project is created.
- Migration application, Auth configuration, email verification/recovery delivery and provider credentials are not configured.
- Google OAuth client and Microsoft Entra application/provider secrets are not configured in Supabase Auth.
- Cross-user RLS and concurrent-sync testing against a live cloud project have not run.
- Vercel context has no linked projects for the selected team; the connected management integration returns HTTP 403 when creating a project/deployment. There is no verified live URL.
- Remote push/email notification delivery and a server-side scheduler/worker are not implemented/configured.
- Full browser-to-cloud export/deletion and end-to-end provider tests remain go-live requirements.

## Exact next actions

1. Select the Supabase organization where Ledgerly should be created. The connected account currently shows one organization, kiddy.dev organization's; project creation may incur cost and must be quoted before proceeding.
2. Create/configure the Supabase project, apply the reviewed migration, obtain the Project URL and public anon/publishable key, and configure the workflow's public variables.
3. Import webt3ch/Ledgerly into Vercel from an account/team that has permission to create projects, then configure the GitHub Actions secrets with the actual Vercel IDs and enable the workflow.
4. Configure Google and Microsoft/Azure providers with secrets stored only in Supabase Auth settings; set exact redirect URLs for the verified Vercel deployment.
5. Test registration, email confirmation, recovery, OAuth callbacks, sign-out, two-user RLS isolation and local-to-cloud migration with real test users.
6. Activate remote notifications only after a server scheduler/worker, delivery providers, credentials, consent, retries and end-to-end delivery tests are in place.

Never commit service-role keys, database passwords, OAuth client secrets, mail-provider API keys or VAPID private keys. Do not advertise cloud login, sync, remote notifications or production hosting as active until tested against live services.
