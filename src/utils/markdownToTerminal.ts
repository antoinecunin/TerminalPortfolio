import { escapeHtml } from './escapeHtml';

interface TerminalLine {
  text: string;
  isHtml: boolean;
}

/**
 * Convert markdown content into terminal-friendly lines with inline HTML styling.
 */
export function markdownToTerminal(content: string): TerminalLine[] {
  const lines = content.split('\n');
  const result: TerminalLine[] = [];
  let inCodeBlock = false;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block toggle
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      i++;
      continue;
    }

    // Inside code block: render as dimmed, indented
    if (inCodeBlock) {
      const escaped = escapeHtml(line);
      result.push({
        text: `<span style="color: var(--term-fg-dim)">  ${escaped}</span>`,
        isHtml: true,
      });
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = inlineFormat(headingMatch[2]);
      if (level === 1) {
        result.push({ text: '', isHtml: false });
        result.push({
          text: `<span style="color: var(--term-accent); font-weight: bold">=== ${text} ===</span>`,
          isHtml: true,
        });
        result.push({ text: '', isHtml: false });
      } else if (level === 2) {
        result.push({ text: '', isHtml: false });
        result.push({
          text: `<span style="color: var(--term-accent); font-weight: bold">--- ${text} ---</span>`,
          isHtml: true,
        });
        result.push({ text: '', isHtml: false });
      } else {
        result.push({
          text: `<span style="color: var(--term-fg-bright); font-weight: bold">${text}</span>`,
          isHtml: true,
        });
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      result.push({
        text: `<span style="color: var(--term-fg-dim)">────────────────────────────────────────</span>`,
        isHtml: true,
      });
      i++;
      continue;
    }

    // Table: collect all consecutive table rows
    if (isTableRow(line)) {
      const tableRows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        const trimmed = lines[i].trim();
        // Skip separator rows like |---|---|
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
          i++;
          continue;
        }
        const cells = trimmed
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cells);
        i++;
      }

      // Calculate max width per column (based on visible text, not markdown syntax)
      const colCount = Math.max(...tableRows.map((r) => r.length));
      const colWidths: number[] = Array(colCount).fill(0);
      for (const row of tableRows) {
        for (let c = 0; c < row.length; c++) {
          colWidths[c] = Math.max(colWidths[c], visibleLength(row[c]));
        }
      }

      // Emit aligned rows
      for (const row of tableRows) {
        const cells = row.map((cell, c) => {
          const pad = colWidths[c] - visibleLength(cell);
          return inlineFormat(cell) + '&nbsp;'.repeat(pad);
        });
        result.push({
          text: `  ${cells.join('  │  ')}`,
          isHtml: true,
        });
      }
      continue;
    }

    // List items
    const listMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1];
      const text = inlineFormat(listMatch[2]);
      result.push({
        text: `${indent}  • ${text}`,
        isHtml: true,
      });
      i++;
      continue;
    }

    // Regular line: apply inline formatting (text is already HTML-escaped)
    const formatted = inlineFormat(line);
    result.push({ text: formatted, isHtml: true });
    i++;
  }

  return result;
}

// Inline markdown rules: [pattern, stripReplace, htmlReplace]
const inlineRules: [RegExp, string, string][] = [
  [/\[([^\]]+)\]\(([^)]+)\)/g, '$1', '<a href="$2" target="_blank" rel="noopener" style="color: var(--term-link); text-decoration: underline">$1</a>'],
  [/\*{3}(.+?)\*{3}/g, '$1', '<span style="color: var(--term-fg-bright); font-weight: bold; font-style: italic">$1</span>'],
  [/\*{2}(.+?)\*{2}/g, '$1', '<span style="color: var(--term-fg-bright); font-weight: bold">$1</span>'],
  [/\*(.+?)\*/g, '$1', '<span style="font-style: italic">$1</span>'],
  [/`([^`]+)`/g, '$1', '<span style="color: var(--term-highlight)">$1</span>'],
];

/** Get the visible text length after markdown syntax is stripped */
function visibleLength(text: string): number {
  let result = text;
  for (const [pattern, strip] of inlineRules) {
    result = result.replace(new RegExp(pattern.source, pattern.flags), strip);
  }
  return result.length;
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|');
}

/** Apply inline markdown formatting (bold, italic, code, links) */
function inlineFormat(text: string): string {
  let result = escapeHtml(text);
  for (const [pattern, , html] of inlineRules) {
    result = result.replace(new RegExp(pattern.source, pattern.flags), html);
  }
  return result;
}
