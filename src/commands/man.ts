import { registry, uid } from './registry';
import { experiences } from '../data/experience';
import { education } from '../data/education';
import { projects } from '../data/projects';
import { t } from '../i18n/t';
import type { CommandDefinition, OutputLine } from '../types';

const PAGES: Record<string, () => OutputLine[]> = {
  experience: () => {
    const lines: OutputLine[] = [
      { id: uid(), text: '' },
      { id: uid(), text: '  EXPERIENCE(7) — Expérience professionnelle', className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const exp of experiences) {
      lines.push({
        id: uid(),
        text: `  ── ${exp.title} ──`,
        className: 'bright',
      });
      lines.push({ id: uid(), text: `  ${exp.company} | ${exp.period}` });
      lines.push({ id: uid(), text: '' });
      for (const desc of exp.description) {
        lines.push({ id: uid(), text: `  ${desc}` });
      }
      lines.push({ id: uid(), text: '' });
    }

    return lines;
  },

  education: () => {
    const lines: OutputLine[] = [
      { id: uid(), text: '' },
      { id: uid(), text: '  EDUCATION(7) — Formation', className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const edu of education) {
      lines.push({
        id: uid(),
        text: `  ── ${edu.degree} ──`,
        className: 'bright',
      });
      lines.push({ id: uid(), text: `  ${edu.institution} | ${edu.period}` });
      lines.push({ id: uid(), text: '' });
      for (const desc of edu.description) {
        lines.push({ id: uid(), text: `  ${desc}` });
      }
      lines.push({ id: uid(), text: '' });
    }

    return lines;
  },

  projects: () => {
    const lines: OutputLine[] = [
      { id: uid(), text: '' },
      { id: uid(), text: '  PROJECTS(7) — Projets', className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const proj of projects) {
      lines.push({
        id: uid(),
        text: `  ── ${proj.name} ──`,
        className: 'bright',
      });
      lines.push({ id: uid(), text: '' });
      for (const desc of proj.description) {
        lines.push({ id: uid(), text: `  ${desc}` });
      }
      lines.push({ id: uid(), text: '' });
      lines.push({ id: uid(), text: `  Contexte : ${proj.context}` });
      if (proj.hasLaunch) {
        lines.push({
          id: uid(),
          text: `  Lancer   : ssh ${proj.id}@antoinecunin.fr`,
          className: 'highlight',
        });
      }
      lines.push({ id: uid(), text: '' });
    }

    return lines;
  },
};

const man: CommandDefinition = {
  name: 'man',
  aliases: [],
  description: 'Display manual pages',
  usage: 'man <page>',
  category: 'info',
  completeArgs: (partial) =>
    Object.keys(PAGES).filter((p) => p.startsWith(partial)),
  execute: (ctx) => {
    const page = ctx.args[0]?.toLowerCase();

    if (!page) {
      const available = Object.keys(PAGES).join(', ');
      return {
        lines: [
          { id: uid(), text: '' },
          { id: uid(), text: `  ${t('man.usage')}`, className: 'dim' },
          { id: uid(), text: '' },
          { id: uid(), text: `  ${t('man.available_pages')} : ${available}` },
          { id: uid(), text: '' },
        ],
      };
    }

    const builder = PAGES[page];
    if (!builder) {
      return {
        lines: [
          {
            id: uid(),
            text: `  ${t('man.no_page', page)}`,
            className: 'error',
          },
          {
            id: uid(),
            text: `  ${t('man.available_pages')} : ${Object.keys(PAGES).join(', ')}`,
            className: 'dim',
          },
        ],
      };
    }

    return { lines: builder() };
  },
};

registry.register(man);
