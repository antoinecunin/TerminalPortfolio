export function getTerminalColumns(): number {
  const style = getComputedStyle(document.documentElement);
  const fontSize =
    parseFloat(style.getPropertyValue('--term-font-size')) || 14;
  const charWidth = fontSize * 0.6;
  const padding = window.innerWidth <= 768 ? 8 * 2 : 16 * 2;
  const available = window.innerWidth - padding;
  return Math.floor(available / charWidth);
}
