# Security policy

Please do not publish sensitive details about a possible vulnerability in a public issue.

Until cloud services are configured, the application is local-first and browser data may be exposed through device/browser compromise. Do not enter highly sensitive financial data into an unreviewed public beta.

Never commit service-role keys, database credentials, OAuth client secrets, email API keys or VAPID private keys. Report security issues privately to the repository maintainer through GitHub's security reporting mechanism, if enabled.

Cloud release blockers include verified user isolation with RLS, OAuth callback validation, recovery flow verification, import/export review, dependency checks and tested data deletion.
