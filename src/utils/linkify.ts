import { escapeHtml } from './escapeHtml';

/**
 * Transform URLs in text into clickable <a> tags.
 * Non-URL parts are escaped to prevent XSS.
 */
export function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: string[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  while ((m = urlRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(escapeHtml(text.slice(lastIdx, m.index)));
    }
    const url = m[0];
    parts.push(
      `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`
    );
    lastIdx = urlRegex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(escapeHtml(text.slice(lastIdx)));
  }

  return parts.join('');
}

/**
 * Check if text contains any URLs.
 */
export function hasUrls(text: string): boolean {
  return /(https?:\/\/[^\s]+)/.test(text);
}
