import type { FSFile, FSDirectory } from './virtualFS';

export function file(name: string, content: string): FSFile {
  return { type: 'file', name, content };
}

export function dir(name: string, children: Record<string, FSFile | FSDirectory>): FSDirectory {
  return { type: 'directory', name, children };
}

export function ensureDir(
  root: Record<string, FSFile | FSDirectory>,
  parts: string[],
): Record<string, FSFile | FSDirectory> {
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
