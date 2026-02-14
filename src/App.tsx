import { useEffect, useRef } from 'react';
import { Terminal } from './components/Terminal/Terminal';
import { CRTOverlay } from './components/CRTOverlay';
import { BootSequence } from './components/BootSequence';
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
  const isBooting = useTerminalStore((s) => s.isBooting);
  const setBooting = useTerminalStore((s) => s.setBooting);
  const addOutputBlock = useTerminalStore((s) => s.addOutputBlock);

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Resize root to visual viewport (handles virtual keyboard on mobile)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      document.documentElement.style.setProperty('--app-height', `${vv.height}px`);
    };
    update();
    vv.addEventListener('resize', update);
    return () => vv.removeEventListener('resize', update);
  }, []);

  // Welcome message fires once when boot completes
  const welcomed = useRef(false);
  useEffect(() => {
    if (isBooting || welcomed.current) return;
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
  }, [isBooting]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isBooting) {
    return (
      <CRTOverlay>
        <BootSequence onComplete={() => setBooting(false)} />
      </CRTOverlay>
    );
  }

  return (
    <CRTOverlay>
      <Terminal />
    </CRTOverlay>
  );
}
