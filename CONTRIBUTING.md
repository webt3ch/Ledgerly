# Contributing

Thanks for contributing to Ledgerly.

## Before opening a pull request
- Keep financial calculation rules centralized and add regression tests for changes.
- Preserve the empty, local-first initial workspace.
- Keep Italian, English and Spanish UI copy aligned.
- Never commit real personal financial data, OAuth client secrets, service-role keys, DB passwords, email API keys or VAPID private keys.
- Mark integrations as unavailable until they have been configured and tested against real services.

## Validation
Run `node scripts/verify-release.mjs`. Changes to database policies or auth flows should include a migration and tests demonstrating that one user cannot read or mutate another user's data.
