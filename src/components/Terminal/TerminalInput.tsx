import { useState, useRef, useEffect, useCallback } from 'react';
import { useTerminalStore } from '../../store/terminalStore';
import { registry } from '../../commands/registry';
import { fs } from '../../filesystem/content';
import { Prompt } from './Prompt';
import styles from './TerminalInput.module.css';

const TAB_DOUBLE_DELAY = 400; // ms to detect double-tab

interface TerminalInputProps {
  onExecute: (command: string) => void;
  onShowCompletions: (matches: string[]) => void;
}

export function TerminalInput({ onExecute, onShowCompletions }: TerminalInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTabRef = useRef(0);
  const commandHistory = useTerminalStore((s) => s.commandHistory);
  const historyIndex = useTerminalStore((s) => s.historyIndex);
  const setHistoryIndex = useTerminalStore((s) => s.setHistoryIndex);
  const cwd = useTerminalStore((s) => s.cwd);

  // Auto-focus on mount and when clicking anywhere (unless selecting text)
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
    const handleMouseUp = () => {
      // Delay to let the browser finalize the selection
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        inputRef.current?.focus({ preventScroll: true });
      }, 0);
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
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

          const now = Date.now();
          const isDoubleTab = now - lastTabRef.current < TAB_DOUBLE_DELAY;
          lastTabRef.current = now;

          // Determine if we're completing a command or a path
          const spaceIndex = value.indexOf(' ');
          const isCompletingCommand = spaceIndex === -1;

          let matches: string[];

          if (isCompletingCommand) {
            // Complete command names
            matches = registry.autocomplete(value.toLowerCase());
          } else {
            // Complete arguments — check if command has custom completer
            const cmdName = value.slice(0, spaceIndex).toLowerCase();
            const cmdDef = registry.resolve(cmdName);
            const partial = value.slice(spaceIndex + 1);

            if (cmdDef?.completeArgs) {
              const argMatches = cmdDef.completeArgs(partial);
              matches = argMatches.map((m) => value.slice(0, spaceIndex + 1) + m);
            } else {
              // Default: filesystem path completion
              const pathMatches = fs.completePath(partial, cwd);
              matches = pathMatches.map((m) => value.slice(0, spaceIndex + 1) + m);
            }
          }

          if (matches.length === 0) break;

          if (matches.length === 1) {
            // Single match — complete immediately
            const completed = matches[0];
            // Add space after if it's a command or a file (not a directory ending with /)
            const suffix = completed.endsWith('/') ? '' : ' ';
            setValue(completed + suffix);
          } else {
            // Multiple matches — find common prefix and complete to it
            const completionParts = isCompletingCommand
              ? matches
              : matches.map((m) => m.slice(spaceIndex + 1));
            const inputPart = isCompletingCommand
              ? value
              : value.slice(spaceIndex + 1);

            let prefix = completionParts[0];
            for (const match of completionParts) {
              while (!match.startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
              }
            }

            if (prefix.length > inputPart.length) {
              // Can extend — do it on first Tab
              const newValue = isCompletingCommand
                ? prefix
                : value.slice(0, spaceIndex + 1) + prefix;
              setValue(newValue);
            } else if (isDoubleTab) {
              // Double Tab — show all possibilities
              const displayNames = isCompletingCommand
                ? matches
                : matches.map((m) => m.slice(spaceIndex + 1));
              onShowCompletions(displayNames);
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
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
              // Let browser handle native copy
              break;
            }
            e.preventDefault();
            setValue('');
          }
          break;
        }
      }
    },
    [value, commandHistory, historyIndex, setHistoryIndex, onExecute, onShowCompletions, cwd]
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
