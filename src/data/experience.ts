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
        "Déploiement et administration d'une grille de données distribuée",
        "multi-sites via iRODS pour l'infrastructure de recherche nationale",
        "Data Terra, reliant 8 centres de données en France.",
        "Stockage objet S3, haute disponibilité (HAProxy), authentification",
        "SSO et automatisation du déploiement via Ansible.",
      ],
      en: [
        'Deployment and administration of a multi-site distributed',
        'data grid via iRODS for the national research infrastructure',
        'Data Terra, connecting 8 data centers across France.',
        'S3 object storage, high availability (HAProxy), SSO',
        'authentication and deployment automation via Ansible.',
      ],
      de: [
        'Bereitstellung und Administration eines verteilten',
        'Multi-Site-Datengitters über iRODS für die nationale',
        'Forschungsinfrastruktur Data Terra mit 8 Rechenzentren in Frankreich.',
        'S3-Objektspeicher, Hochverfügbarkeit (HAProxy), SSO-Authentifizierung',
        'und Deployment-Automatisierung über Ansible.',
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
        "Développement d'outils terminal pour un environnement HPC :",
        "visualiseur interactif de DAG (Ncurses, méthode de Sugiyama)",
        "et moniteur temps réel de cluster (Textual).",
      ],
      en: [
        'Development of terminal tools for an HPC environment:',
        'interactive DAG visualizer (Ncurses, Sugiyama method)',
        'and real-time cluster monitor (Textual).',
      ],
      de: [
        'Entwicklung von Terminal-Tools für eine HPC-Umgebung:',
        'interaktiver DAG-Visualisierer (Ncurses, Sugiyama-Methode)',
        'und Echtzeit-Cluster-Monitor (Textual).',
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
        "Implémentation Java du standard IVOA VOSpace, un protocole",
        "d'accès à un espace de stockage distribué pour l'astronomie,",
        "architecturé en microservices.",
      ],
      en: [
        'Java implementation of the IVOA VOSpace standard, a storage',
        'access protocol for distributed astronomy storage,',
        'built with a microservices architecture.',
      ],
      de: [
        'Java-Implementierung des IVOA-VOSpace-Standards, eines',
        'Speicherzugriffsprotokolls für verteilte Astronomie-Speicher,',
        'aufgebaut mit einer Microservices-Architektur.',
      ],
    },
  },
];
