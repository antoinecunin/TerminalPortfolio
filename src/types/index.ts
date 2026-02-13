import type { ReactNode } from 'react';

export interface OutputLine {
  id: string;
  text: string;
  className?: string;
  isHtml?: boolean;
  component?: ReactNode;
}

export interface OutputBlock {
  id: string;
  lines: OutputLine[];
  command?: string;
  /** Snapshot of cwd at execution time (for displaying the correct prompt) */
  cwd?: string;
  sshSession?: string | null;
}

export type Theme = 'green' | 'amber' | 'blue';
export type Locale = 'fr' | 'en' | 'de';

export type CommandCategory = 'navigation' | 'info' | 'system' | 'action';

export interface CommandContext {
  args: string[];
  flags: Record<string, string | boolean>;
  rawInput: string;
}

export interface CommandOutput {
  lines: OutputLine[];
}

export interface CommandDefinition {
  name: string;
  aliases: string[];
  description: string;
  usage: string;
  category: CommandCategory;
  execute: (ctx: CommandContext) => CommandOutput | Promise<CommandOutput>;
  /** Custom argument autocompletion. Returns matching completions for the partial arg. */
  completeArgs?: (partial: string) => string[];
}
