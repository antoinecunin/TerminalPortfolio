import type { FSDirectory, FSFile } from './virtualFS';

// Vite reads all git-tracked text files at build time.
// Excludes: binaries (woff2, png), package-lock.json, .gitignore
const sourceFiles = import.meta.glob(
  [
    '/src/**/*.{ts,tsx,css}',
    '/public/**/*.{txt,xml,svg}',
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

function file(name: string, content: string): FSFile {
  return { type: 'file', name, content };
}

function dir(name: string, children: Record<string, FSFile | FSDirectory>): FSDirectory {
  return { type: 'directory', name, children };
}

function ensureDir(root: Record<string, FSFile | FSDirectory>, parts: string[]): Record<string, FSFile | FSDirectory> {
  let current = root;
  for (const part of parts) {
    if (!current[part]) {
      current[part] = dir(part, {});
    }
    const node = current[part];
    if (node.type === 'directory') {
      current = node.children;
    }
  }
  return current;
}

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
