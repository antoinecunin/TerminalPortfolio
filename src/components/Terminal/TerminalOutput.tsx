import { useEffect, useRef } from 'react';
import { useTerminalStore } from '../../store/terminalStore';
import { TerminalLine } from './TerminalLine';
import { Prompt } from './Prompt';
import styles from './TerminalOutput.module.css';

export function TerminalOutput() {
  const outputBlocks = useTerminalStore((s) => s.outputBlocks);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [outputBlocks]);

  // Scroll to bottom when virtual keyboard appears/disappears
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    };
    vv.addEventListener('resize', scrollToBottom);
    return () => vv.removeEventListener('resize', scrollToBottom);
  }, []);

  return (
    <div className={styles.output} role="log" aria-live="polite" aria-label="Terminal output">
      {outputBlocks.map((block) => (
        <div key={block.id} className={styles.block}>
          {block.command !== undefined && (
            <div className={styles.commandLine}>
              <Prompt cwd={block.cwd} sshSession={block.sshSession} />
              <span>{block.command}</span>
            </div>
          )}
          {block.lines.map((line) => (
            <TerminalLine key={line.id} line={line} />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
