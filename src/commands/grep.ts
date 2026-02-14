import { registry, uid } from './registry';
import { fs } from '../filesystem/content';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const grep: CommandDefinition = {
  name: 'grep',
  aliases: [],
  description: 'Search for a pattern in files',
  usage: 'grep <pattern> [path]',
  category: 'navigation',
  execute: (ctx) => {
    const pattern = ctx.args[0];

    if (!pattern) {
      return {
        lines: [
          { id: uid(), text: `  ${t('grep.usage')}`, className: 'dim' },
        ],
      };
    }

    const cwd = useTerminalStore.getState().cwd;
    const searchPath = ctx.args[1] || '.';
    const caseInsensitive = !!ctx.flags['i'];

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, caseInsensitive ? 'gi' : 'g');
    } catch {
      return {
        lines: [
          {
            id: uid(),
            text: `  grep: ${t('grep.invalid_regex', pattern)}`,
            className: 'error',
          },
        ],
      };
    }

    const files = fs.getAllFiles(searchPath, cwd);
    const home = '/home/antoine';
    const results: { id: string; text: string; isHtml: boolean }[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      for (const line of lines) {
        if (regex.test(line)) {
          // Reset lastIndex for global regex
          regex.lastIndex = 0;

          const displayPath = file.path.startsWith(home)
            ? '~' + file.path.slice(home.length)
            : file.path;

          // Highlight match
          const highlighted = line.replace(
            regex,
            (match) => `<span style="color:var(--term-fg-bright);font-weight:700">${escapeHtml(match)}</span>`
          );

          results.push({
            id: uid(),
            text: `<span style="color:var(--term-highlight)">${escapeHtml(displayPath)}</span>: ${highlighted}`,
            isHtml: true,
          });
        }
      }
    }

    if (results.length === 0) {
      return {
        lines: [
          {
            id: uid(),
            text: `  ${t('grep.no_results', pattern)}`,
            className: 'dim',
          },
        ],
      };
    }

    return { lines: results };
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

registry.register(grep);
