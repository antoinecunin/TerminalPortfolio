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
  execute: (ctx: CommandContext) => CommandOutput;
}
