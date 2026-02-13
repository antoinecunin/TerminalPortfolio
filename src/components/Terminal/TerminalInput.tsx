import { useState, useRef, useEffect, useCallback } from 'react';
import { useTerminalStore } from '../../store/terminalStore';
import { registry } from '../../commands';
import { Prompt } from './Prompt';
import styles from './TerminalInput.module.css';

interface TerminalInputProps {
  onExecute: (command: string) => void;
}

export function TerminalInput({ onExecute }: TerminalInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const commandHistory = useTerminalStore((s) => s.commandHistory);
  const historyIndex = useTerminalStore((s) => s.historyIndex);
  const setHistoryIndex = useTerminalStore((s) => s.setHistoryIndex);

  // Auto-focus on mount and when clicking anywhere
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    focus();
    document.addEventListener('click', focus);
    return () => document.removeEventListener('click', focus);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter': {
          e.preventDefault();
          const cmd = value.trim();
          onExecute(cmd);
          setValue('');
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          if (commandHistory.length === 0) break;
          const newIndex = Math.min(
            historyIndex + 1,
            commandHistory.length - 1
          );
          setHistoryIndex(newIndex);
          setValue(commandHistory[newIndex]);
          break;
        }

        case 'ArrowDown': {
          e.preventDefault();
          if (historyIndex <= 0) {
            setHistoryIndex(-1);
            setValue('');
          } else {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setValue(commandHistory[newIndex]);
          }
          break;
        }

        case 'Tab': {
          e.preventDefault();
          if (!value) break;
          const matches = registry.autocomplete(value.toLowerCase());
          if (matches.length === 1) {
            setValue(matches[0] + ' ');
          } else if (matches.length > 1) {
            // Find common prefix
            let prefix = matches[0];
            for (const match of matches) {
              while (!match.startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
              }
            }
            if (prefix.length > value.length) {
              setValue(prefix);
            }
          }
          break;
        }

        case 'l': {
          if (e.ctrlKey) {
            e.preventDefault();
            onExecute('clear');
            setValue('');
          }
          break;
        }

        case 'c': {
          if (e.ctrlKey) {
            e.preventDefault();
            setValue('');
          }
          break;
        }
      }
    },
    [value, commandHistory, historyIndex, setHistoryIndex, onExecute]
  );

  return (
    <div className={styles.inputLine}>
      <Prompt />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setHistoryIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className={styles.input}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Terminal input"
      />
    </div>
  );
}
