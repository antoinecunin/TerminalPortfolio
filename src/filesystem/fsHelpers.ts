import type { FSFile, FSDirectory } from './virtualFS';

export function file(name: string, content: string): FSFile {
  return { type: 'file', name, content };
}

export function dir(name: string, children: Record<string, FSFile | FSDirectory>): FSDirectory {
  return { type: 'directory', name, children };
}
