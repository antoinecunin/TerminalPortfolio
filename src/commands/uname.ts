import { registry, uid } from './registry';
import { SITE_DOMAIN } from '../constants';
import type { CommandDefinition } from '../types';

const uname: CommandDefinition = {
  name: 'uname',
  aliases: [],
  description: 'Display system information',
  usage: 'uname [-a]',
  category: 'info',
  execute: (ctx) => {
    if (ctx.flags['a'] || ctx.args.includes('-a')) {
      return {
        lines: [
          { id: uid(), text: '' },
          {
            id: uid(),
            text: `  PortfolioOS 2.0.0 ${SITE_DOMAIN} x86_64 React/19 TypeScript/5 Vite/6`,
          },
          { id: uid(), text: '' },
          { id: uid(), text: '  Kernel     : React 19 + TypeScript', className: 'dim' },
          { id: uid(), text: '  Build      : Vite 6', className: 'dim' },
          { id: uid(), text: '  State      : Zustand', className: 'dim' },
          { id: uid(), text: '  Styling    : CSS Modules + CSS Variables', className: 'dim' },
          { id: uid(), text: '  Font       : JetBrains Mono', className: 'dim' },
          { id: uid(), text: '  Hosting    : Vercel', className: 'dim' },
          { id: uid(), text: '' },
        ],
      };
    }

    return {
      lines: [{ id: uid(), text: 'PortfolioOS' }],
    };
  },
};

registry.register(uname);
