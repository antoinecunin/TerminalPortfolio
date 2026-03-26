import type { FSDirectory, FSFile } from './virtualFS';
import { file, dir, ensureDir } from './fsHelpers';

// Vite reads all git-tracked text files at build time.
// Excludes: binaries (woff2, png), package-lock.json, .gitignore
const sourceFiles = import.meta.glob(
  [
    '/src/**/*.{ts,tsx,css}',
    '!/src/data/ssh-sources/**',
    '/index.html',
    '/*.{json,ts,js}',
    '/tsconfig.*.json',
    '/vercel.json',
  ],
  {
    query: '?raw',
    import: 'default',
    eager: true,
  }
) as Record<string, string>;

// package-lock.json is matched by /*.json but is too large to show
const EXCLUDED = ['/package-lock.json'];

// Returns the "antoine" home directory (same shape as dag-visualizer builder)
export function buildPortfolioHome(): FSDirectory {
  const tree: Record<string, FSFile | FSDirectory> = {};

  for (const [path, content] of Object.entries(sourceFiles)) {
    if (EXCLUDED.includes(path)) continue;
    // path looks like "/src/main.tsx" or "/index.html"
    const clean = path.startsWith('/') ? path.slice(1) : path;
    const parts = clean.split('/');
    const fileName = parts.pop()!;
    const parent = ensureDir(tree, parts);
    parent[fileName] = file(fileName, content);
  }

  return dir('antoine', tree);
}
