import { useEffect } from 'react';
import { Terminal } from './components/Terminal/Terminal';
import { useTerminalStore } from './store/terminalStore';
import { uid } from './commands/registry';

export default function App() {
  const theme = useTerminalStore((s) => s.theme);
  const addOutputBlock = useTerminalStore((s) => s.addOutputBlock);

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Welcome message on mount
  useEffect(() => {
    addOutputBlock({
      id: uid(),
      lines: [
        { id: uid(), text: '' },
        { id: uid(), text: "  Welcome to antoine-cunin.dev", className: 'highlight' },
        { id: uid(), text: '' },
        { id: uid(), text: "  Type 'help' to see available commands.", className: 'dim' },
        { id: uid(), text: '' },
      ],
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Terminal />;
}
