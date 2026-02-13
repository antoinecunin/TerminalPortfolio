import { registry, uid } from './registry';
import { useTerminalStore } from '../store/terminalStore';
import { contact } from '../data/contact';
import { t } from '../i18n/t';
import type { CommandDefinition, CommandOutput, Theme, Locale } from '../types';

const VALID_THEMES: Theme[] = ['green', 'amber', 'blue'];
const VALID_LOCALES: Locale[] = ['fr', 'en', 'de'];

// --- env / printenv ---
const env: CommandDefinition = {
  name: 'env',
  aliases: ['printenv'],
  description: 'Display environment variables',
  usage: 'env',
  category: 'system',
  execute: (): CommandOutput => {
    const state = useTerminalStore.getState();

    const vars = [
      `LANG=${state.locale}`,
      `THEME=${state.theme}`,
      `USER=visitor`,
      `HOME=/home/antoine`,
      `PWD=${state.cwd}`,
      `SHELL=/bin/bash`,
      `HOSTNAME=antoinecunin.fr`,
      `EMAIL=${contact.email}`,
      `LINKEDIN=${contact.linkedin}`,
      `GITHUB=${contact.github}`,
      `CALENDLY=${contact.calendly}`,
    ];

    // Make URLs clickable
    const lines = vars.map((v) => {
      const htmlLine = v.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      if (htmlLine !== v) {
        return { id: uid(), text: htmlLine, isHtml: true };
      }
      return { id: uid(), text: v };
    });

    return { lines };
  },
};

// --- export ---
const exportCmd: CommandDefinition = {
  name: 'export',
  aliases: [],
  description: 'Set environment variable',
  usage: 'export THEME=green\nexport LANG=fr',
  category: 'system',
  execute: (ctx): CommandOutput => {
    const assignment = ctx.args[0];

    if (!assignment || !assignment.includes('=')) {
      return {
        lines: [
          { id: uid(), text: '' },
          { id: uid(), text: '  Usage:', className: 'dim' },
          { id: uid(), text: '    export THEME=green|amber|blue' },
          { id: uid(), text: '    export LANG=fr|en|de' },
          { id: uid(), text: '' },
        ],
      };
    }

    const eqIndex = assignment.indexOf('=');
    const varName = assignment.slice(0, eqIndex).toUpperCase();
    const value = assignment.slice(eqIndex + 1).toLowerCase();

    if (varName === 'THEME') {
      if (!VALID_THEMES.includes(value as Theme)) {
        return {
          lines: [
            {
              id: uid(),
              text: `  ${t('env.themes_available')} : ${VALID_THEMES.join(', ')}`,
              className: 'error',
            },
          ],
        };
      }
      useTerminalStore.getState().setTheme(value as Theme);
      return {
        lines: [
          {
            id: uid(),
            text: `  ${t('env.theme_changed')} : ${value}`,
            className: 'bright',
          },
        ],
      };
    }

    if (varName === 'LANG') {
      if (!VALID_LOCALES.includes(value as Locale)) {
        return {
          lines: [
            {
              id: uid(),
              text: `  ${t('env.langs_available')} : ${VALID_LOCALES.join(', ')}`,
              className: 'error',
            },
          ],
        };
      }
      // Set locale BEFORE building the message so t() uses the new locale
      useTerminalStore.getState().setLocale(value as Locale);
      return {
        lines: [
          {
            id: uid(),
            text: `  ${t('env.lang_changed')} : ${value}`,
            className: 'bright',
          },
        ],
      };
    }

    return {
      lines: [
        {
          id: uid(),
          text: `  ${t('env.var_readonly', varName)}`,
          className: 'warning',
        },
        {
          id: uid(),
          text: `  ${t('env.modifiable_vars')} : THEME, LANG`,
          className: 'dim',
        },
      ],
    };
  },
};

registry.register(env);
registry.register(exportCmd);
