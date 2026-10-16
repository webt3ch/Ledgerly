import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const html = readFileSync('index.html', 'utf8');
const config = readFileSync('config.js', 'utf8');
const identityMigration = readFileSync('supabase/migrations/001_profile_preferences_and_workspace.sql', 'utf8');
const triggerHardening = readFileSync('supabase/migrations/002_restrict_profile_trigger_execution.sql', 'utf8');
const grantsMigration = readFileSync('supabase/migrations/003_least_privilege_table_grants.sql', 'utf8');

assert.match(html, /<!doctype html>/i, 'index.html must be a complete HTML document');
assert.match(html, /id="cloudAccountButton"/, 'Cloud account entry point is required');
assert.match(html, /signInWithPassword/, 'Email/password sign-in path must exist');
assert.match(html, /signUp\(/, 'Email registration path must exist');
assert.match(html, /signInWithOAuth/, 'OAuth sign-in path must exist');
assert.match(html, /provider=action==='google'\?'google':'azure'/, 'Google and Microsoft/Azure provider paths must exist');
assert.match(html, /workspace_snapshots/, 'Cloud workspace adapter must target the RLS-protected snapshot table');
assert.match(html, /cloudSyncConflict/, 'Cloud write conflicts must be guarded');
assert.match(html, /transactions:\[\],subscriptions:\[\],budgets:\[\],notifications:\[\]/, 'New workspaces must not seed financial demo records');

assert.match(config, /supabaseUrl:\s*"https:\/\/[a-z0-9-]+\.supabase\.co"/i, 'A valid Supabase Project URL must be configured');
assert.match(config, /supabasePublishableKey:\s*"sb_publishable_[A-Za-z0-9_-]+"/, 'A public Supabase publishable key must be configured');
assert.doesNotMatch(config, /sb_secret_[A-Za-z0-9_-]+|SUPABASE_SERVICE_ROLE_KEY|-----BEGIN (?:RSA )?PRIVATE KEY-----/i, 'Server-only Supabase keys/private keys must never be committed');

assert.match(identityMigration, /alter table public\.workspace_snapshots enable row level security/i, 'Cloud snapshots must enable RLS');
assert.match(identityMigration, /workspace_snapshot_update_own[\s\S]*auth\.uid\(\)/i, 'Cloud snapshot policy must enforce ownership');
assert.match(triggerHardening, /revoke all on function public\.handle_new_user\(\) from anon/i, 'Trigger helper must not be directly executable by anon');
assert.match(grantsMigration, /grant select, insert, update on table public\.workspace_snapshots to authenticated/i, 'Authenticated sync must have minimum snapshot table privileges');
assert.match(grantsMigration, /revoke all on table public\.workspace_snapshots from anon, authenticated/i, 'Snapshot privileges must be explicitly restricted before grants');

const temp = mkdtempSync(join(tmpdir(), 'ledgerly-inline-'));
try {
  let checked = 0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(match[1])) continue;
    const source = match[2].trim();
    if (!source) continue;
    const path = join(temp, `inline-${checked}.js`);
    writeFileSync(path, source);
    execFileSync(process.execPath, ['--check', path], { stdio: 'pipe' });
    checked += 1;
  }
  assert.ok(checked >= 2, 'Expected inline configuration and application scripts');
  console.log(`Ledgerly static release checks passed; ${checked} inline scripts passed Node syntax checks.`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
