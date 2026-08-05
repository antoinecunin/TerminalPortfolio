/**
 * Bulk import wrapper — runs on the host, delegates to the API container.
 *
 * Usage: npm run import -- [dev|prod] <directory> <pattern> [--dry-run] [--help]
 *
 * This script:
 * 1. Detects the running API container (dev or prod)
 * 2. Copies PDF files into the container
 * 3. Runs the TypeScript import script inside the container via docker exec
 * 4. Cleans up temporary files
 */

import { execSync, execFileSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

// ─── Colors ───

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
};

function logSuccess(msg: string) {
  console.log(`${colors.green}${msg}${colors.reset}`);
}
function logError(msg: string) {
  console.log(`${colors.red}${msg}${colors.reset}`);
}

// ─── Detect API container ───

const CONTAINERS = { dev: 'annales-api-dev', prod: 'annales-api' } as const;

/**
 * Pick the API container to import into. Names are global to the host, so a
 * development stack running anywhere used to win over the production one, and
 * the import silently landed in the wrong instance. Exact names, never
 * substrings: 'annales-api-dev' contains 'annales-api'.
 */
function detectContainer(mode?: 'dev' | 'prod'): string {
  const running = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf-8' })
    .split('\n')
    .map(name => name.trim())
    .filter(Boolean);

  const order = mode ? [mode] : (['dev', 'prod'] as const);
  const found = order.find(name => running.includes(CONTAINERS[name]));

  if (found) {
    logSuccess(`🔍 ${found === 'dev' ? 'Development' : 'Production'} mode detected`);
    return CONTAINERS[found];
  }

  logError(
    mode ? `❌ No running ${mode} API container found.` : '❌ No active API container found.'
  );
  console.log('Start services first: npm start -- dev (or npm start -- prod)');
  process.exit(1);
}

// ─── Docker helpers ───

function dockerExec(container: string, command: string[]): void {
  execFileSync('docker', ['exec', container, ...command], { stdio: 'ignore' });
}

function dockerCp(src: string, dest: string): void {
  execFileSync('docker', ['cp', src, dest], { stdio: 'ignore' });
}

function dockerExecInteractive(container: string, command: string[]): void {
  const flags = process.stdin.isTTY ? ['-it'] : ['-i'];
  execFileSync('docker', ['exec', ...flags, container, ...command], {
    stdio: 'inherit',
  });
}

// ─── Main ───

const rawArgs = process.argv.slice(2);
const isMode = (a: string): a is 'dev' | 'prod' => a === 'dev' || a === 'prod';
const mode = rawArgs.find(isMode);
// The mode never reaches the in-container script, which knows nothing about it.
const args = rawArgs.filter(a => !isMode(a));
const container = detectContainer(mode);

// Find the directory argument (first non-flag positional arg)
let directory = '';
for (const arg of args) {
  if (!arg.startsWith('-')) {
    directory = arg;
    break;
  }
}

const containerArgs = [...args];
let copied = false;

if (directory && existsSync(directory) && statSync(directory).isDirectory()) {
  const absDir = resolve(directory);

  // Copy entire directory into the container (recursive, preserves structure)
  console.log('📦 Copying files into the container...');
  dockerExec(container, ['rm', '-rf', '/tmp/import-pdfs']);
  dockerCp(absDir, `${container}:/tmp/import-pdfs`);
  logSuccess('   ✓ Directory copied');
  copied = true;

  // Replace directory argument with container path
  const dirIndex = containerArgs.indexOf(directory);
  if (dirIndex !== -1) {
    containerArgs[dirIndex] = '/tmp/import-pdfs';
  }
}

// Run the import script inside the container
console.log('');
let exitCode = 0;
try {
  const isDev = container.includes('-dev');
  const cmd = isDev
    ? ['npx', 'tsx', 'src/scripts/import.ts', ...containerArgs]
    : ['node', 'dist/scripts/import.js', ...containerArgs];
  dockerExecInteractive(container, cmd);
} catch (err) {
  // Forward the exit code from the container script
  exitCode = (err as { status?: number }).status ?? 1;
} finally {
  if (copied) {
    try {
      dockerExec(container, ['rm', '-rf', '/tmp/import-pdfs']);
    } catch {
      // Ignore cleanup errors
    }
  }
}
process.exit(exitCode);
