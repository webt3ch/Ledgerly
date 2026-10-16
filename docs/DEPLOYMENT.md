# Vercel deployment

Ledgerly is a static frontend with optional Supabase Auth/Postgres cloud features. Vercel is the intended host. A project named `ledgerly` exists in the connected Vercel account, but the deployment API currently returns HTTP 403 for deployment creation. The repository therefore ships a GitHub Actions deployment workflow as the reliable, user-owned path.

## GitHub Actions deployment

Workflow: `.github/workflows/deploy-vercel.yml` (runs on pushes to `main` and manual dispatch).

In GitHub → Settings → Secrets and variables → Actions, create these repository secrets:

- `VERCEL_TOKEN`: a personal token created in Vercel by the repository owner.
- `VERCEL_ORG_ID`: the Vercel team/account ID for the project.
- `VERCEL_PROJECT_ID`: the project ID for `ledgerly`.

Find the exact `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` in the project's Vercel settings, or in `.vercel/project.json` after linking the repository locally. Never put the token into a source file, issue, README or chat.

Then run Actions → Deploy production to Vercel → Run workflow, or push a tested commit to `main`. Confirm the action succeeds and open the URL printed by the Vercel CLI. Do not declare the site public until that URL has been checked in a browser.

## Supabase public frontend configuration

The application uses a browser-safe `config.js`. Only the Supabase Project URL and anon/publishable key may be placed there. These values identify the public project and are not service-role credentials; database Row-Level Security is mandatory.

- `supabaseUrl`: Supabase Project URL.
- `supabaseAnonKey`: Supabase anon/publishable key.

The values are currently blank, so cloud auth and sync are intentionally unavailable. Configure Auth redirect URLs for the Vercel production URL and required preview URLs after the first successful deployment. Provider secrets stay in Supabase Auth settings, never in GitHub.

## Release gates

- Production URL serves the complete app and its assets with HTTPS.
- Check desktop, tablet, mobile, console errors, and network failures.
- Test email registration, email confirmation, password recovery, Google OAuth and Microsoft OAuth with real test accounts.
- Test local-to-cloud migration with backup and confirmation.
- Verify two-user RLS isolation, revision-conflict handling, export and cloud account deletion.
- Notifications must be called enabled only after a server scheduler/provider is set up and delivery is tested.

## Scope

GitHub Pages can serve only the static UI; it does not run the backend API or a scheduled notification worker. Vercel is preferred because it can host the frontend and later server-side functions. A working deployment alone does not make OAuth, sync or notifications active.
