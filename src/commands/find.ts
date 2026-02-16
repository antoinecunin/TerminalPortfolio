import { registry, uid } from './registry';
import { fs } from '../filesystem/content';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import { HOME_PATH } from '../constants';
import type { CommandDefinition, OutputLine } from '../types';

const find: CommandDefinition = {
  name: 'find',
  aliases: [],
  description: 'Search for files by name',
  usage: 'find [path] -name <pattern>',
  category: 'navigation',
  execute: (ctx) => {
    const nameFlag = ctx.flags['name'] as string | undefined;

    if (!nameFlag) {
      return {
        lines: [
          { id: uid(), text: `  ${t('find.usage')}`, className: 'dim' },
        ],
      };
    }

    const cwd = useTerminalStore.getState().cwd;
    const searchPath = ctx.args[0] || '.';
    const pattern = nameFlag;

    // Convert glob pattern to regex (* -> .*)
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special chars
      .replace(/\*/g, '.*') // * -> .*
      .replace(/\?/g, '.'); // ? -> .

    const regex = new RegExp(regexPattern, 'i');

    const allPaths = getAllPaths(searchPath, cwd);
    const results: OutputLine[] = [];

    for (const { path, isDirectory } of allPaths) {
      const name = path.split('/').pop() || '';
      if (regex.test(name)) {
        const displayPath = path.startsWith(HOME_PATH)
          ? '~' + path.slice(HOME_PATH.length)
          : path;
        results.push({
          id: uid(),
          text: displayPath + (isDirectory ? '/' : ''),
          className: isDirectory ? 'highlight' : undefined,
        });
      }
    }

    if (results.length === 0) {
      return {
        lines: [
          {
            id: uid(),
            text: `  ${t('find.no_results', pattern)}`,
            className: 'dim',
          },
        ],
      };
    }

    return { lines: results };
  },
};

/** Get all file and directory paths recursively */
function getAllPaths(
  basePath: string,
  cwd: string
): { path: string; isDirectory: boolean }[] {
  const node = fs.resolve(basePath, cwd);
  if (!node) return [];

  const absoluteBase = fs.toAbsolute(basePath, cwd);

  if (node.type === 'file') {
    return [{ path: absoluteBase, isDirectory: false }];
  }

  const results: { path: string; isDirectory: boolean }[] = [];
  walkAll(node, absoluteBase, results);
  return results;
}

function walkAll(
  node: { type: 'file' | 'directory'; name: string; children?: Record<string, unknown> },
  currentPath: string,
  results: { path: string; isDirectory: boolean }[]
): void {
  if (node.type === 'file') {
    results.push({ path: currentPath, isDirectory: false });
    return;
  }

  results.push({ path: currentPath, isDirectory: true });

  if (node.children) {
    for (const [name, child] of Object.entries(node.children)) {
      walkAll(
        child as { type: 'file' | 'directory'; name: string; children?: Record<string, unknown> },
        `${currentPath}/${name}`,
        results
      );
    }
  }
}

registry.register(find);
