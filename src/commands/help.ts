import { registry, uid } from './registry';
import type { CommandDefinition } from '../types';

const help: CommandDefinition = {
  name: 'help',
  aliases: ['?'],
  description: 'List available commands',
  usage: 'help',
  category: 'system',
  execute: () => {
    const categories: Record<string, string> = {
      navigation: 'Navigation',
      info: 'Information',
      system: 'System',
      action: 'Actions',
    };

    const lines = [
      { id: uid(), text: '' },
      { id: uid(), text: '  Available commands:', className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const [cat, label] of Object.entries(categories)) {
      const cmds = registry.getByCategory(cat);
      if (cmds.length === 0) continue;

      lines.push({ id: uid(), text: `  ${label}:`, className: 'bright' });
      for (const cmd of cmds) {
        const aliases =
          cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
        lines.push({
          id: uid(),
          text: `    ${cmd.usage.padEnd(32)} ${cmd.description}${aliases}`,
        });
      }
      lines.push({ id: uid(), text: '' });
    }

    lines.push({
      id: uid(),
      text: '  Use Tab for autocompletion, ↑/↓ for history.',
      className: 'dim',
    });
    lines.push({ id: uid(), text: '' });

    return { lines };
  },
};

registry.register(help);
