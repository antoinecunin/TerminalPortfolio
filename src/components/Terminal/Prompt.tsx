import { useTerminalStore } from '../../store/terminalStore';
import { HOME_PATH, SITE_DOMAIN } from '../../constants';
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

  const displayPath = cwd.startsWith(HOME_PATH)
    ? '~' + cwd.slice(HOME_PATH.length)
    : cwd;

  const user = 'visitor';
  const host = sshSession ?? SITE_DOMAIN;

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
