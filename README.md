# Ledgerly

**Personal finance workspace · local-first by default · IT / EN / ES**

Ledgerly is a glassmorphism-inspired personal finance tracker for transactions, subscriptions, budgets, merchants, categories and financial analytics.

## Current release

- `index.html`: self-contained application frontend.
- `config.js`: intentionally blank browser-safe Supabase configuration.
- `supabase/migrations/`: initial profile, notification preferences and RLS-protected workspace snapshot migration.
- `docs/AUTH_SETUP.md`: setup instructions for email/password, Google and Microsoft OAuth.
- `docs/DEPLOYMENT.md`: Vercel deployment checklist.

The application works in local-first mode without backend credentials. A Cloud account action is wired into the frontend, but login and synchronization remain unavailable until a Supabase project is configured and its migration/provider settings are applied. This repository does not claim an active cloud service or a live Vercel deployment.

## Enable cloud sign-in and sync

1. Create a Supabase project.
2. Apply `supabase/migrations/001_profile_preferences_and_workspace.sql`.
3. Enable email/password with email verification.
4. Enable Google and Microsoft (Azure) providers in Supabase Auth and configure the callback URLs in Google Cloud / Microsoft Entra.
5. Fill only the public `supabaseUrl` and `supabaseAnonKey` values in `config.js`.
6. Add the production and preview site URLs to Supabase Auth URL Configuration and redeploy.

Never commit Supabase service-role keys, database passwords, OAuth client secrets, email-provider keys or VAPID private keys. Google/Microsoft secrets belong only in Supabase provider settings.

## Sync behavior

The initial cloud adapter uses a per-user JSONB workspace snapshot protected by Row-Level Security and a revision check. Local and cloud data are not overwritten silently: if both contain financial records, Ledgerly asks before merging by record ID; concurrent cloud edits pause sync rather than blindly overwrite the remote row. Export a local backup before using the explicit cloud-reload action.

This snapshot adapter is an initial cloud foundation, not a substitute for multi-device concurrency testing. Before a public production launch, run two-user RLS tests, email verification/recovery tests, OAuth callback tests, and migration/export/deletion tests.

## Notifications

The browser permission prompt is user-initiated. Remote email/push delivery is not activated in this release; it requires a server-side scheduler/worker, a delivery provider, VAPID/email credentials and end-to-end delivery tests.

## Hosting

Vercel remains the intended host for production. The current Vercel integration returned a permission error when creating a deployment, so no live deployment URL is available yet. See `docs/DEPLOYMENT.md`.
