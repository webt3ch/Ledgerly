# Vercel deployment

Ledgerly is a static frontend with optional Supabase Auth/Postgres cloud features. Vercel is the intended host. A project named `ledgerly` exists, but the connected Vercel integration returns HTTP 403 when it tries to create a deployment. No live URL is verified yet. The repository therefore contains a GitHub Actions deployment workflow as the user-owned path.

## Project identifiers

The Vercel project configured in this workspace is:

- Project name: `ledgerly`
- `VERCEL_ORG_ID`: `team_iw31igYiNn85F7merzqhReAl`
- `VERCEL_PROJECT_ID`: `prj_9GJokHcNGAVNKiLlxusI1ereLd8Y`

If the project is moved to another Vercel team, replace these values with the identifiers shown in that team's project settings.

## GitHub Actions deployment

Workflow: `.github/workflows/deploy-vercel.yml`. It validates the frontend and deploys prebuilt output on pushes to `main` or manual dispatch, **but only when** the repository Actions variable `VERCEL_DEPLOY_ENABLED` equals `true`.

In GitHub → Settings → Secrets and variables → Actions, create these repository secrets:

- `VERCEL_TOKEN`: a personal token created in Vercel by the repository owner.
- `VERCEL_ORG_ID`: `team_iw31igYiNn85F7merzqhReAl`
- `VERCEL_PROJECT_ID`: `prj_9GJokHcNGAVNKiLlxusI1ereLd8Y`

Then create an Actions variable named `VERCEL_DEPLOY_ENABLED` with value `true`. The Vercel token must be generated in your Vercel account and pasted directly into GitHub Secrets—never send it in chat or commit it to a file.

Run Actions → Deploy production to Vercel → Run workflow, or push a tested commit to `main`. Confirm the action succeeds, open the URL printed by the Vercel CLI and test the live page before calling Ledgerly published.

## Supabase public frontend configuration

The application uses a browser-safe `config.js`. Only the Supabase Project URL and anon/publishable key may be placed there. These browser values identify the public project; they are not service-role credentials. Database Row-Level Security is mandatory.

- `supabaseUrl`: Supabase Project URL.
- `supabaseAnonKey`: Supabase anon/publishable key.

The values are currently blank, so cloud auth and sync are intentionally unavailable. Configure Auth redirect URLs for the Vercel production URL and required preview URLs after the first successful deployment. Provider secrets stay in Supabase Auth settings, never in GitHub.

## Release gates

- Production URL serves the complete app and its assets with HTTPS.
- Check desktop, tablet, mobile, console errors, and network failures.
- Test email registration, email confirmation, password recovery, Google OAuth and Microsoft OAuth with real test accounts.
- Test local-to-cloud migration with backup and confirmation.
- Verify two-user authorization/RLS isolation, revision-conflict handling, export and cloud account deletion.
- Notifications must be called enabled only after a server scheduler/provider is set up and delivery is tested.

## Scope

GitHub Pages can serve only the static UI; it does not run a backend API or scheduled notification worker. Vercel is preferred because it can host the frontend and later server-side functions. A working deployment alone does not make OAuth, sync or notifications active.
