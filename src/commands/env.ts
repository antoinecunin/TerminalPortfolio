import { registry, uid } from './registry';
import { useTerminalStore } from '../store/terminalStore';
import { contact } from '../data/contact';
import { t } from '../i18n/t';
import { linkify, hasUrls } from '../utils/linkify';
import { HOME_PATH, SITE_DOMAIN } from '../constants';
import type { CommandDefinition, CommandOutput, Theme, Locale } from '../types';

const VALID_THEMES: Theme[] = ['classic', 'rich', 'neon', 'ocean', 'amber'];
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
      `HOME=${HOME_PATH}`,
      `PWD=${state.cwd}`,
      `SHELL=/bin/bash`,
      `HOSTNAME=${SITE_DOMAIN}`,
      `EMAIL=${contact.email}`,
      `LINKEDIN=${contact.linkedin}`,
      `GITHUB=${contact.github}`,
      `CALENDLY=${contact.calendly}`,
    ];

    const lines = vars.map((v) => {
      if (!hasUrls(v)) {
        return { id: uid(), text: v };
      }
      return { id: uid(), text: linkify(v), isHtml: true };
    });

    return { lines };
  },
};

// --- export ---
const exportCmd: CommandDefinition = {
  name: 'export',
  aliases: [],
  description: 'Set environment variable',
  usage: 'export THEME=classic\nexport LANG=fr',
  category: 'system',
  execute: (ctx): CommandOutput => {
    const assignment = ctx.args[0];

    if (!assignment || !assignment.includes('=')) {
      return {
        lines: [
          { id: uid(), text: '' },
          { id: uid(), text: '  Usage:', className: 'dim' },
          { id: uid(), text: '    export THEME=classic|rich|neon|ocean|amber' },
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
