# Ledgerly

**Personal finance workspace · local-first by default · Italian / English / Spanish**

Ledgerly is a responsive personal finance tracker for transactions, subscriptions, budgets, merchants, categories and financial analytics. The repository contains the self-contained frontend, the optional Supabase Auth/cloud-sync adapter, PostgreSQL migrations, release checks and deployment configuration.

> **Release status:** the static app is deployed at [ledgerly-gilt-nine-25.vercel.app](https://ledgerly-gilt-nine-25.vercel.app). Supabase is provisioned and the frontend's public configuration is wired. Email/password Auth and per-user workspace sync are implemented but still require end-to-end verification on the production URL. Google and Microsoft login require provider credentials in Supabase Auth.

## Current features

- Responsive fintech dashboard with light/dark appearance, accent palette and density settings.
- Transactions, categories, merchants, subscriptions, budgets, calendar and analytics.
- Italian, English and Spanish UI.
- Local-first mode with browser storage, CSV import/export and JSON backup.
- Supabase Auth adapter for email/password registration and sign-in, password recovery, Google OAuth, Microsoft/Azure OAuth, sign-out and per-user snapshot sync.
- PostgreSQL migrations for profiles, notification preferences, workspace snapshots, RLS policies, safe trigger execution and least-privilege table grants.
- Static release validation via GitHub Actions and Git-based Vercel deployments.

## Beta visual archive

Only compressed visual references from earlier beta iterations are kept in `beta/images/`. Historical beta source code and sample personal/financial data are not included.

| Appearance | Dashboard |
|---|---|
| ![Beta appearance, light](beta/images/appearance-light-v1.4.webp) | ![Beta dashboard, desktop](beta/images/dashboard-desktop-v1.1.webp) |
| ![Beta appearance, dark](beta/images/appearance-dark-v1.4.webp) | ![Beta dashboard, mobile](beta/images/dashboard-mobile-v1.1.webp) |

These are reference screenshots from earlier iterations, not evidence of production behavior.

## Run locally

Open `index.html` in a modern browser for local-first use. The Supabase project URL and **publishable** key are already configured in `config.js` for hosted use. They are intentionally browser-public values; Row-Level Security is mandatory. For a different Supabase project, change the two public config values, then apply all SQL migrations before enabling cloud functionality.

Never place service-role/secret keys, database passwords, OAuth client secrets, email provider API keys or VAPID private keys in frontend code or GitHub.

## Configure cloud authentication and sync

The Supabase project is provisioned at [Supabase Dashboard](https://supabase.com/dashboard/project/uqddabngitzbzqpmkquz). These migrations are applied to the live database and also versioned in this repository:

1. `supabase/migrations/001_profile_preferences_and_workspace.sql`
2. `supabase/migrations/002_restrict_profile_trigger_execution.sql`
3. `supabase/migrations/003_least_privilege_table_grants.sql`

Before relying on cloud features:

1. Set the Supabase Auth Site URL to `https://ledgerly-gilt-nine-25.vercel.app` and add the same origin to allowed redirect URLs.
2. Enable and test email confirmation, password recovery and sign-out; configure SMTP for reliable production delivery.
3. Create Google and Microsoft Entra OAuth clients and place their client credentials in Supabase Auth settings only.
4. Test cross-user RLS isolation, sync conflicts, and local/remote merge with disposable accounts and backup data.

The snapshot adapter has revision conflict checks and an explicit merge prompt. It is an initial cloud foundation, not a substitute for normalized financial tables or full concurrency/recovery testing. Never silently overwrite cloud data with local state.

## Vercel deployment

Production URL: **https://ledgerly-gilt-nine-25.vercel.app**

The latest observed production deployment is Ready and reports its Git source as https://github.com/webt3ch/Ledgerly, branch `main`. Pushes to `main` are deploying through Vercel's Git integration. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the project identifiers and Auth redirect configuration.

The alternate workflow [`.github/workflows/deploy-vercel.yml`](.github/workflows/deploy-vercel.yml) is deliberately gated off. Use the native Git integration unless you intentionally choose a separately configured GitHub Actions deploy.

## Notifications

Browser notification permission is requested only after the user initiates the action. Remote push/email notifications are not active: they require a scheduler/worker, delivery provider, stored endpoint subscriptions/credentials, consent handling and real delivery tests.

## Quality and security

- Run static release validation with `node scripts/verify-release.mjs`.
- GitHub Actions quality checks run on pushes/pull requests to `main`.
- Review [`SECURITY.md`](SECURITY.md) before deploying.
- Do not use real bank credentials or highly sensitive financial documents in a public beta.
- Production readiness requires verified auth callbacks, reliable password recovery, cross-user RLS tests, backup/restore, cloud export/deletion and conflict handling.

## License

MIT. See [`LICENSE`](LICENSE).
