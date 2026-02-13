export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    id: 'gaia-data',
    title: 'Architecte SI (Alternance)',
    company: 'Gaia Data',
    period: 'Octobre 2025 — Septembre 2027',
    description: [
      "Contribution au développement, déploiement et maintenance",
      "de solutions logicielles pour l'exploitation de la grille",
      "de données de la plateforme GAIA-Data via iRODS.",
    ],
  },
  {
    id: 'a2s',
    title: 'Développeur Logiciel (Alternance)',
    company: 'Application for Satellite Survey (A2S)',
    period: 'Janvier — Juin 2025',
    description: [
      "Réalisation de missions liées à l'environnement HPC :",
      "prise en compte de la RAM dans l'ordonnancement,",
      "refonte complète du moniteur et création d'un visualiseur",
      "de DAG pour afficher des workflows complexes.",
    ],
  },
  {
    id: 'obas',
    title: 'Développeur Fullstack (Stage)',
    company: "Observatoire Astronomique de Strasbourg (OBAS)",
    period: 'Avril — Juin 2024',
    description: [
      "Implémentation Java d'un protocole d'accès à un espace",
      "de stockage, le standard IVOA VOSpace, architecturé en",
      "microservices.",
    ],
  },
];
