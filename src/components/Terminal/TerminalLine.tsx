import type { OutputLine } from '../../types';
import styles from './TerminalLine.module.css';

interface TerminalLineProps {
  line: OutputLine;
}

export function TerminalLine({ line }: TerminalLineProps) {
  const className = [
    styles.line,
    line.className === 'error' && styles.error,
    line.className === 'dim' && styles.dim,
    line.className === 'bright' && styles.bright,
    line.className === 'highlight' && styles.highlight,
    line.className === 'warning' && styles.warning,
  ]
    .filter(Boolean)
    .join(' ');

  if (line.component) {
    return <div className={className}>{line.component}</div>;
  }

  if (line.isHtml) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: line.text }}
      />
    );
  }

  return <div className={className}>{line.text || '\u00A0'}</div>;
}
