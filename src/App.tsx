import { useEffect, useRef } from 'react';
import { Terminal } from './components/Terminal/Terminal';
import { useTerminalStore } from './store/terminalStore';
import { uid } from './commands/registry';
import { t } from './i18n/t';

const BANNER = [
  '  _   _  _ _____ ___  ___ _  _ ___',
  ' /_\\ | \\| |_   _/ _ \\|_ _| \\| | __|',
  '/ _ \\| .` | | || (_) || || .` | _|',
  '\\_/ \\_\\_|\\_| |_| \\___/|___|_|\\_|___|',
  '  ___ _   _ _  _ ___ _  _',
  ' / __| | | | \\| |_ _| \\| |',
  '| (__| |_| | .` || || .` |',
  ' \\___|\\___/|_|\\_|___|_|\\_|',
];

export default function App() {
  const theme = useTerminalStore((s) => s.theme);
  const addOutputBlock = useTerminalStore((s) => s.addOutputBlock);

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Welcome message on mount (ref guards against StrictMode double-fire)
  const welcomed = useRef(false);
  useEffect(() => {
    if (welcomed.current) return;
    welcomed.current = true;
    addOutputBlock({
      id: uid(),
      lines: [
        { id: uid(), text: '' },
        ...BANNER.map((line) => ({ id: uid(), text: `  ${line}`, className: 'highlight' })),
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('welcome.title')}`, className: 'dim' },
        { id: uid(), text: '' },
        { id: uid(), text: `  ${t('welcome.hint')}`, className: 'dim' },
        { id: uid(), text: '' },
      ],
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Terminal />;
}
