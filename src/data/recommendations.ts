import type { LocalizedString, LocalizedArray } from '../types';

export interface Recommendation {
  id: string;
  name: string;
  title: LocalizedString;
  relation: LocalizedString;
  company: string;
  text: LocalizedArray;
  photo?: string;
}

export const recommendations: Recommendation[] = [
  {
    id: 'david_michea',
    name: 'David Michea',
    title: {
      fr: 'Ingénieur de recherche',
      en: 'Research Engineer',
      de: 'Forschungsingenieur',
    },
    relation: {
      fr: 'Encadrant',
      en: 'Supervisor',
      de: 'Betreuer',
    },
    company: 'Application for Satellite Survey',
    photo: '/img/recommendations/david_michea.png',
    text: {
      fr: [
        "J'ai encadré Antoine où il s'est distingué par sa curiosité,",
        "sa rigueur et une grande autonomie, notamment en concevant",
        "une application TUI innovante pour l'affichage interactif de",
        "DAGs. Capable d'apprendre vite, de mobiliser la littérature",
        "scientifique et de collaborer efficacement, il sera un atout",
        "pour tout projet de haut niveau.",
      ],
      en: [
        'I supervised Antoine where he stood out for his curiosity,',
        'rigor and great autonomy, notably by designing',
        'an innovative TUI application for interactive DAG',
        'display. Capable of learning quickly, leveraging scientific',
        'literature and collaborating effectively, he will be an asset',
        'to any high-level project.',
      ],
      de: [
        'Ich habe Antoine betreut, wo er sich durch seine Neugier,',
        'Sorgfalt und große Selbstständigkeit auszeichnete, insbesondere',
        'durch die Entwicklung einer innovativen TUI-Anwendung zur',
        'interaktiven DAG-Darstellung. Fähig, schnell zu lernen,',
        'wissenschaftliche Literatur zu nutzen und effektiv zusammenzuarbeiten,',
        'wird er eine Bereicherung für jedes anspruchsvolle Projekt sein.',
      ],
    },
  },
  {
    id: 'ryan_gourdon',
    name: 'Ryan Gourdon',
    title: {
      fr: 'Étudiant',
      en: 'Student',
      de: 'Student',
    },
    relation: {
      fr: 'Collaborateur',
      en: 'Collaborator',
      de: 'Mitarbeiter',
    },
    company: '',
    photo: '/img/recommendations/ryan_gourdon.png',
    text: {
      fr: [
        "J'ai eu l'occasion de collaborer avec Antoine Cunin, et je",
        "peux dire qu'il est un excellent développeur. Antoine se",
        "démarque par sa maîtrise technique, sa capacité à résoudre",
        "des problèmes rapidement et son esprit d'équipe.",
      ],
      en: [
        'I had the opportunity to collaborate with Antoine Cunin, and I',
        'can say he is an excellent developer. Antoine stands out',
        'for his technical expertise, his ability to solve',
        'problems quickly and his team spirit.',
      ],
      de: [
        'Ich hatte die Gelegenheit, mit Antoine Cunin zusammenzuarbeiten,',
        'und kann sagen, dass er ein ausgezeichneter Entwickler ist.',
        'Antoine zeichnet sich durch seine technische Kompetenz,',
        'seine Fähigkeit, Probleme schnell zu lösen, und seinen Teamgeist aus.',
      ],
    },
  },
];
