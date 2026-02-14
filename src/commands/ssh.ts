import { registry, uid } from './registry';
import { projects } from '../data/projects';
import { enterSSH, isInSSH } from '../filesystem/content';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const HOST = 'antoinecunin.fr';

function getSSHableProjects() {
  return projects.filter((p) => p.hasSSH);
}

const ssh: CommandDefinition = {
  name: 'ssh',
  aliases: [],
  description: 'Connect to a project via SSH',
  usage: 'ssh <project>@antoinecunin.fr',
  category: 'action',
  completeArgs: (partial) => {
    const available = getSSHableProjects();
    const candidates = available.map((p) => `${p.id}@${HOST}`);
    return candidates.filter((c) => c.startsWith(partial));
  },
  execute: (ctx) => {
    if (!ctx.args[0]) {
      const available = getSSHableProjects();
      return {
        lines: [
          { id: uid(), text: `  ${t('ssh.usage')}`, className: 'dim' },
          { id: uid(), text: '' },
          ...available.map((p) => ({
            id: uid(),
            text: `  ssh ${p.id}@${HOST}`,
            className: 'highlight',
          })),
        ],
      };
    }

    if (isInSSH()) {
      return {
        lines: [{ id: uid(), text: `  ${t('ssh.already_connected')}`, className: 'error' }],
      };
    }

    // Parse: "projet@host" or just "projet"
    let projectId = ctx.args[0];
    if (projectId.includes('@')) {
      const [id, host] = projectId.split('@');
      if (host !== HOST) {
        return {
          lines: [{ id: uid(), text: `  ssh: ${t('ssh.invalid_host', host)}`, className: 'error' }],
        };
      }
      projectId = id;
    }

    const proj = projects.find((p) => p.id === projectId);
    if (!proj) {
      return {
        lines: [{ id: uid(), text: `  ssh: ${t('ssh.unknown_project', projectId)}`, className: 'error' }],
      };
    }

    if (!proj.hasSSH) {
      return {
        lines: [{ id: uid(), text: `  ssh: ${t('ssh.no_ssh', proj.name)}`, className: 'error' }],
      };
    }

    // Connect
    enterSSH(projectId);
    useTerminalStore.getState().setSshSession(projectId);
    useTerminalStore.getState().setCwd('/home/antoine');

    return {
      lines: [
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('ssh.connecting', `${projectId}@${HOST}`)}`, className: 'dim' },
        { id: uid(), text: `  ${t('ssh.connected')}`, className: 'highlight' },
        { id: uid(), text: '' },
        { id: uid(), text: `  ${proj.name}`, className: 'bright' },
        { id: uid(), text: `  ${t('ssh.hint')}` },
        { id: uid(), text: '' },
      ],
    };
  },
};

registry.register(ssh);
