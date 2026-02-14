import type { LocalizedString } from '../types';

export interface Achievement {
  title: LocalizedString;
  description: LocalizedString;
}

export const achievements: Achievement[] = [
  {
    title: {
      fr: 'RegexCrossword — Top 72',
      en: 'RegexCrossword — Top 72',
      de: 'RegexCrossword — Top 72',
    },
    description: {
      fr: 'Classé dans le top 72 mondial sur RegexCrossword (PCRE2).',
      en: 'Ranked in the top 72 worldwide on RegexCrossword (PCRE2).',
      de: 'Platzierung in den Top 72 weltweit bei RegexCrossword (PCRE2).',
    },
  },
];
