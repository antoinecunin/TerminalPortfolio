import type { FSDirectory, FSFile } from './virtualFS';
import { about } from '../data/about';
import { experiences } from '../data/experience';
import { education } from '../data/education';
import { projects } from '../data/projects';
import { contact } from '../data/contact';
import { achievements } from '../data/achievements';

// Helper to create file nodes
function file(name: string, content: string): FSFile {
  return { type: 'file', name, content };
}

function dir(name: string, children: Record<string, FSFile | FSDirectory>): FSDirectory {
  return { type: 'directory', name, children };
}

// --- About ---
const whoamiContent = [
  `Nom        : ${about.name}`,
  `Rôle       : ${about.role}`,
  `Lieu       : ${about.location}`,
  `Statut     : ${about.status}`,
  `Entreprise : ${about.company}`,
  `Email      : ${about.email}`,
  `Site       : ${about.website}`,
  '',
  ...about.summary,
].join('\n');

// --- Experience ---
function buildExperienceFile(exp: typeof experiences[0]): string {
  return [
    `=== ${exp.title} ===`,
    '',
    `Entreprise : ${exp.company}`,
    `Période    : ${exp.period}`,
    '',
    ...exp.description,
  ].join('\n');
}

// --- Education ---
function buildEducationFile(edu: typeof education[0]): string {
  return [
    `=== ${edu.degree} ===`,
    '',
    `Établissement : ${edu.institution}`,
    `Période       : ${edu.period}`,
    '',
    ...edu.description,
  ].join('\n');
}

// --- Projects ---
function buildProjectReadme(proj: typeof projects[0]): string {
  const lines = [
    `# ${proj.name}`,
    '',
    ...proj.description,
    '',
    `Contexte : ${proj.context}`,
  ];
  if (proj.github) lines.push(`GitHub   : ${proj.github}`);
  if (proj.demo) lines.push(`Demo     : ${proj.demo}`);
  if (proj.hasLaunch) {
    lines.push('');
    lines.push('Exécutable disponible : ./launch');
  }
  return lines.join('\n');
}

// --- Contact ---
const contactContent = [
  '=== Contact ===',
  '',
  `Email    : ${contact.email}`,
  `LinkedIn : ${contact.linkedin}`,
  `GitHub   : ${contact.github}`,
  `Calendly : ${contact.calendly}`,
  `Website  : ${contact.website}`,
].join('\n');

// --- Achievements ---
const achievementsContent = [
  '=== Achievements ===',
  '',
  ...achievements.map((a) => `${a.title}\n  ${a.description}`),
].join('\n');

// --- README ---
const readmeContent = [
  '# antoinecunin.fr',
  '',
  `${about.name} — ${about.role}`,
  '',
  "Tapez 'help' pour voir les commandes disponibles.",
  '',
  'Navigation :',
  '  ls, cd, cat    Naviguer dans le filesystem',
  '  man <sujet>    Pages de manuel (experience, education, projects)',
  '  whoami         Informations personnelles',
  '  finger <nom>   Témoignages',
  '  env            Variables d\'environnement',
].join('\n');

// --- Build the filesystem tree ---

const experienceDir: Record<string, FSFile> = {};
for (const exp of experiences) {
  experienceDir[`${exp.id}.txt`] = file(`${exp.id}.txt`, buildExperienceFile(exp));
}

const educationDir: Record<string, FSFile> = {};
for (const edu of education) {
  educationDir[`${edu.id}.txt`] = file(`${edu.id}.txt`, buildEducationFile(edu));
}

const projectsChildren: Record<string, FSDirectory> = {};
for (const proj of projects) {
  const projFiles: Record<string, FSFile> = {
    'README.md': file('README.md', buildProjectReadme(proj)),
  };
  if (proj.hasLaunch) {
    projFiles['launch'] = file('launch', `[exécutable: ${proj.name}]`);
  }
  projectsChildren[proj.id] = dir(proj.id, projFiles);
}

export const homeDirectory: FSDirectory = dir('antoine', {
  'README.md': file('README.md', readmeContent),
  about: dir('about', {
    'whoami.txt': file('whoami.txt', whoamiContent),
  }),
  experience: dir('experience', experienceDir),
  education: dir('education', educationDir),
  projects: dir('projects', projectsChildren),
  achievements: dir('achievements', {
    'README.md': file('README.md', achievementsContent),
  }),
  contact: dir('contact', {
    'contact.txt': file('contact.txt', contactContent),
  }),
});

export const rootFS: FSDirectory = dir('/', {
  home: dir('home', {
    antoine: homeDirectory,
  }),
});
