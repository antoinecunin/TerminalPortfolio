import { useTerminalStore } from '../../store/terminalStore';
import styles from './Prompt.module.css';

interface PromptProps {
  /** If provided, use this static cwd instead of the live store value */
  cwd?: string;
  sshSession?: string | null;
}

export function Prompt({ cwd: cwdProp, sshSession: sshProp }: PromptProps = {}) {
  const liveCwd = useTerminalStore((s) => s.cwd);
  const liveSsh = useTerminalStore((s) => s.sshSession);

  const cwd = cwdProp ?? liveCwd;
  const sshSession = sshProp !== undefined ? sshProp : liveSsh;

  const home = '/home/antoine';
  const displayPath = cwd.startsWith(home)
    ? '~' + cwd.slice(home.length)
    : cwd;

  const user = 'visitor';
  const host = sshSession
    ? `${sshSession}`
    : 'antoinecunin.fr';

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
