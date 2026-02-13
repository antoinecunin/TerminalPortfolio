import styles from './CRTOverlay.module.css';

export function CRTOverlay({ children }: { children: React.ReactNode }) {
  return <div className={styles.crt}>{children}</div>;
}
