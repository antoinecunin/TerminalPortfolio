export interface Recommendation {
  id: string;
  name: string;
  title: string;
  relation: string;
  company: string;
  text: string[];
  photo?: string;
}

export const recommendations: Recommendation[] = [
  {
    id: 'david_michea',
    name: 'David Michea',
    title: 'Ingénieur de recherche',
    relation: 'Encadrant',
    company: 'Application for Satellite Survey',
    photo: '/img/recommendations/david_michea.png',
    text: [
      "J'ai encadré Antoine où il s'est distingué par sa curiosité,",
      "sa rigueur et une grande autonomie, notamment en concevant",
      "une application TUI innovante pour l'affichage interactif de",
      "DAGs. Capable d'apprendre vite, de mobiliser la littérature",
      "scientifique et de collaborer efficacement, il sera un atout",
      "pour tout projet de haut niveau.",
    ],
  },
  {
    id: 'ryan_gourdon',
    name: 'Ryan Gourdon',
    title: 'Étudiant',
    relation: 'Collaborateur',
    company: '',
    photo: '/img/recommendations/ryan_gourdon.png',
    text: [
      "J'ai eu l'occasion de collaborer avec Antoine Cunin, et je",
      "peux dire qu'il est un excellent développeur. Antoine se",
      "démarque par sa maîtrise technique, sa capacité à résoudre",
      "des problèmes rapidement et son esprit d'équipe.",
    ],
  },
];
