import { registry, uid } from './registry';
import { experiences } from '../data/experience';
import { education } from '../data/education';
import { projects } from '../data/projects';
import { l } from '../i18n/l';
import { t } from '../i18n/t';
import type { CommandDefinition, OutputLine } from '../types';

const PAGES: Record<string, () => OutputLine[]> = {
  experience: () => {
    const lines: OutputLine[] = [
      { id: uid(), text: '' },
      { id: uid(), text: `  ${t('man.header_experience')}`, className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const exp of experiences) {
      lines.push({
        id: uid(),
        text: `  ── ${l(exp.title)} ──`,
        className: 'bright',
      });
      lines.push({ id: uid(), text: `  ${exp.company} | ${l(exp.period)}` });
      lines.push({ id: uid(), text: '' });
      for (const desc of l(exp.description)) {
        lines.push({ id: uid(), text: `  ${desc}` });
      }
      lines.push({ id: uid(), text: '' });
    }

    return lines;
  },

  education: () => {
    const lines: OutputLine[] = [
      { id: uid(), text: '' },
      { id: uid(), text: `  ${t('man.header_education')}`, className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const edu of education) {
      lines.push({
        id: uid(),
        text: `  ── ${l(edu.degree)} ──`,
        className: 'bright',
      });
      lines.push({ id: uid(), text: `  ${edu.institution} | ${l(edu.period)}` });
      lines.push({ id: uid(), text: '' });
      for (const desc of l(edu.description)) {
        lines.push({ id: uid(), text: `  ${desc}` });
      }
      lines.push({ id: uid(), text: '' });
    }

    return lines;
  },

  projects: () => {
    const lines: OutputLine[] = [
      { id: uid(), text: '' },
      { id: uid(), text: `  ${t('man.header_projects')}`, className: 'highlight' },
      { id: uid(), text: '' },
    ];

    for (const proj of projects) {
      lines.push({
        id: uid(),
        text: `  ── ${proj.name} ──`,
        className: 'bright',
      });
      lines.push({ id: uid(), text: '' });
      for (const desc of l(proj.description)) {
        lines.push({ id: uid(), text: `  ${desc}` });
      }
      lines.push({ id: uid(), text: '' });
      lines.push({ id: uid(), text: `  ${t('label.context')} : ${l(proj.context)}` });
      if (proj.hasLaunch) {
        lines.push({
          id: uid(),
          text: `  ${t('label.launch')}   : ssh ${proj.id}@antoinecunin.fr`,
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
