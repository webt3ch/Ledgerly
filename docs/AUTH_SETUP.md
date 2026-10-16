# Ledgerly authentication and cloud activation

The Supabase project and base database schema are provisioned. The frontend uses a browser-safe public configuration in `config.js`; this enables the Auth and snapshot-sync code path, but production behavior still requires the final origin configuration and real provider setup/testing.

## Current Supabase project

- Project ref: `uqddabngitzbzqpmkquz`
- Project URL: `https://uqddabngitzbzqpmkquz.supabase.co`
- Migrations applied: `001_profile_preferences_and_workspace`, `002_restrict_profile_trigger_execution`, `003_least_privilege_table_grants`
- Public key: publishable key configured in `config.js`. It is intentionally public; never add a service-role/secret key to the frontend.

## Supabase Auth

1. In **Authentication → URL Configuration**, set the Site URL to `https://ledgerly-gilt-nine-25.vercel.app`.
2. Add `https://ledgerly-gilt-nine-25.vercel.app/**` to allowed redirect URLs. Add preview origins only if they will be used.
3. Confirm email/password sign-up is enabled; configure email confirmation and password recovery templates. A production SMTP provider may be needed for reliable delivery.
4. Configure provider credentials only in **Authentication → Sign In / Providers**. The app calls Google as `google` and Microsoft as Supabase's `azure` provider.
5. After deployment, test sign-up, confirmation, sign-in, password recovery, sign-out, OAuth redirects and cross-device sync with disposable test accounts.

## Google

Create an OAuth client in Google Cloud Console and add the exact Supabase callback URI shown in Supabase's provider settings as an authorized redirect URI. Store the client secret only in Supabase provider configuration, never in GitHub or client-side JavaScript.

## Microsoft

Register an application in Microsoft Entra ID, select the intended account types, and configure the exact Supabase callback URI. Store the client secret in Supabase only. The frontend uses Supabase provider `azure` and requests the `email` scope. Validate the intended account types and consent behavior with test accounts.

## Cloud data and safety

- `workspace_snapshots` stores one bounded JSON snapshot per authenticated user. RLS and explicit database grants restrict rows and operations to the signed-in owner.
- The adapter uses a revision check and explicit merge prompt when local and remote data both contain finance records. Do not test with real sensitive financial records.
- Create a JSON backup before migrating valuable local data. The initial sync layer is a transitional snapshot model, not yet normalized financial tables.
- Verify with two test users that neither can read nor overwrite the other's data. Supabase security advisors currently report no findings, but that does not replace end-to-end RLS tests.
- Browser notifications are only a local permission preference. Remote email/push notifications and server-side scheduling are not active.

## Vercel runtime configuration

The frontend reads `supabaseUrl` and `supabasePublishableKey` from `config.js`. The URL and publishable key are public browser settings and can be committed; they are protected by RLS and must never be substituted with service-role or secret keys.

Never expose `SUPABASE_SERVICE_ROLE_KEY`, database passwords, OAuth client secrets, mail-provider API keys or VAPID private keys to the browser. Server secrets belong in encrypted server-side environment variables or Supabase Auth provider settings.

## Go-live gates

- Supabase Site URL and allowed redirect URLs match the real Vercel production URL.
- Email confirmation and recovery messages are delivered reliably.
- Google and Microsoft OAuth credentials are configured and their callbacks tested.
- Two-user RLS isolation, concurrent revision conflicts, backup/restore, export/deletion and local-to-cloud merge are tested.
- The UI makes local vs cloud-synced state clear.
