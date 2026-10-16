import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const html = readFileSync('index.html', 'utf8');
const config = readFileSync('config.js', 'utf8');
const migration = readFileSync('supabase/migrations/001_profile_preferences_and_workspace.sql', 'utf8');

assert.match(html, /<!doctype html>/i, 'index.html must be a complete HTML document');
assert.match(html, /id="cloudAccountButton"/, 'Cloud account entry point is required');
assert.match(html, /signInWithPassword/, 'Email/password sign-in path must exist');
assert.match(html, /signUp\(/, 'Email registration path must exist');
assert.match(html, /signInWithOAuth/, 'OAuth sign-in path must exist');
assert.match(html, /provider=action==='google'\?'google':'azure'/, 'Google and Microsoft/Azure provider paths must exist');
assert.match(html, /workspace_snapshots/, 'Cloud workspace adapter must target the RLS-protected snapshot table');
assert.match(html, /cloudSyncConflict/, 'Cloud write conflicts must be guarded');
assert.match(html, /transactions:\[\],subscriptions:\[\],budgets:\[\],notifications:\[\]/, 'New workspaces must not seed financial demo records');
assert.match(config, /supabaseUrl:\s*""/, 'Supabase URL must remain blank in public source control');
assert.match(config, /supabaseAnonKey:\s*""/, 'Supabase public key must remain blank in public source control');
assert.match(migration, /alter table public\.workspace_snapshots enable row level security/i, 'Cloud snapshots must enable RLS');
assert.match(migration, /workspace_snapshot_update_own[\s\S]*auth\.uid\(\)/i, 'Cloud snapshot policy must enforce ownership');

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
