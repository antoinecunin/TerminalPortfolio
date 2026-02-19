import { registry, uid } from './registry';
import { useTerminalStore } from '../store/terminalStore';
import type { CommandDefinition } from '../types';

const sudo: CommandDefinition = {
  name: 'sudo',
  aliases: [],
  description: 'Execute as superuser',
  usage: 'sudo <command>',
  category: 'system',
  execute: (ctx) => {
    const rawArgs = ctx.rawInput.replace(/^sudo\s+/i, '').trim();
    const isDestructive = /^rm\s+(-[rfRF]+\s+)*\/(\s|$)/.test(rawArgs);

    if (!isDestructive) {
      return {
        lines: [
          { id: uid(), text: '  visitor is not in the sudoers file. This incident will be reported.', className: 'error' },
          { id: uid(), text: '  This incident has been reported.', className: 'warning' },
        ],
      };
    }

    // Trigger glitch overlay
    useTerminalStore.getState().setGlitchActive(true);

    const fakePaths = [
      '/usr/bin/', '/etc/passwd', '/home/antoine/',
      '/var/log/', '/boot/vmlinuz', '/dev/null',
    ];

    const lines = [
      { id: uid(), text: '' },
      { id: uid(), text: '  [sudo] password for root: ********', className: 'dim' },
      { id: uid(), text: '' },
    ];

    for (const path of fakePaths) {
      lines.push({
        id: uid(),
        text: `  rm: removing '${path}'...`,
        className: 'error',
      });
    }

    lines.push({ id: uid(), text: '' });
    lines.push({
      id: uid(),
      text: '  KERNEL PANIC: Unable to sync filesystem',
      className: 'error',
    });

    return { lines };
  },
};

registry.register(sudo);
