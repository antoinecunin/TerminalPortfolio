import { create } from 'zustand';
import type { OutputBlock, Theme, Locale } from '../types';

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
}

export const useTerminalStore = create<TerminalState>((set) => ({
  // Output
  outputBlocks: [],
  addOutputBlock: (block) =>
    set((state) => ({ outputBlocks: [...state.outputBlocks, block] })),
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
  cwd: '/home/antoine',
  setCwd: (cwd) => set({ cwd }),

  // SSH session
  sshSession: null,
  setSshSession: (session) => set({ sshSession: session }),

  // Settings
  theme: 'green',
  setTheme: (theme) => set({ theme }),
  locale: 'fr',
  setLocale: (locale) => set({ locale }),

  // Boot
  isBooting: true,
  setBooting: (isBooting) => set({ isBooting }),
}));
