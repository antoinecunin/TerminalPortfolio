import type { LocalizedString, LocalizedArray } from '../types';

export const about = {
  name: 'Antoine Cunin',
  role: {
    fr: 'Développeur Fullstack, Logiciel & DevOps',
    en: 'Fullstack, Software & DevOps Developer',
    de: 'Fullstack-, Software- & DevOps-Entwickler',
  } satisfies LocalizedString,
  location: {
    fr: 'Strasbourg, France',
    en: 'Strasbourg, France',
    de: 'Straßburg, Frankreich',
  } satisfies LocalizedString,
  status: {
    fr: 'Apprenti — 1ère année de Master à Epitech',
    en: 'Apprentice — 1st year of MSc at Epitech',
    de: 'Auszubildender — 1. Jahr Master an der Epitech',
  } satisfies LocalizedString,
  company: 'Gaia Data',
  email: 'antoine.cunin.pro@gmail.com',
  website: 'antoinecunin.fr',
  summary: {
    fr: [
      'Développeur passionné par les interfaces terminal (TUI),',
      "l'automatisation et les systèmes distribués.",
      '',
      'Actuellement en alternance chez Gaia Data en tant',
      "qu'architecte SI, contribuant au développement et au",
      'déploiement de solutions logicielles pour la plateforme',
      'de grille de données GAIA-Data via iRODS.',
    ],
    en: [
      'Developer passionate about terminal user interfaces (TUI),',
      'automation and distributed systems.',
      '',
      'Currently in a work-study program at Gaia Data as',
      'an IS architect, contributing to the development and',
      'deployment of software solutions for the GAIA-Data',
      'data grid platform via iRODS.',
    ],
    de: [
      'Entwickler mit Leidenschaft für Terminal-Oberflächen (TUI),',
      'Automatisierung und verteilte Systeme.',
      '',
      'Derzeit in dualer Ausbildung bei Gaia Data als',
      'IS-Architekt, mit Beiträgen zur Entwicklung und',
      'Bereitstellung von Softwarelösungen für die',
      'GAIA-Data-Datengitterplattform über iRODS.',
    ],
  } satisfies LocalizedArray,
};
