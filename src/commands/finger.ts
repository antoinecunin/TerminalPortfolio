import { registry, uid } from './registry';
import { recommendations } from '../data/recommendations';
import { l } from '../i18n/l';
import { t } from '../i18n/t';
import { imageToAscii } from '../utils/imageToAscii';
import { getTerminalColumns } from '../utils/terminalColumns';
import type { CommandDefinition } from '../types';

const finger: CommandDefinition = {
  name: 'finger',
  aliases: [],
  description: 'Display testimonials',
  usage: 'finger [name]',
  category: 'info',
  completeArgs: (partial) =>
    recommendations
      .map((r) => r.id)
      .filter((id) => id.startsWith(partial)),
  execute: async (ctx) => {
    const name = ctx.args[0]?.toLowerCase();

    if (!name) {
      // List available people
      const lines = [
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('finger.available')}`, className: 'highlight' },
        { id: uid(), text: '' },
      ];

      for (const rec of recommendations) {
        lines.push({
          id: uid(),
          text: `  finger ${rec.id.padEnd(20)} — ${rec.name} (${l(rec.title)})`,
        });
      }

      lines.push({ id: uid(), text: '' });
      return { lines };
    }

    const rec = recommendations.find(
      (r) => r.id === name || r.name.toLowerCase().includes(name)
    );

    if (!rec) {
      return {
        lines: [
          {
            id: uid(),
            text: `  finger: '${name}': ${t('finger.unknown_user')}`,
            className: 'error',
          },
          { id: uid(), text: '' },
          {
            id: uid(),
            text: `  ${t('finger.available_list')} : ${recommendations.map((r) => r.id).join(', ')}`,
            className: 'dim',
          },
        ],
      };
    }

    const lines = [
      { id: uid(), text: '' },
      { id: uid(), text: `  ── ${rec.name} ──`, className: 'highlight' },
      { id: uid(), text: `  ${l(rec.title)} — ${l(rec.relation)}`, className: 'bright' },
      ...(rec.company
        ? [{ id: uid(), text: `  ${rec.company}`, className: 'dim' }]
        : []),
      { id: uid(), text: '' },
    ];

    if (rec.photo) {
      const cols = Math.min(70, getTerminalColumns() - 2);
      if (cols >= 50) {
        try {
          const asciiLines = await imageToAscii(rec.photo, { width: cols });
          for (const line of asciiLines) {
            lines.push({ id: uid(), text: `  ${line}`, className: 'dim' });
          }
          lines.push({ id: uid(), text: '' });
        } catch {
          // fallback silencieux — le témoignage s'affiche sans portrait
        }
      }
    }

    const textLines = l(rec.text);
    for (const textLine of textLines) {
      lines.push({ id: uid(), text: `  « ${textLine}` });
    }

    // Close quote on last line
    const lastIdx = lines.length - 1;
    lines[lastIdx] = { ...lines[lastIdx], text: lines[lastIdx].text + ' »' };

    lines.push({ id: uid(), text: '' });

    return { lines };
  },
};

registry.register(finger);
