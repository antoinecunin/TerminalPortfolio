import type { LocalizedString, LocalizedArray } from '../types';

export interface Project {
  id: string;
  name: string;
  description: LocalizedArray;
  context: LocalizedString;
  github?: string;
  demo?: string;
  hasSSH: boolean;
}

export const projects: Project[] = [
  {
    id: 'dag-visualizer',
    name: 'DAG Visualizer',
    description: {
      fr: [
        'Visualiseur terminal unique construit avec Python et Ncurses',
        'permettant la représentation interactive de graphes acycliques',
        'dirigés basée sur la méthode de Sugiyama.',
      ],
      en: [
        'Unique terminal visualizer built with Python and Ncurses',
        'enabling interactive display of directed acyclic graphs',
        'based on the Sugiyama method.',
      ],
      de: [
        'Einzigartiger Terminal-Visualisierer mit Python und Ncurses',
        'für die interaktive Darstellung gerichteter azyklischer Graphen',
        'basierend auf der Sugiyama-Methode.',
      ],
    },
    context: {
      fr: 'Alternance chez A2S (Janvier — Juin 2025)',
      en: 'Work-study at A2S (January — June 2025)',
      de: 'Duales Studium bei A2S (Januar — Juni 2025)',
    },
    hasSSH: true,
  },
  {
    id: 'hpc-monitor',
    name: 'HPC Monitor',
    description: {
      fr: [
        'Moniteur terminal conçu avec Python et Textual permettant',
        "la visualisation de données sur les nœuds d'un cluster HPC",
        'ainsi que diverses interactions.',
      ],
      en: [
        'Terminal monitor built with Python and Textual for',
        'visualizing data on HPC cluster nodes',
        'with various interactions.',
      ],
      de: [
        'Terminal-Monitor mit Python und Textual zur',
        'Visualisierung von Daten auf HPC-Cluster-Knoten',
        'mit verschiedenen Interaktionen.',
      ],
    },
    context: {
      fr: 'Alternance chez A2S (Janvier — Juin 2025)',
      en: 'Work-study at A2S (January — June 2025)',
      de: 'Duales Studium bei A2S (Januar — Juni 2025)',
    },
    hasSSH: true,
  },
  {
    id: 'gyokeres',
    name: 'Gyokeres',
    description: {
      fr: [
        'Application web et mobile permettant la création et la',
        'participation à des quiz multijoueurs.',
        'Spécialisé sur le déploiement, CI/CD, backend et documentation.',
      ],
      en: [
        'Web and mobile application for creating and',
        'participating in multiplayer quizzes.',
        'Focused on deployment, CI/CD, backend and documentation.',
      ],
      de: [
        'Web- und Mobile-Anwendung zur Erstellung und',
        'Teilnahme an Multiplayer-Quizzen.',
        'Schwerpunkt auf Deployment, CI/CD, Backend und Dokumentation.',
      ],
    },
    context: {
      fr: 'BUT Informatique (2022-2025)',
      en: 'BUT Computer Science (2022-2025)',
      de: 'BUT Informatik (2022-2025)',
    },
    hasSSH: false,
  },
  {
    id: 'territoria',
    name: 'Territoria',
    description: {
      fr: [
        'Jeu de gestion sérieux créé avec Godot en C# visant à',
        "comprendre le principe du métabolisme urbain à travers",
        'ses différentes phases.',
      ],
      en: [
        'Serious management game built with Godot in C# aiming to',
        'understand the concept of urban metabolism through',
        'its different phases.',
      ],
      de: [
        'Ernsthaftes Managementspiel mit Godot in C# zur',
        'Veranschaulichung des Konzepts des urbanen Metabolismus',
        'in seinen verschiedenen Phasen.',
      ],
    },
    context: {
      fr: 'BUT Informatique (2022-2025)',
      en: 'BUT Computer Science (2022-2025)',
      de: 'BUT Informatik (2022-2025)',
    },
    hasSSH: false,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Terminal',
    description: {
      fr: [
        'Ce site — un terminal interactif avec effets CRT rétro,',
        'construit avec React, TypeScript et Vite.',
        'Navigation par commandes Linux, i18n FR/EN/DE, thèmes.',
      ],
      en: [
        'This website — an interactive terminal with retro CRT effects,',
        'built with React, TypeScript and Vite.',
        'Linux command navigation, i18n FR/EN/DE, themes.',
      ],
      de: [
        'Diese Website — ein interaktives Terminal mit Retro-CRT-Effekten,',
        'erstellt mit React, TypeScript und Vite.',
        'Linux-Befehlsnavigation, i18n FR/EN/DE, Themes.',
      ],
    },
    context: {
      fr: 'Projet personnel (2025)',
      en: 'Personal project (2025)',
      de: 'Persönliches Projekt (2025)',
    },
    hasSSH: true,
  },
];
