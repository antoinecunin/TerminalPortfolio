import type { CommandDefinition, CommandOutput, CommandContext, OutputLine } from '../types';
import { parseCommand } from '../utils/parseCommand';

let idCounter = 0;
export function uid(): string {
  return `line-${Date.now()}-${idCounter++}`;
}

class CommandRegistry {
  private commands = new Map<string, CommandDefinition>();
  private aliases = new Map<string, string>();

  register(command: CommandDefinition): void {
    this.commands.set(command.name, command);
    for (const alias of command.aliases) {
      this.aliases.set(alias, command.name);
    }
  }

  resolve(name: string): CommandDefinition | null {
    return (
      this.commands.get(name) ??
      this.commands.get(this.aliases.get(name) ?? '') ??
      null
    );
  }

  execute(input: string): CommandOutput {
    const parsed = parseCommand(input);
    if (!parsed.command) {
      return { lines: [] };
    }

    const def = this.resolve(parsed.command);
    if (!def) {
      return {
        lines: [
          {
            id: uid(),
            text: `bash: ${parsed.command}: command not found`,
            className: 'error',
          },
        ],
      };
    }

    const ctx: CommandContext = {
      args: parsed.args,
      flags: parsed.flags,
      rawInput: input,
    };

    return def.execute(ctx);
  }

  getAll(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  getByCategory(category: string): CommandDefinition[] {
    return this.getAll().filter((c) => c.category === category);
  }

  autocomplete(partial: string): string[] {
    const allNames = [...this.commands.keys(), ...this.aliases.keys()];
    return allNames.filter((n) => n.startsWith(partial)).sort();
  }
}

export const registry = new CommandRegistry();
