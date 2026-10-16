# Vercel deployment

Ledgerly is deployed to Vercel from the GitHub repository. The latest deployment observed through the Vercel API is **READY** and identifies its source as GitHub repository `webt3ch/Ledgerly`, branch `main`.

- Production URL: https://ledgerly-gilt-nine-25.vercel.app
- Vercel project: `ledgerly`
- Project ID: `prj_9GJokHcNGAVNKiLlxusI1ereLd8Y`
- Repository: https://github.com/webt3ch/Ledgerly
- Supabase project ref: `uqddabngitzbzqpmkquz`

## Git-based deploys

The Vercel Git integration is deploying commits from `main`. Future pushes should trigger Vercel automatically. After pushing source changes, verify the newest Vercel deployment reports **Ready** and its Git metadata points to the intended commit.

The separate workflow `.github/workflows/deploy-vercel.yml` is intentionally gated off by default. Do not enable it unless there is a specific reason to use GitHub Actions instead of Vercel's native Git integration. If you enable that workflow, configure the exact Vercel token, organization ID and project ID in GitHub Actions Secrets, then set `VERCEL_DEPLOY_ENABLED=true`.

## Supabase frontend configuration

The current `config.js` contains the browser-safe Supabase Project URL and a **publishable** API key. These are public client settings by design. RLS is enabled on the exposed tables and database grants are restricted to authenticated operations; never put a service-role/secret key, database password, or OAuth client secret into this file.

Supabase project URL: https://uqddabngitzbzqpmkquz.supabase.co

## Auth redirect URLs and OAuth providers

In Supabase **Authentication → URL Configuration**:

1. Set the Site URL to `https://ledgerly-gilt-nine-25.vercel.app`.
2. Add `https://ledgerly-gilt-nine-25.vercel.app/**` to the allowed redirect URLs; add exact preview origins only if you plan to use them.
3. After the Vercel URL is confirmed, test email registration/confirmation, password recovery and sign-out.
4. Configure Google and Microsoft/Azure provider credentials in Supabase Auth. The client-side OAuth flow is implemented, but provider buttons cannot complete until provider client IDs/secrets are supplied.

For Google, add the callback URL shown in Supabase's provider panel as an authorized redirect URI in Google Cloud. For Microsoft, register an app in Microsoft Entra ID and add the exact callback URL shown in Supabase. Store those provider secrets only in Supabase, never in GitHub or the browser.

## Release gates

- Verify the page and assets on the production URL across desktop and mobile and check the browser console/network panel.
- Test registration, email confirmation, password recovery, Google OAuth and Microsoft OAuth with disposable accounts.
- Test two-user row-level isolation and concurrent snapshot revision conflicts.
- Create a backup and test local-to-cloud merge, cloud export and account/data deletion before using sensitive real data.
- Notifications are only browser permission/preferences today. Remote push/email notifications and a server-side scheduler are not implemented, so do not market them as active.

A successful Vercel build proves the static page deployed; it does not by itself prove that authentication, OAuth, email delivery, cloud sync or notifications have passed end-to-end tests.
