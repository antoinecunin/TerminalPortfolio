export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string[];
}

export const education: Education[] = [
  {
    id: 'epitech',
    degree: 'Master of Science Tech',
    institution: 'Epitech, Strasbourg',
    period: '2025 — 2027 (1ère année)',
    description: [
      'Formation spécialisée en cybersécurité et cloud.',
      'En alternance chez Gaia Data.',
    ],
  },
  {
    id: 'but-info',
    degree: 'BUT Informatique',
    institution: 'IUT Robert Schuman, Illkirch',
    period: '2022 — 2025',
    description: [
      'Connaissances théoriques approfondies en informatique',
      'avec spécialisation en développement web.',
      'Nombreux projets de groupe réalisés.',
    ],
  },
];
