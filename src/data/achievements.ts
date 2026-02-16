import type { LocalizedString } from '../types';

export type AchievementCategory = 'coding' | 'creative';

export interface Achievement {
  title: LocalizedString;
  description: LocalizedString;
  category: AchievementCategory;
}

export const achievements: Achievement[] = [
  {
    title: {
      fr: 'Coding Battle Match\'Up 2024 — 15e/~2K',
      en: 'Coding Battle Match\'Up 2024 — 15th/~2K',
      de: 'Coding Battle Match\'Up 2024 — 15./~2K',
    },
    description: {
      fr: '15e place sur ~2 000 participants au Coding Battle du Match\'Up (anciennement Shaker).',
      en: '15th place out of ~2,000 participants at the Match\'Up Coding Battle (formerly Shaker).',
      de: '15. Platz von ~2.000 Teilnehmern beim Coding Battle des Match\'Up (ehemals Shaker).',
    },
    category: 'coding',
  },
  {
    title: {
      fr: 'Coding Game T&S 2024 — 2e',
      en: 'Coding Game T&S 2024 — 2nd',
      de: 'Coding Game T&S 2024 — 2.',
    },
    description: {
      fr: '2e place au Coding Game 2024 organisé par Technology & Strategy.',
      en: '2nd place at the Coding Game 2024 organized by Technology & Strategy.',
      de: '2. Platz beim Coding Game 2024, organisiert von Technology & Strategy.',
    },
    category: 'coding',
  },
  {
    title: {
      fr: 'RegexCrossword — 76e/+90K',
      en: 'RegexCrossword — 76th/+90K',
      de: 'RegexCrossword — 76./+90K',
    },
    description: {
      fr: '76e place mondiale sur plus de 90 000 joueurs (moteur JavaScript).',
      en: '76th place worldwide out of over 90,000 players (JavaScript engine).',
      de: '76. Platz weltweit unter über 90.000 Spielern (JavaScript-Engine).',
    },
    category: 'coding',
  },
  {
    title: {
      fr: 'Concours d\'écriture — 1er prix poésie',
      en: 'Writing Contest — 1st prize poetry',
      de: 'Schreibwettbewerb — 1. Preis Poesie',
    },
    description: {
      fr: '1er prix dans la catégorie poème lors d\'un concours d\'écriture.',
      en: '1st prize in the poem category at a writing contest.',
      de: '1. Preis in der Kategorie Gedicht bei einem Schreibwettbewerb.',
    },
    category: 'creative',
  },
];
