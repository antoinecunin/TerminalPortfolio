import { useEffect } from 'react';
import { useTerminalStore } from '../store/terminalStore';
import styles from './GlitchOverlay.module.css';

const GLITCH_DURATION = 3500;

const GARBAGE_LINES = [
  '▓▒░ SEGFAULT 0x4E554C4C ░▒▓',
  'fs: destroying inode table...',
  '■■■ MEMORY CORRUPTION ■■■',
  'panic: runtime error: invalid',
  '0xDEADBEEF 0xCAFEBABE 0xB16B00B5',
  '>>>>>>>>>> FATAL <<<<<<<<<<',
  'irq 13: nobody cared',
  'BUG: unable to handle page fault',
  '▓█▓█▓ DATA LOSS IMMINENT █▓█▓█',
  'Killed process 1 (init)',
];

export function GlitchOverlay() {
  const glitchActive = useTerminalStore((s) => s.glitchActive);
  const setGlitchActive = useTerminalStore((s) => s.setGlitchActive);

  useEffect(() => {
    if (!glitchActive) return;
    const timer = setTimeout(() => setGlitchActive(false), GLITCH_DURATION);
    return () => clearTimeout(timer);
  }, [glitchActive, setGlitchActive]);

  if (!glitchActive) return null;

  return (
    <div className={styles.overlay}>
      {/* Scattered error messages */}
      <div className={styles.garbageContainer}>
        {GARBAGE_LINES.map((line, i) => (
          <div key={i} className={styles.garbageLine} style={{ animationDelay: `${i * 0.07}s` }}>
            {line}
          </div>
        ))}
      </div>

      {/* RGB-split text layers */}
      <div className={styles.rgbR}>KERNEL PANIC</div>
      <div className={styles.rgbB}>KERNEL PANIC</div>
      <div className={styles.glitchText}>KERNEL PANIC</div>

      {/* Horizontal tear bars */}
      <div className={styles.tearBar} />
      <div className={styles.tearBar} />
      <div className={styles.tearBar} />
      <div className={styles.tearBar} />

      {/* Distortion blocks */}
      <div className={styles.distortBlock} />
      <div className={styles.distortBlock2} />

      {/* Layers */}
      <div className={styles.scanlines} />
      <div className={styles.noise} />
      <div className={styles.colorFlash} />
    </div>
  );
}
