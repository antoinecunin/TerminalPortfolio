import { registry, uid } from './registry';
import { fs } from '../filesystem/content';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import { escapeHtml } from '../utils/escapeHtml';
import type { CommandDefinition, CommandContext, CommandOutput, OutputLine } from '../types';

function getCwd(): string {
  return useTerminalStore.getState().cwd;
}

// --- ls ---
const ls: CommandDefinition = {
  name: 'ls',
  aliases: [],
  description: 'List directory contents',
  usage: 'ls [-a] [-l] [path]',
  category: 'navigation',
  execute: (ctx: CommandContext): CommandOutput => {
    const target = ctx.args[0] || '.';
    const cwd = getCwd();
    const showHidden = !!ctx.flags['a'];
    const longFormat = !!ctx.flags['l'];

    const nodes = fs.ls(target, cwd);
    if (!nodes) {
      // Maybe it's a file
      if (fs.exists(target, cwd)) {
        return {
          lines: [{ id: uid(), text: target }],
        };
      }
      return {
        lines: [
          {
            id: uid(),
            text: `ls: '${target}': ${t('fs.no_such_file')}`,
            className: 'error',
          },
        ],
      };
    }

    const filtered = showHidden
      ? nodes
      : nodes.filter((n) => !n.name.startsWith('.'));

    // Add . and .. when -a is used
    const entries = showHidden
      ? [
          { name: '.', type: 'directory' as const },
          { name: '..', type: 'directory' as const },
          ...filtered,
        ]
      : filtered;

    if (entries.length === 0) {
      return { lines: [] };
    }

    if (longFormat) {
      const lines = entries.map((node) => ({
        id: uid(),
        text: `  ${node.type === 'directory' ? 'd' : '-'}  ${node.name}${node.type === 'directory' ? '/' : ''}`,
        className: node.type === 'directory' ? 'highlight' : undefined,
      }));
      return { lines };
    }

    // Default: compact listing
    // Color directories differently
    const lines = entries.map((n) => ({
      id: uid(),
      text: `  ${n.type === 'directory' ? n.name + '/' : n.name}`,
      className: n.type === 'directory' ? 'highlight' : undefined,
    }));

    return { lines };
  },
};

// --- cd ---
const cd: CommandDefinition = {
  name: 'cd',
  aliases: [],
  description: 'Change directory',
  usage: 'cd [path]',
  category: 'navigation',
  execute: (ctx: CommandContext): CommandOutput => {
    const target = ctx.args[0] || '~';
    const cwd = getCwd();
    const absolute = fs.toAbsolute(target, cwd);

    if (!fs.isDirectory(target, cwd)) {
      if (fs.exists(target, cwd)) {
        return {
          lines: [
            {
              id: uid(),
              text: `bash: cd: ${target}: ${t('fs.not_directory')}`,
              className: 'error',
            },
          ],
        };
      }
      return {
        lines: [
          {
            id: uid(),
            text: `bash: cd: ${target}: ${t('fs.no_such_file')}`,
            className: 'error',
          },
        ],
      };
    }

    useTerminalStore.getState().setCwd(absolute);
    return { lines: [] };
  },
};

// --- cat ---
const cat: CommandDefinition = {
  name: 'cat',
  aliases: [],
  description: 'Display file contents',
  usage: 'cat <file>',
  category: 'navigation',
  execute: (ctx: CommandContext): CommandOutput => {
    if (ctx.args.length === 0) {
      return {
        lines: [
          { id: uid(), text: t('fs.usage_cat'), className: 'dim' },
        ],
      };
    }

    const cwd = getCwd();
    const results: { id: string; text: string; className?: string }[] = [];

    for (const arg of ctx.args) {
      const content = fs.cat(arg, cwd);
      if (content === null) {
        if (fs.isDirectory(arg, cwd)) {
          results.push({
            id: uid(),
            text: `cat: ${arg}: ${t('fs.is_directory')}`,
            className: 'error',
          });
        } else {
          results.push({
            id: uid(),
            text: `cat: ${arg}: ${t('fs.no_such_file')}`,
            className: 'error',
          });
        }
        continue;
      }

      // Split content into lines and make URLs clickable
      const contentLines = content.split('\n');
      for (const line of contentLines) {
        const htmlLine = linkify(line);
        if (htmlLine !== line) {
          results.push({ id: uid(), text: htmlLine, isHtml: true } as OutputLine);
        } else {
          results.push({ id: uid(), text: line });
        }
      }
    }

    return { lines: results };
  },
};

// --- pwd ---
const pwd: CommandDefinition = {
  name: 'pwd',
  aliases: [],
  description: 'Print working directory',
  usage: 'pwd',
  category: 'navigation',
  execute: (): CommandOutput => {
    return {
      lines: [{ id: uid(), text: getCwd() }],
    };
  },
};

// --- tree ---
const tree: CommandDefinition = {
  name: 'tree',
  aliases: [],
  description: 'Display directory tree',
  usage: 'tree [path]',
  category: 'navigation',
  execute: (ctx: CommandContext): CommandOutput => {
    const target = ctx.args[0] || '.';
    const cwd = getCwd();
    const entries = fs.tree(target, cwd);

    if (!entries) {
      return {
        lines: [
          {
            id: uid(),
            text: `tree: '${target}': ${t('fs.no_such_file')}`,
            className: 'error',
          },
        ],
      };
    }

    // Show root name
    const node = fs.resolve(target, cwd);
    const rootName = node ? node.name : target;

    const lines: OutputLine[] = [
      { id: uid(), text: rootName + '/', className: 'highlight' },
      ...entries.map((e) => ({
        id: uid(),
        text: e.text,
        className: e.isDirectory ? 'highlight' : undefined,
      })),
    ];

    // Count
    const dirs = entries.filter((e) => e.isDirectory).length;
    const files = entries.filter((e) => !e.isDirectory).length;
    lines.push({ id: uid(), text: '' });
    lines.push({
      id: uid(),
      text: `${dirs} ${t(dirs === 1 ? 'fs.dir' : 'fs.dirs')}, ${files} ${t(files === 1 ? 'fs.file' : 'fs.files')}`,
      className: 'dim',
    });

    return { lines };
  },
};

/** Turn URLs in text into clickable <a> tags (escapes non-URL parts to prevent XSS) */
function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: string[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = urlRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(escapeHtml(text.slice(lastIdx, m.index)));
    }
    const url = m[0];
    parts.push(`<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`);
    lastIdx = urlRegex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(escapeHtml(text.slice(lastIdx)));
  }
  return parts.join('');
}

registry.register(ls);
registry.register(cd);
registry.register(cat);
registry.register(pwd);
registry.register(tree);
