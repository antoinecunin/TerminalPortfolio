import { useTerminalStore } from '../store/terminalStore';
import type { Locale, LocalizedString, LocalizedArray } from '../types';

/** Resolve a localized field using the current store locale. */
export function l(field: LocalizedString): string;
export function l(field: LocalizedArray): string[];
export function l(field: LocalizedString | LocalizedArray): string | string[] {
  const locale = useTerminalStore.getState().locale;
  return field[locale] ?? field['fr'];
}

/** Resolve a localized field with an explicit locale. */
export function lWith(field: LocalizedString, locale: Locale): string;
export function lWith(field: LocalizedArray, locale: Locale): string[];
export function lWith(field: LocalizedString | LocalizedArray, locale: Locale): string | string[] {
  return field[locale] ?? field['fr'];
}
