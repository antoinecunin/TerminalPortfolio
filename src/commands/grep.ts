import { registry, uid } from './registry';
import { fs } from '../filesystem/content';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import { escapeHtml } from '../utils/escapeHtml';
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

    let regex: RegExp;
    try {
      regex = new RegExp(pattern, 'gi');
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
          regex.lastIndex = 0;

          const displayPath = file.path.startsWith(home)
            ? '~' + file.path.slice(home.length)
            : file.path;

          // Highlight match (escape all parts to prevent XSS)
          const parts: string[] = [];
          let lastIdx = 0;
          let m: RegExpExecArray | null;
          regex.lastIndex = 0;
          while ((m = regex.exec(line)) !== null) {
            if (m.index > lastIdx) {
              parts.push(escapeHtml(line.slice(lastIdx, m.index)));
            }
            parts.push(`<span style="color:var(--term-fg-bright);font-weight:700">${escapeHtml(m[0])}</span>`);
            lastIdx = regex.lastIndex;
          }
          if (lastIdx < line.length) {
            parts.push(escapeHtml(line.slice(lastIdx)));
          }
          const highlighted = parts.join('');

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

registry.register(grep);
