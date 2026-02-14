import type { LocalizedString, LocalizedArray } from '../types';

export interface Education {
  id: string;
  degree: LocalizedString;
  institution: string;
  period: LocalizedString;
  description: LocalizedArray;
}

export const education: Education[] = [
  {
    id: 'epitech',
    degree: {
      fr: 'Master of Science Tech',
      en: 'Master of Science Tech',
      de: 'Master of Science Tech',
    },
    institution: 'Epitech, Strasbourg',
    period: {
      fr: '2025 — 2027 (1ère année)',
      en: '2025 — 2027 (1st year)',
      de: '2025 — 2027 (1. Jahr)',
    },
    description: {
      fr: [
        'Formation spécialisée en cybersécurité et cloud.',
        'En alternance chez Gaia Data.',
      ],
      en: [
        'Specialized training in cybersecurity and cloud.',
        'Work-study program at Gaia Data.',
      ],
      de: [
        'Spezialisierte Ausbildung in Cybersicherheit und Cloud.',
        'Duales Studium bei Gaia Data.',
      ],
    },
  },
  {
    id: 'but-info',
    degree: {
      fr: 'BUT Informatique',
      en: 'BUT in Computer Science',
      de: 'BUT Informatik',
    },
    institution: 'IUT Robert Schuman, Illkirch',
    period: {
      fr: '2022 — 2025',
      en: '2022 — 2025',
      de: '2022 — 2025',
    },
    description: {
      fr: [
        'Connaissances théoriques approfondies en informatique',
        'avec spécialisation en développement web.',
        'Nombreux projets de groupe réalisés.',
      ],
      en: [
        'In-depth theoretical knowledge in computer science',
        'with a specialization in web development.',
        'Numerous group projects completed.',
      ],
      de: [
        'Vertiefte theoretische Kenntnisse in Informatik',
        'mit Spezialisierung auf Webentwicklung.',
        'Zahlreiche Gruppenprojekte abgeschlossen.',
      ],
    },
  },
];
