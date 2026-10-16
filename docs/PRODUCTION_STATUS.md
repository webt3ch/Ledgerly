# Production status — 2026-10-16

## Repository and deployment

- Public GitHub repository: https://github.com/webt3ch/Ledgerly
- Default branch: `main`
- Latest observed Vercel production deployment: **READY**, sourced from `webt3ch/Ledgerly` / `main`
- Production URL: https://ledgerly-gilt-nine-25.vercel.app
- Vercel project ID: `prj_9GJokHcNGAVNKiLlxusI1ereLd8Y`
- `index.html`: responsive, self-contained local-first frontend with optional cloud Auth/sync UI.
- `config.js`: populated with the browser-safe Supabase URL and publishable key; contains no service-role key or provider secret.
- `beta/images/`: compressed visual references only; no historical beta code or sample financial records.
- `.github/workflows/quality.yml`: static release validation runs on pushes/pull requests.
- `.github/workflows/deploy-vercel.yml`: alternative deploy workflow remains deliberately gated off; Vercel's Git integration is the active deploy path.

## Supabase state

- Supabase project: `Ledgerly`
- Project ref: `uqddabngitzbzqpmkquz`
- Project URL: `https://uqddabngitzbzqpmkquz.supabase.co`
- Project creation quote: `$0/month`
- Applied migrations:
  - `001_profile_preferences_and_workspace`
  - `002_restrict_profile_trigger_execution`
  - `003_least_privilege_table_grants`
- Tables `profiles`, `notification_preferences`, and `workspace_snapshots` exist with RLS enabled.
- Explicit grants allow authenticated users only select/insert/update; anonymous table grants are revoked.
- The profile-creation trigger helper is not directly executable by `anon` or `authenticated`.
- Supabase security and performance advisors currently return no lints.

## Implemented in source

- Local-first finance UI with responsive navigation, appearance settings and IT/EN/ES UI.
- Email/password registration and sign-in, password recovery, sign-out.
- Google and Microsoft/Azure OAuth front-end flows are implemented.
- Per-user workspace snapshot persistence with revision-based writes, conflict detection and explicit local/cloud merge prompt.
- Initial profile/preferences rows provisioned by an auth.users trigger.
- Browser notification permission is user-initiated.

## Remaining before calling cloud auth production-ready

- Set Supabase Auth Site URL to `https://ledgerly-gilt-nine-25.vercel.app` and allow that exact production origin (plus any intentional preview origins) in Auth URL Configuration.
- Configure and test reliable email confirmation and password-recovery delivery. A production SMTP provider may be needed; don't assume default test mail is production-ready.
- Create Google OAuth client credentials and a Microsoft Entra application/client secret, enter them into Supabase Auth, and test provider callbacks on the production URL.
- Run real end-to-end tests with disposable users: register, confirm email, sign in/out, recover password, sign in with each configured provider, sync a new workspace, reopen on a second device, resolve a revision conflict and verify user A cannot read or write user B's data.
- Verify cloud export/deletion and backup/restore paths before using sensitive personal financial data.

## Not active

- Remote push/email notifications and server-side scheduling are not implemented/configured. Browser notification preferences alone do not constitute a notification service.
- The snapshot table is a transitional JSON envelope; normalized transactions/accounts/budgets tables, bank-feed integrations and shared workspaces are not implemented.
- End-to-end provider, cloud-sync, mobile browser and data-loss-recovery tests have not been performed from a real production browser session.

Never commit service-role/secret keys, database passwords, Google/Microsoft client secrets, mail-provider API keys or VAPID private keys. The Supabase publishable key in `config.js` is a public client key and remains protected by RLS. A production deployment is verified, but production-ready auth and sync still depend on the remaining checks above.
