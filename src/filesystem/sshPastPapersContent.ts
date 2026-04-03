import type { FSDirectory, FSFile } from './virtualFS';
import { file, dir, ensureDir } from './fsHelpers';

const sourceFiles = import.meta.glob(
  ['/src/data/ssh-sources/past-papers-app/**/*', '/src/data/ssh-sources/past-papers-app/**/.*'],
  {
    query: '?raw',
    import: 'default',
    eager: true,
  }
) as Record<string, string>;

const BASE_PREFIX = '/src/data/ssh-sources/past-papers-app/';

export function buildPastPapersHome(): FSDirectory {
  const tree: Record<string, FSFile | FSDirectory> = {};

  for (const [path, content] of Object.entries(sourceFiles)) {
    const relative = path.startsWith(BASE_PREFIX)
      ? path.slice(BASE_PREFIX.length)
      : path;
    const parts = relative.split('/');
    const fileName = parts.pop()!;
    const parent = ensureDir(tree, parts);
    parent[fileName] = file(fileName, content);
  }

  if (Object.keys(tree).length === 0) {
    tree['README.md'] = file(
      'README.md',
      '# Past Papers App\n\nSource files not yet synced.\nRun the update-ssh-sources workflow or check back later.',
    );
  }

  return dir('antoine', tree);
}
