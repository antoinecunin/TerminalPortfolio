import type { FSDirectory } from './virtualFS';
import { dir } from './fsHelpers';
import { buildPortfolioHome } from './sshPortfolioContent';
import { buildDagVisualizerHome } from './sshDagContent';
import { buildPastPapersHome } from './sshPastPapersContent';

const SSH_FILESYSTEMS: Record<string, () => FSDirectory> = {
  'portfolio': buildPortfolioHome,
  'dag-visualizer': buildDagVisualizerHome,
  'past-papers-app': buildPastPapersHome,
};

export function buildSSHRoot(projectId: string): FSDirectory | null {
  const builder = SSH_FILESYSTEMS[projectId];
  if (!builder) return null;

  const homeDir = builder();
  return dir('/', {
    home: dir('home', {
      antoine: homeDir,
    }),
  });
}

export function getSSHProjects(): string[] {
  return Object.keys(SSH_FILESYSTEMS);
}
