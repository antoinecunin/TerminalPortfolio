import type { LocalizedString, LocalizedArray } from '../types';

export interface Experience {
  id: string;
  title: LocalizedString;
  company: string;
  period: LocalizedString;
  description: LocalizedArray;
}

export const experiences: Experience[] = [
  {
    id: 'gaia-data',
    title: {
      fr: 'Architecte SI (Alternance)',
      en: 'IS Architect (Work-Study)',
      de: 'IS-Architekt (Duales Studium)',
    },
    company: 'Gaia Data',
    period: {
      fr: 'Octobre 2025 — Septembre 2027',
      en: 'October 2025 — September 2027',
      de: 'Oktober 2025 — September 2027',
    },
    description: {
      fr: [
        "Contribution au développement, déploiement et maintenance",
        "de solutions logicielles pour l'exploitation de la grille",
        "de données de la plateforme GAIA-Data via iRODS.",
      ],
      en: [
        'Contributing to the development, deployment and maintenance',
        'of software solutions for operating the data grid',
        'of the GAIA-Data platform via iRODS.',
      ],
      de: [
        'Beitrag zur Entwicklung, Bereitstellung und Wartung',
        'von Softwarelösungen für den Betrieb des Datengitters',
        'der GAIA-Data-Plattform über iRODS.',
      ],
    },
  },
  {
    id: 'a2s',
    title: {
      fr: 'Développeur Logiciel (Alternance)',
      en: 'Software Developer (Work-Study)',
      de: 'Softwareentwickler (Duales Studium)',
    },
    company: 'Application for Satellite Survey (A2S)',
    period: {
      fr: 'Janvier — Juin 2025',
      en: 'January — June 2025',
      de: 'Januar — Juni 2025',
    },
    description: {
      fr: [
        "Réalisation de missions liées à l'environnement HPC :",
        "prise en compte de la RAM dans l'ordonnancement,",
        "refonte complète du moniteur et création d'un visualiseur",
        "de DAG pour afficher des workflows complexes.",
      ],
      en: [
        'Carried out tasks related to the HPC environment:',
        'RAM-aware job scheduling,',
        'complete redesign of the monitor and creation of a DAG',
        'visualizer to display complex workflows.',
      ],
      de: [
        'Durchführung von Aufgaben im HPC-Umfeld:',
        'RAM-bewusste Job-Planung,',
        'vollständige Neugestaltung des Monitors und Erstellung',
        'eines DAG-Visualisierers für komplexe Workflows.',
      ],
    },
  },
  {
    id: 'obas',
    title: {
      fr: 'Développeur Fullstack (Stage)',
      en: 'Fullstack Developer (Internship)',
      de: 'Fullstack-Entwickler (Praktikum)',
    },
    company: "Observatoire Astronomique de Strasbourg (OBAS)",
    period: {
      fr: 'Avril — Juin 2024',
      en: 'April — June 2024',
      de: 'April — Juni 2024',
    },
    description: {
      fr: [
        "Implémentation Java d'un protocole d'accès à un espace",
        "de stockage, le standard IVOA VOSpace, architecturé en",
        "microservices.",
      ],
      en: [
        'Java implementation of a storage access protocol,',
        'the IVOA VOSpace standard, built with a',
        'microservices architecture.',
      ],
      de: [
        'Java-Implementierung eines Speicherzugriffsprotokolls,',
        'des IVOA-VOSpace-Standards, aufgebaut mit einer',
        'Microservices-Architektur.',
      ],
    },
  },
];
