import { registry, uid } from './registry';
import { about } from '../data/about';
import { l } from '../i18n/l';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const whoami: CommandDefinition = {
  name: 'whoami',
  aliases: [],
  description: 'Display user identity',
  usage: 'whoami',
  category: 'info',
  execute: () => {
    return {
      lines: [
        { id: uid(), text: '' },
        { id: uid(), text: `  ${about.name}`, className: 'highlight' },
        { id: uid(), text: `  ${l(about.role)}`, className: 'bright' },
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('label.location')}    : ${l(about.location)}` },
        { id: uid(), text: `  ${t('label.status')}      : ${l(about.status)}` },
        { id: uid(), text: `  ${t('label.company')}     : ${about.company}` },
        { id: uid(), text: `  ${t('label.email')}       : ${about.email}` },
        { id: uid(), text: '' },
        ...l(about.summary).map((line) => ({
          id: uid(),
          text: line ? `  ${line}` : '',
        })),
        { id: uid(), text: '' },
      ],
    };
  },
};

registry.register(whoami);
