import type { LocalizedString, LocalizedArray } from '../types';

export const about = {
  name: 'Antoine Cunin',
  role: {
    fr: 'Développeur',
    en: 'Developer',
    de: 'Entwickler',
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
      'Curieux avant tout — préfère explorer différents aspects',
      "de l'informatique plutôt que se limiter à un seul domaine.",
      '',
      'Actuellement en alternance chez Gaia Data en tant',
      "qu'architecte SI sur une grille de données distribuée.",
    ],
    en: [
      'Curious above all — prefers exploring different aspects',
      'of computer science rather than limiting himself to a single field.',
      '',
      'Currently in a work-study program at Gaia Data as',
      'an IS architect on a distributed data grid.',
    ],
    de: [
      'Vor allem neugierig — erkundet lieber verschiedene Bereiche',
      'der Informatik, anstatt sich auf ein einziges Gebiet zu beschränken.',
      '',
      'Derzeit in dualer Ausbildung bei Gaia Data als',
      'IS-Architekt an einem verteilten Datengitter.',
    ],
  } satisfies LocalizedArray,
};
