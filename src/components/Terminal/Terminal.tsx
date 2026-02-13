import { useCallback } from 'react';
import { useTerminalStore } from '../../store/terminalStore';
import { registry } from '../../commands';
import { uid } from '../../commands/registry';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';
import styles from './Terminal.module.css';

export function Terminal() {
  const addOutputBlock = useTerminalStore((s) => s.addOutputBlock);
  const addToHistory = useTerminalStore((s) => s.addToHistory);
  const clearOutput = useTerminalStore((s) => s.clearOutput);

  const handleExecute = useCallback(
    (input: string) => {
      // Snapshot cwd/ssh BEFORE executing (cd will change cwd)
      const { cwd, sshSession } = useTerminalStore.getState();

      if (!input) {
        addOutputBlock({
          id: uid(),
          lines: [],
          command: '',
          cwd,
          sshSession,
        });
        return;
      }

      addToHistory(input);

      // Handle clear specially
      if (input.trim().toLowerCase() === 'clear') {
        clearOutput();
        return;
      }

      const result = registry.execute(input);

      addOutputBlock({
        id: uid(),
        lines: result.lines,
        command: input,
        cwd,
        sshSession,
      });
    },
    [addOutputBlock, addToHistory, clearOutput]
  );

  const handleShowCompletions = useCallback(
    (matches: string[]) => {
      addOutputBlock({
        id: uid(),
        lines: matches.map((m) => ({
          id: uid(),
          text: `  ${m}`,
          className: m.endsWith('/') ? 'highlight' : undefined,
        })),
      });
    },
    [addOutputBlock]
  );

  return (
    <div className={styles.terminal}>
      <TerminalOutput />
      <TerminalInput onExecute={handleExecute} onShowCompletions={handleShowCompletions} />
    </div>
  );
}
