export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { command: '', args: [], flags: {} };
  }

  // Handle export VAR=value specially
  if (trimmed.startsWith('export ')) {
    return {
      command: 'export',
      args: [trimmed.slice(7).trim()],
      flags: {},
    };
  }

  // Handle ./ execution
  if (trimmed.startsWith('./')) {
    return {
      command: './',
      args: [trimmed.slice(2)],
      flags: {},
    };
  }

  const tokens = tokenize(trimmed);
  const command = tokens[0].toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('--')) {
      const eqIndex = token.indexOf('=');
      if (eqIndex !== -1) {
        flags[token.slice(2, eqIndex)] = token.slice(eqIndex + 1);
      } else {
        flags[token.slice(2)] = true;
      }
    } else if (token.startsWith('-') && token.length > 1 && !token.startsWith('-', 1)) {
      const flagContent = token.slice(1);
      // Multi-char flag with value: -name pattern
      if (flagContent.length > 1 && i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
        flags[flagContent] = tokens[i + 1];
        i++; // Skip next token (consumed as value)
      } else {
        // Short flags: -a, -la
        for (const char of flagContent) {
          flags[char] = true;
        }
      }
    } else {
      args.push(token);
    }
  }

  return { command, args, flags };
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inQuote: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (inQuote) {
      if (char === inQuote) {
        inQuote = null;
      } else {
        current += char;
      }
    } else if (char === '"' || char === "'") {
      inQuote = char;
    } else if (char === ' ' || char === '\t') {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}
