import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './BootSequence.module.css';

interface BootLine {
  text: string;
  /** Extra delay (ms) before this line starts typing */
  delay?: number;
}

const BOOT_LINES: BootLine[] = [
  { text: 'BIOS v1.0 — Portfolio System' },
  { text: 'Memory check... 640K OK', delay: 300 },
  { text: '' },
  { text: '[    0.001] Initializing terminal subsystem', delay: 200 },
  { text: '[    0.042] Mounting virtual filesystem... OK' },
  { text: '[    0.089] Loading command registry... 14 commands registered' },
  { text: '[    0.127] Setting locale: fr_FR.UTF-8' },
  { text: '[    0.156] Starting shell session' },
  { text: '' },
  { text: 'Ready.', delay: 300 },
];

const CHAR_DELAY = 8; // ms per character
const LINE_DELAY = 80; // ms between lines (default)
const DONE_DELAY = 500; // ms after last line before completing

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentChar, setCurrentChar] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const skipRef = useRef(false);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  // Skip on click or keypress
  useEffect(() => {
    const skip = () => {
      if (skipRef.current) return;
      skipRef.current = true;
      setDisplayedLines(BOOT_LINES.map((l) => l.text));
      setIsDone(true);
    };
    document.addEventListener('click', skip);
    document.addEventListener('keydown', skip);
    return () => {
      document.removeEventListener('click', skip);
      document.removeEventListener('keydown', skip);
    };
  }, []);

  // After done, wait then complete
  useEffect(() => {
    if (!isDone) return;
    const timer = setTimeout(finish, DONE_DELAY);
    return () => clearTimeout(timer);
  }, [isDone, finish]);

  // TypeWriter engine — all setState calls inside setTimeout callbacks
  useEffect(() => {
    if (skipRef.current || isDone) return;
    if (currentLine >= BOOT_LINES.length) {
      const timer = setTimeout(() => setIsDone(true), 0);
      return () => clearTimeout(timer);
    }

    const line = BOOT_LINES[currentLine];

    // Empty line — add and move to next
    if (line.text === '') {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, '']);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, line.delay ?? LINE_DELAY);
      return () => clearTimeout(timer);
    }

    // First char of a new line — apply line delay
    if (currentChar === 0) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, '']);
        setCurrentChar(1);
      }, line.delay ?? LINE_DELAY);
      return () => clearTimeout(timer);
    }

    // Typing characters
    const timer = setTimeout(() => {
      setDisplayedLines((prev) => {
        const next = [...prev];
        next[next.length - 1] = line.text.slice(0, currentChar);
        return next;
      });
      if (currentChar >= line.text.length) {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      } else {
        setCurrentChar((c) => c + 1);
      }
    }, CHAR_DELAY);
    return () => clearTimeout(timer);
  }, [currentLine, currentChar, isDone]);

  return (
    <div className={styles.boot}>
      {displayedLines.map((line, i) => (
        <div key={i}>{line || '\u00A0'}</div>
      ))}
      {!isDone && <span className={styles.cursor} />}
    </div>
  );
}
