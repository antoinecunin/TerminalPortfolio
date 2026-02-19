import { create } from 'zustand';
import { HOME_PATH } from '../constants';
import type { OutputBlock, Theme, Locale } from '../types';

const LOCALE_KEY = 'terminal-locale';
const MAX_OUTPUT_BLOCKS = 100;

function detectLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && ['fr', 'en', 'de'].includes(stored)) return stored as Locale;

  const lang = navigator.language.split('-')[0].toLowerCase();
  if (lang === 'fr') return 'fr';
  if (lang === 'de') return 'de';
  return 'en';
}

interface TerminalState {
  // Output
  outputBlocks: OutputBlock[];
  addOutputBlock: (block: OutputBlock) => void;
  clearOutput: () => void;

  // Command history
  commandHistory: string[];
  historyIndex: number;
  addToHistory: (command: string) => void;
  setHistoryIndex: (index: number) => void;

  // Filesystem
  cwd: string;
  setCwd: (path: string) => void;

  // SSH session
  sshSession: string | null;
  setSshSession: (session: string | null) => void;

  // Settings
  theme: Theme;
  setTheme: (theme: Theme) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Boot
  isBooting: boolean;
  setBooting: (booting: boolean) => void;

  // Glitch effect
  glitchActive: boolean;
  setGlitchActive: (active: boolean) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  // Output
  outputBlocks: [],
  addOutputBlock: (block) =>
    set((state) => {
      const blocks = [...state.outputBlocks, block];
      return {
        outputBlocks: blocks.length > MAX_OUTPUT_BLOCKS
          ? blocks.slice(-MAX_OUTPUT_BLOCKS)
          : blocks,
      };
    }),
  clearOutput: () => set({ outputBlocks: [] }),

  // Command history
  commandHistory: [],
  historyIndex: -1,
  addToHistory: (command) =>
    set((state) => ({
      commandHistory: [command, ...state.commandHistory],
      historyIndex: -1,
    })),
  setHistoryIndex: (index) => set({ historyIndex: index }),

  // Filesystem
  cwd: HOME_PATH,
  setCwd: (cwd) => set({ cwd }),

  // SSH session
  sshSession: null,
  setSshSession: (session) => set({ sshSession: session }),

  // Settings
  theme: 'classic',
  setTheme: (theme) => set({ theme }),
  locale: detectLocale(),
  setLocale: (locale) => {
    localStorage.setItem(LOCALE_KEY, locale);
    set({ locale });
  },

  // Boot
  isBooting: true,
  setBooting: (isBooting) => set({ isBooting }),

  // Glitch effect
  glitchActive: false,
  setGlitchActive: (glitchActive) => set({ glitchActive }),
}));
