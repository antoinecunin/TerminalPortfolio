import { registry, uid } from './registry';
import { t } from '../i18n/t';
import type { CommandDefinition } from '../types';

const VALID_FILES = ['cv.pdf'];

const wget: CommandDefinition = {
  name: 'wget',
  aliases: [],
  description: 'Download files',
  usage: 'wget cv.pdf',
  category: 'action',
  completeArgs: (partial) =>
    VALID_FILES.filter((f) => f.startsWith(partial)),
  execute: (ctx) => {
    const target = ctx.args[0];

    if (!target) {
      return {
        lines: [
          { id: uid(), text: `  ${t('wget.usage')}`, className: 'dim' },
        ],
      };
    }

    // Accept "cv.pdf" or "https://antoinecunin.fr/cv.pdf"
    const filename = target.split('/').pop() ?? target;
    if (!VALID_FILES.includes(filename)) {
      return {
        lines: [
          { id: uid(), text: `  wget: ${t('wget.not_found', target)}`, className: 'error' },
        ],
      };
    }

    // TODO: uncomment download logic once cv.pdf is in public/
    // const link = document.createElement('a');
    // link.href = `/${filename}`;
    // link.download = filename;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    return {
      lines: [
        { id: uid(), text: `  wget: ${t('wget.unavailable')}`, className: 'warning' },
      ],
    };
  },
};

registry.register(wget);
