# Deployment

## Current status

The Vercel project `ledgerly` has been created, but no deployment exists yet. The GitHub repository is being initialized and the application frontend must be committed before a production deployment can be verified.

## Vercel

1. Link `webt3ch/Ledgerly` to the Vercel project.
2. Use the repository root as the root directory for the static frontend.
3. Verify a successful preview deployment before promoting a release.
4. Add only the required public Supabase URL/publishable key to the frontend build, if the frontend integration has been implemented. Keep all server-side secrets encrypted in the relevant environment.
5. Check the resulting public URL in desktop and mobile browsers and test the network console for failed assets.

## Production gates

- A real deployment URL serves the complete frontend rather than the README or a placeholder.
- Email registration, verification, recovery, Google OAuth and Microsoft OAuth each pass on the final domain.
- Local-to-cloud migration is explicit, backed up and idempotent.
- Cross-user authorization and RLS are tested with two independent test accounts.
- Data export and account deletion cover cloud data.
- Notification permission is requested only after user action; remote delivery is verified before it is described as available.

GitHub Pages is suitable only for the local-first static UI. Vercel is the intended host for this project because server-side API and worker components may be introduced.
