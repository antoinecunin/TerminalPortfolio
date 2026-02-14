import { registry, uid } from './registry';
import { exitSSH, isInSSH } from '../filesystem/content';
import { useTerminalStore } from '../store/terminalStore';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const exit_: CommandDefinition = {
  name: 'exit',
  aliases: ['logout', 'disconnect'],
  description: 'Close SSH session',
  usage: 'exit',
  category: 'action',
  execute: () => {
    if (!isInSSH()) {
      return {
        lines: [{ id: uid(), text: `  ${t('exit.not_connected')}`, className: 'dim' }],
      };
    }

    const session = useTerminalStore.getState().sshSession;
    exitSSH();
    useTerminalStore.getState().setSshSession(null);
    useTerminalStore.getState().setCwd('/home/antoine');

    return {
      lines: [
        { id: uid(), text: `  ${t('exit.closed', session ?? '')}`, className: 'dim' },
      ],
    };
  },
};

registry.register(exit_);
