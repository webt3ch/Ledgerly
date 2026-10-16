# Ledgerly

**Personal finance workspace · local-first beta · Italian / English / Spanish**

Ledgerly is a glassmorphism-inspired finance tracker for transactions, subscriptions, budgets, merchants, categories and personal finance analytics.

## Release status

The local-first application package is prepared separately as Ledgerly 1.5.0. The GitHub repository is being initialized; the core frontend bundle has **not yet been committed to this repository** and Vercel has no successful application deployment yet.

Cloud authentication, cross-device sync and remote notifications are not active. Do not represent the current local-first application as an authenticated cloud service.

## Release contents

The intended public release has an empty financial workspace by default and stores records in the current browser. Its beta archive is restricted to historical screenshots under `beta/images/`; beta application source and seeded test finance data must not be included in the official release.

## Cloud production architecture

- Supabase Auth for email/password, Google and Microsoft identity.
- PostgreSQL with Row-Level Security and user-scoped data access.
- Vercel for web hosting and server-side runtime; GitHub for source control and CI.
- Remote email and Web Push only after explicit opt-in and provider configuration.

See [Authentication setup](docs/AUTH_SETUP.md), the sample environment settings in `.env.example`, and the initial profile/preferences/sync-envelope migration in `supabase/migrations/`.

## Security requirements

Never commit Supabase service-role keys, database passwords, OAuth client secrets, Resend API keys, or VAPID private keys. Only browser-safe Supabase URL and publishable/anon key may be exposed client-side. RLS and cross-user access tests are go-live blockers.

## Hosting

Vercel is the intended host because Ledgerly will need more than static files once cloud authentication, data APIs and notification workers are connected. A GitHub Pages deployment would only serve the static local-first frontend.

## Next release gates

1. Commit the complete application source into this repository.
2. Link the repository to Vercel and verify a successful deployment.
3. Provision Supabase, configure email/Google/Microsoft providers, apply migrations and connect the frontend.
4. Implement and test explicit local-to-cloud migration and per-user isolation.
5. Enable remote notifications only after opt-in and delivery tests.
