import { registry, uid } from './registry';
import { contact } from '../data/contact';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const TARGETS: Record<string, { url: string; label: string }> = {
  linkedin: { url: contact.linkedin, label: 'LinkedIn' },
  github: { url: contact.github, label: 'GitHub' },
  calendly: { url: contact.calendly, label: 'Calendly' },
  email: { url: `mailto:${contact.email}`, label: 'Email' },
  mail: { url: `mailto:${contact.email}`, label: 'Email' },
  website: { url: contact.website, label: 'Website' },
};

const TARGET_NAMES = Object.keys(TARGETS).filter((n) => n !== 'mail');

const xdgOpen: CommandDefinition = {
  name: 'xdg-open',
  aliases: [],
  description: 'Open a link in browser',
  usage: 'xdg-open <target>',
  category: 'action',
  completeArgs: (partial) =>
    TARGET_NAMES.filter((name) => name.startsWith(partial)),
  execute: (ctx) => {
    const target = ctx.args[0]?.toLowerCase();

    if (!target) {
      const lines = [
        { id: uid(), text: `  ${t('open.usage')}`, className: 'dim' },
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('open.available')}`, className: 'highlight' },
        { id: uid(), text: '' },
      ];
      for (const name of TARGET_NAMES) {
        lines.push({
          id: uid(),
          text: `    ${name.padEnd(12)} — ${TARGETS[name].label}`,
        });
      }
      lines.push({ id: uid(), text: '' });
      return { lines };
    }

    const entry = TARGETS[target];
    if (!entry) {
      return {
        lines: [
          { id: uid(), text: `  xdg-open: ${t('open.unknown', target)}`, className: 'error' },
          { id: uid(), text: `  ${t('open.available_list')}: ${TARGET_NAMES.join(', ')}`, className: 'dim' },
        ],
      };
    }

    window.open(entry.url, '_blank', 'noopener,noreferrer');

    return {
      lines: [
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('open.opening', entry.label)}`, className: 'highlight' },
        { id: uid(), text: `  ${entry.url}`, className: 'dim' },
        { id: uid(), text: '' },
      ],
    };
  },
};

registry.register(xdgOpen);
