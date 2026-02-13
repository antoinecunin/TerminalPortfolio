import { useTerminalStore } from '../store/terminalStore';
import translations from './translations';

/**
 * Get a translated string for the current locale.
 * Supports {0}, {1}... placeholders replaced by args.
 */
export function t(key: string, ...args: string[]): string {
  const locale = useTerminalStore.getState().locale;
  const entry = translations[key];
  if (!entry) return key;

  let text = entry[locale] ?? entry['fr'] ?? key;

  for (let i = 0; i < args.length; i++) {
    text = text.replace(`{${i}}`, args[i]);
  }

  return text;
}
