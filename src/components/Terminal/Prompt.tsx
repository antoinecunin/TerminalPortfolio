import { useTerminalStore } from '../../store/terminalStore';
import styles from './Prompt.module.css';

export function Prompt() {
  const cwd = useTerminalStore((s) => s.cwd);
  const sshSession = useTerminalStore((s) => s.sshSession);

  const home = '/home/antoine';
  const displayPath = cwd.startsWith(home)
    ? '~' + cwd.slice(home.length)
    : cwd;

  const user = 'visitor';
  const host = sshSession
    ? `${sshSession}`
    : 'antoine-cunin.dev';

  return (
    <span className={styles.prompt}>
      <span className={styles.user}>{user}</span>
      <span className={styles.at}>@</span>
      <span className={styles.host}>{host}</span>
      <span className={styles.colon}>:</span>
      <span className={styles.path}>{displayPath}</span>
      <span className={styles.dollar}>$ </span>
    </span>
  );
}
