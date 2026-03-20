import type { LocalizedString } from '../types';
import shaWarmaPythonJail from './writeups/sha-warma-python-jail.md?raw';

export type AchievementCategory = 'ctf' | 'competitive-programming' | 'puzzle' | 'creative';

export interface Achievement {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  category: AchievementCategory;
  year: string;
  writeups?: { id: string; content: string }[];
}

export const achievements: Achievement[] = [
  {
    id: 'sha-warma',
    title: {
      fr: 'CTF Sha-warma 2026 — 3e',
      en: 'CTF Sha-warma 2026 — 3rd',
      de: 'CTF Sha-warma 2026 — 3.',
    },
    description: {
      fr: '3e place au CTF Sha-warma 2026.',
      en: '3rd place at the Sha-warma 2026 CTF.',
      de: '3. Platz beim CTF Sha-warma 2026.',
    },
    category: 'ctf',
    year: '2026',
    writeups: [
      { id: 'python-jail', content: shaWarmaPythonJail },
    ],
  },
  {
    id: 'matchup',
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
    category: 'competitive-programming',
    year: '2024',
  },
  {
    id: 'coding-game-ts',
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
    category: 'competitive-programming',
    year: '2024',
  },
  {
    id: 'clash-of-agents',
    title: {
      fr: 'Clash of Agents — AWS Innovation Day 2026 — 8e',
      en: 'Clash of Agents — AWS Innovation Day 2026 — 8th',
      de: 'Clash of Agents — AWS Innovation Day 2026 — 8.',
    },
    description: {
      fr: '8e place au Clash of Agents lors de l\'AWS Innovation Day Strasbourg 2026.',
      en: '8th place at the Clash of Agents during AWS Innovation Day Strasbourg 2026.',
      de: '8. Platz beim Clash of Agents beim AWS Innovation Day Strasbourg 2026.',
    },
    category: 'competitive-programming',
    year: '2026',
  },
  {
    id: 'regexcrossword',
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
    category: 'puzzle',
    year: 'all-time',
  },
  {
    id: 'concours-ecriture',
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
    year: '2025',
  },
];
