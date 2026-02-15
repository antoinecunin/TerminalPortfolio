import type { LocalizedString } from '../types';

export interface Achievement {
  title: LocalizedString;
  description: LocalizedString;
}

export const achievements: Achievement[] = [
  {
    title: {
      fr: 'RegexCrossword — Top 76',
      en: 'RegexCrossword — Top 76',
      de: 'RegexCrossword — Top 76',
    },
    description: {
      fr: 'Classé dans le top 76 mondial sur plus de 90 000 joueurs (moteur JavaScript).',
      en: 'Ranked in the top 76 worldwide out of over 90,000 players (JavaScript engine).',
      de: 'Platzierung in den Top 76 weltweit unter über 90.000 Spielern (JavaScript-Engine).',
    },
  },
];
