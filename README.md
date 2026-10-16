# Ledgerly

**Personal finance workspace · local-first by default · Italian / English / Spanish**

Ledgerly is a glassmorphism-inspired personal finance tracker for transactions, subscriptions, budgets, merchants, categories and financial analytics. The repository contains the self-contained frontend, the optional Supabase Auth/cloud-sync adapter, the initial PostgreSQL migration, release checks and deployment configuration.

> **Release status:** public source repository; local-first app. Cloud login and sync are prepared in code but remain unavailable until a real Supabase project and providers are configured. No live Vercel deployment has been verified yet.

## Current features

- Responsive fintech dashboard with light/dark appearance, accent palette and density settings.
- Transactions, categories, merchants, subscriptions, budgets, calendar and analytics.
- Italian, English and Spanish UI.
- Local-first mode with browser storage, CSV import/export and JSON backup.
- Optional Supabase adapter for email/password, password recovery, Google OAuth, Microsoft/Azure OAuth, profile preferences and a per-user workspace snapshot.
- PostgreSQL migration with Row-Level Security (RLS) policies for profiles, notification preferences and workspace snapshots.
- Static release validation via GitHub Actions.

## Beta visual archive

Only compressed visual references from earlier beta iterations are kept in `beta/images/`. The historical beta's code and sample personal/financial data are not included.

| Appearance | Dashboard |
|---|---|
| ![Beta appearance, light](beta/images/appearance-light-v1.4.webp) | ![Beta dashboard, desktop](beta/images/dashboard-desktop-v1.1.webp) |
| ![Beta appearance, dark](beta/images/appearance-dark-v1.4.webp) | ![Beta dashboard, mobile](beta/images/dashboard-mobile-v1.1.webp) |

These are reference screenshots of earlier iterations, not evidence that cloud features or a production deployment are live.

## Run locally

Open `index.html` in a modern browser. The app can be used locally without backend credentials. For cloud features, configure only the public Supabase Project URL and anon/publishable key in `config.js`:

    window.LEDGERLY_CONFIG = {
      supabaseUrl: "https://YOUR_PROJECT.supabase.co",
      supabaseAnonKey: "YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY"
    };

These browser values are public configuration, not secrets; Row-Level Security is mandatory. Never store service-role keys, database passwords, OAuth client secrets, email provider API keys or VAPID private keys in frontend code or GitHub.

## Configure cloud authentication and sync

Follow [`docs/AUTH_SETUP.md`](docs/AUTH_SETUP.md) and apply [`supabase/migrations/001_profile_preferences_and_workspace.sql`](supabase/migrations/001_profile_preferences_and_workspace.sql) to the intended Supabase project before enabling cloud functionality.

1. Configure Supabase Auth email/password, email confirmation and recovery templates.
2. Configure Google OAuth in Google Cloud and Microsoft OAuth in Microsoft Entra. Store provider secrets **inside Supabase Auth settings**, not in this repository.
3. Add the final Vercel production URL and intended preview URLs to Supabase Auth's site/redirect URL configuration.
4. Add the Supabase Project URL and public anon/publishable key to `config.js`.
5. Run email verification/recovery and Google/Microsoft callback tests with real test accounts.
6. Test row-level isolation using two independent users before relying on cloud sync.

The snapshot adapter has revision conflict checks and explicit local/cloud merge prompts. It is an initial cloud foundation, not a substitute for concurrency, recovery and RLS testing. Do not silently overwrite cloud data with a local workspace.

## Vercel deployment

Vercel is the intended host. A Vercel project named `ledgerly` exists, but the connected management integration returned HTTP 403 for deployment creation; there is currently no verified live URL.

The workflow [`.github/workflows/deploy-vercel.yml`](.github/workflows/deploy-vercel.yml) is prepared but **deliberately gated off** until the repository owner configures secrets and enables it.

In GitHub → Settings → Secrets and variables → Actions, configure repository secrets:

- `VERCEL_TOKEN`: token generated in your Vercel account.
- `VERCEL_ORG_ID`: account/team ID from Vercel project settings.
- `VERCEL_PROJECT_ID`: the Vercel project ID.

Then create these Actions variables: `VERCEL_DEPLOY_ENABLED=true`, `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Leave the Supabase variables blank until you have a project; once configured, the workflow injects only these browser-public values into `config.js` before building. Never use a service-role key. Run Actions → Deploy production to Vercel, or push a tested commit to `main`. Keep the Vercel token in GitHub Secrets; never put it in a file or chat. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Notifications

Browser notification permission is requested only after the user initiates the action. Remote push/email notifications are **not active** in this release: they require a scheduler/worker, a delivery provider, stored endpoint subscriptions/credentials, consent handling and real delivery tests.

## Quality and security

- Run the current static release check with `node scripts/verify-release.mjs`.
- The GitHub Actions quality workflow runs on pushes/pull requests to `main`.
- Review [`SECURITY.md`](SECURITY.md) before deploying.
- Do not use real bank credentials or highly sensitive financial documents in a public beta.
- Before calling this production-ready, verify two-user RLS isolation, auth callbacks, password recovery, local-to-cloud migration/backup, cloud export/deletion, concurrency conflicts and notification delivery.

## License

MIT. See [`LICENSE`](LICENSE).
