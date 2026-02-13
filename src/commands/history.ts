import { registry, uid } from './registry';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const history: CommandDefinition = {
  name: 'history',
  aliases: [],
  description: 'Display command history',
  usage: 'history',
  category: 'system',
  execute: () => {
    const cmds = useTerminalStore.getState().commandHistory;

    if (cmds.length === 0) {
      return {
        lines: [
          { id: uid(), text: `  ${t('history.empty')}`, className: 'dim' },
        ],
      };
    }

    // History is stored most recent first, display oldest first
    const reversed = [...cmds].reverse();
    const lines = reversed.map((cmd, i) => ({
      id: uid(),
      text: `  ${String(i + 1).padStart(4)}  ${cmd}`,
    }));

    return { lines };
  },
};

registry.register(history);
