import { registry, uid } from './registry';
import { about } from '../data/about';
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
        { id: uid(), text: `  ${about.role}`, className: 'bright' },
        { id: uid(), text: '' },
        { id: uid(), text: `  Lieu       : ${about.location}` },
        { id: uid(), text: `  Statut     : ${about.status}` },
        { id: uid(), text: `  Entreprise : ${about.company}` },
        { id: uid(), text: `  Email      : ${about.email}` },
        { id: uid(), text: '' },
        ...about.summary.map((line) => ({
          id: uid(),
          text: line ? `  ${line}` : '',
        })),
        { id: uid(), text: '' },
      ],
    };
  },
};

registry.register(whoami);
