import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './BootSequence.module.css';
import { registry } from '../commands/registry';
import { useTerminalStore } from '../store/terminalStore';

interface BootLine {
  text: string;
  /** Extra delay (ms) before this line starts typing */
  delay?: number;
}

const LOCALE_MAP: Record<string, string> = {
  fr: 'fr_FR.UTF-8',
  en: 'en_US.UTF-8',
  de: 'de_DE.UTF-8',
};

function buildBootLines(commandCount: number, locale: string): BootLine[] {
  const localeCode = LOCALE_MAP[locale] ?? `${locale}.UTF-8`;
  return [
    { text: 'BIOS v1.0 — Portfolio System' },
    { text: 'Memory check... 640K OK', delay: 300 },
    { text: '' },
    { text: '[    0.001] Initializing terminal subsystem', delay: 200 },
    { text: '[    0.042] Mounting virtual filesystem... OK' },
    { text: `[    0.089] Loading command registry... ${commandCount} commands registered` },
    { text: `[    0.127] Setting locale: ${localeCode}` },
    { text: '[    0.156] Starting shell session' },
    { text: '' },
    { text: 'Ready.', delay: 300 },
  ];
}

const CHAR_DELAY = 8; // ms per character
const LINE_DELAY = 80; // ms between lines (default)
const DONE_DELAY = 500; // ms after last line before completing

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const locale = useTerminalStore((s) => s.locale);
  const bootLines = useMemo(
    () => buildBootLines(registry.getAll().length, locale),
    [locale]
  );

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
      setDisplayedLines(bootLines.map((l) => l.text));
      setIsDone(true);
    };
    document.addEventListener('click', skip);
    document.addEventListener('keydown', skip);
    return () => {
      document.removeEventListener('click', skip);
      document.removeEventListener('keydown', skip);
    };
  }, [bootLines]);

  // After done, wait then complete
  useEffect(() => {
    if (!isDone) return;
    const timer = setTimeout(finish, DONE_DELAY);
    return () => clearTimeout(timer);
  }, [isDone, finish]);

  // TypeWriter engine — all setState calls inside setTimeout callbacks
  useEffect(() => {
    if (skipRef.current || isDone) return;
    if (currentLine >= bootLines.length) {
      const timer = setTimeout(() => setIsDone(true), 0);
      return () => clearTimeout(timer);
    }

    const line = bootLines[currentLine];

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
  }, [currentLine, currentChar, isDone, bootLines]);

  return (
    <div className={styles.boot}>
      {displayedLines.map((line, i) => (
        <div key={i}>{line || '\u00A0'}</div>
      ))}
      {!isDone && <span className={styles.cursor} />}
    </div>
  );
}
