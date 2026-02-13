export interface Project {
  id: string;
  name: string;
  description: string[];
  context: string;
  github?: string;
  demo?: string;
  hasLaunch: boolean;
}

export const projects: Project[] = [
  {
    id: 'dag-visualizer',
    name: 'DAG Visualizer',
    description: [
      'Visualiseur terminal unique construit avec Python et Ncurses',
      'permettant la représentation interactive de graphes acycliques',
      'dirigés basée sur la méthode de Sugiyama.',
    ],
    context: 'Alternance chez A2S (Janvier — Juin 2025)',
    hasLaunch: true,
  },
  {
    id: 'hpc-monitor',
    name: 'HPC Monitor',
    description: [
      'Moniteur terminal conçu avec Python et Textual permettant',
      "la visualisation de données sur les nœuds d'un cluster HPC",
      'ainsi que diverses interactions.',
    ],
    context: 'Alternance chez A2S (Janvier — Juin 2025)',
    hasLaunch: true,
  },
  {
    id: 'gyokeres',
    name: 'Gyokeres',
    description: [
      'Application web et mobile permettant la création et la',
      'participation à des quiz multijoueurs.',
      'Spécialisé sur le déploiement, CI/CD, backend et documentation.',
    ],
    context: 'BUT Informatique (2022-2025)',
    hasLaunch: false,
  },
  {
    id: 'territoria',
    name: 'Territoria',
    description: [
      'Jeu de gestion sérieux créé avec Godot en C# visant à',
      "comprendre le principe du métabolisme urbain à travers",
      'ses différentes phases.',
    ],
    context: 'BUT Informatique (2022-2025)',
    hasLaunch: false,
  },
];
