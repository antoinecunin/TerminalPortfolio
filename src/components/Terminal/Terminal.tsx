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
      if (!input) {
        // Empty enter: show prompt line with no output
        addOutputBlock({
          id: uid(),
          lines: [],
          command: '',
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
      });
    },
    [addOutputBlock, addToHistory, clearOutput]
  );

  return (
    <div className={styles.terminal}>
      <TerminalOutput />
      <TerminalInput onExecute={handleExecute} />
    </div>
  );
}
