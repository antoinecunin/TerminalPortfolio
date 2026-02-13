import { registry } from './registry';
import type { CommandDefinition } from '../types';

const clear: CommandDefinition = {
  name: 'clear',
  aliases: [],
  description: 'Clear the terminal screen',
  usage: 'clear',
  category: 'system',
  execute: () => {
    // The Terminal component checks for clear and calls clearOutput
    return { lines: [] };
  },
};

registry.register(clear);
