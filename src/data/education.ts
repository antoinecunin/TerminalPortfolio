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
        'Master spécialisé en cybersécurité et cloud computing.',
        "Pédagogie par projets, axée sur l'autonomie.",
        'En alternance.',
      ],
      en: [
        'Master specialized in cybersecurity and cloud computing.',
        'Project-based pedagogy, focused on autonomy.',
        'Work-study program.',
      ],
      de: [
        'Master spezialisiert auf Cybersicherheit und Cloud Computing.',
        'Projektbasierte Lehre mit Fokus auf Eigenständigkeit.',
        'Duales Studium.',
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
        'Fondamentaux en informatique et apprentissages bas-niveau',
        "notamment sur l'architecture des ordinateurs",
        'ainsi que les réseaux de neurones.',
        'Compétences transverses : droit informatique,',
        'anglais technique, communication.',
        "Parcours réalisation d'applications.",
      ],
      en: [
        'Computer science fundamentals and low-level learning',
        'particularly on computer architecture',
        'and neural networks.',
        'Transversal skills: IT law,',
        'technical English, communication.',
        'Application development track.',
      ],
      de: [
        'Informatik-Grundlagen und Low-Level-Kenntnisse',
        'insbesondere in Rechnerarchitektur',
        'sowie neuronalen Netzen.',
        'Querschnittskompetenzen: IT-Recht,',
        'technisches Englisch, Kommunikation.',
        'Studiengang Anwendungsentwicklung.',
      ],
    },
  },
];
