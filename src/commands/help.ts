import { registry, uid } from './registry';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const CATEGORY_KEYS: Record<string, string> = {
  navigation: 'help.cat_navigation',
  info: 'help.cat_info',
  system: 'help.cat_system',
  action: 'help.cat_action',
};

const help: CommandDefinition = {
  name: 'help',
  aliases: ['?'],
  description: 'List available commands',
  usage: 'help',
  category: 'system',
  execute: () => {
    const lines = [
      { id: uid(), text: '' },
      { id: uid(), text: `  ${t('help.title')}`, className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const [cat, tKey] of Object.entries(CATEGORY_KEYS)) {
      const cmds = registry.getByCategory(cat);
      if (cmds.length === 0) continue;

      lines.push({ id: uid(), text: `  ${t(tKey)} :`, className: 'bright' });
      for (const cmd of cmds) {
        const desc = t(`cmd.${cmd.name}`);
        const aliases =
          cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
        const usageLines = cmd.usage.split('\n');
        lines.push({
          id: uid(),
          text: `    ${usageLines[0].padEnd(32)} ${desc}${aliases}`,
        });
        for (let i = 1; i < usageLines.length; i++) {
          lines.push({
            id: uid(),
            text: `    ${usageLines[i]}`,
          });
        }
      }
      lines.push({ id: uid(), text: '' });
    }

    lines.push({
      id: uid(),
      text: `  ${t('help.hint')}`,
      className: 'dim',
    });
    lines.push({ id: uid(), text: '' });

    return { lines };
  },
};

registry.register(help);
