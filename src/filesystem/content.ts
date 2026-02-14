import type { FSDirectory, FSFile } from './virtualFS';
import { VirtualFS } from './virtualFS';
import { about } from '../data/about';
import { experiences } from '../data/experience';
import { education } from '../data/education';
import { projects } from '../data/projects';
import { contact } from '../data/contact';
import { achievements } from '../data/achievements';
import { lWith } from '../i18n/l';
import translations from '../i18n/translations';
import { useTerminalStore } from '../store/terminalStore';
import type { Locale } from '../types';

// Helper to create file nodes
function file(name: string, content: string): FSFile {
  return { type: 'file', name, content };
}

function dir(name: string, children: Record<string, FSFile | FSDirectory>): FSDirectory {
  return { type: 'directory', name, children };
}

function buildRootFS(locale: Locale): FSDirectory {
  const ls = (field: Record<Locale, string>): string => lWith(field, locale);
  const la = (field: Record<Locale, string[]>): string[] => lWith(field, locale);
  const t = (key: string): string => {
    const entry = translations[key];
    return entry?.[locale] ?? entry?.['fr'] ?? key;
  };

  // --- About ---
  const whoamiContent = [
    `${t('label.name')}        : ${about.name}`,
    `${t('label.role')}        : ${ls(about.role)}`,
    `${t('label.location')}    : ${ls(about.location)}`,
    `${t('label.status')}      : ${ls(about.status)}`,
    `${t('label.company')}     : ${about.company}`,
    `${t('label.email')}       : ${about.email}`,
    `${t('label.website')}     : ${about.website}`,
    '',
    ...la(about.summary),
  ].join('\n');

  // --- Experience ---
  function buildExperienceFile(exp: typeof experiences[0]): string {
    return [
      `=== ${ls(exp.title)} ===`,
      '',
      `${t('label.company')}  : ${exp.company}`,
      `${t('label.period')}   : ${ls(exp.period)}`,
      '',
      ...la(exp.description),
    ].join('\n');
  }

  // --- Education ---
  function buildEducationFile(edu: typeof education[0]): string {
    return [
      `=== ${ls(edu.degree)} ===`,
      '',
      `${t('label.institution')} : ${edu.institution}`,
      `${t('label.period')}      : ${ls(edu.period)}`,
      '',
      ...la(edu.description),
    ].join('\n');
  }

  // --- Projects ---
  function buildProjectReadme(proj: typeof projects[0]): string {
    const lines = [
      `# ${proj.name}`,
      '',
      ...la(proj.description),
      '',
      `${t('label.context')} : ${ls(proj.context)}`,
    ];
    if (proj.github) lines.push(`GitHub   : ${proj.github}`);
    if (proj.demo) lines.push(`Demo     : ${proj.demo}`);
    if (proj.hasLaunch) {
      lines.push('');
      lines.push(t('project.executable'));
    }
    return lines.join('\n');
  }

  // --- Contact ---
  const contactContent = [
    `=== ${t('section.contact')} ===`,
    '',
    `Email    : ${contact.email}`,
    `LinkedIn : ${contact.linkedin}`,
    `GitHub   : ${contact.github}`,
    `Calendly : ${contact.calendly}`,
    `Website  : ${contact.website}`,
  ].join('\n');

  // --- Achievements ---
  const achievementsContent = [
    `=== ${t('section.achievements')} ===`,
    '',
    ...achievements.map((a) => `${ls(a.title)}\n  ${ls(a.description)}`),
  ].join('\n');

  // --- README ---
  const readmeContent = [
    '# antoinecunin.fr',
    '',
    `${about.name} — ${ls(about.role)}`,
    '',
    t('welcome.hint'),
    '',
    'Navigation :',
    `  ls, cd, cat    ${t('readme.nav_desc')}`,
    `  man <sujet>    ${t('readme.man_desc')}`,
    `  whoami         ${t('readme.whoami_desc')}`,
    `  finger <nom>   ${t('readme.finger_desc')}`,
    `  env            ${t('readme.env_desc')}`,
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
      projFiles['launch'] = file('launch', `[${proj.name}]`);
    }
    projectsChildren[proj.id] = dir(proj.id, projFiles);
  }

  const homeDirectory: FSDirectory = dir('antoine', {
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

  return dir('/', {
    home: dir('home', {
      antoine: homeDirectory,
    }),
  });
}

// Singleton reactive VirtualFS
export const fs = new VirtualFS(buildRootFS(useTerminalStore.getState().locale));

// Rebuild on locale change
let currentLocale = useTerminalStore.getState().locale;
useTerminalStore.subscribe((state) => {
  if (state.locale !== currentLocale) {
    currentLocale = state.locale;
    fs.setRoot(buildRootFS(currentLocale));
  }
});
