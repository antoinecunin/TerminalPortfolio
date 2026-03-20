// Bayer 4×4 ordered dithering thresholds (pre-normalized)
const BAYER_4X4 = [
  [0.03125, 0.53125, 0.15625, 0.65625],
  [0.78125, 0.28125, 0.90625, 0.40625],
  [0.21875, 0.71875, 0.09375, 0.59375],
  [0.96875, 0.46875, 0.84375, 0.34375],
];

// Braille dot bit positions: [row 0-3][col 0-1] → bit flag
const DOT_BITS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];

interface ImageToAsciiOptions {
  width?: number;
  invert?: boolean;
}

const MAX_CACHE = 20;
const cache = new Map<string, string[]>();

function createContext(w: number, h: number): CanvasRenderingContext2D {
  if (typeof OffscreenCanvas !== 'undefined') {
    const c = new OffscreenCanvas(w, h);
    return c.getContext('2d') as unknown as CanvasRenderingContext2D;
  }
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c.getContext('2d')!;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

function loadImage(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });

  imageCache.set(url, promise);
  return promise;
}

/** Preload images so they're ready when needed */
export function preloadImages(urls: string[]): void {
  for (const url of urls) {
    loadImage(url);
  }
}

/**
 * Convert an image to braille-character art.
 * Each braille character encodes a 2×4 dot grid, giving 8× the effective
 * resolution of traditional ASCII art. Ordered dithering (Bayer 4×4) is
 * used to simulate grayscale through dot density.
 */
export async function imageToAscii(
  url: string,
  options: ImageToAsciiOptions = {},
): Promise<string[]> {
  const { width: cols = 70, invert = false } = options;
  const cacheKey = `${url}|${cols}|${invert}`;

  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const img = await loadImage(url);

  // Each braille char = 2 dots wide × 4 dots tall
  const dotsW = cols * 2;
  // Aspect ratio: each dot ≈ 4.2×5.6px in JetBrains Mono 14px/1.6lh → ratio 0.75
  const dotsH = Math.round((img.height / img.width) * dotsW * 0.75);
  const charRows = Math.ceil(dotsH / 4);
  const actualDotsH = charRows * 4;

  const ctx = createContext(dotsW, actualDotsH);
  ctx.drawImage(img, 0, 0, dotsW, actualDotsH);
  const { data } = ctx.getImageData(0, 0, dotsW, actualDotsH);

  const lines: string[] = [];

  for (let charRow = 0; charRow < charRows; charRow++) {
    const chars: string[] = [];
    for (let charCol = 0; charCol < cols; charCol++) {
      let pattern = 0;
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const px = charCol * 2 + dx;
          const py = charRow * 4 + dy;

          const i = (py * dotsW + px) * 4;
          const a = data[i + 3];
          if (a < 128) continue;

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const threshold = BAYER_4X4[py % 4][px % 4];

          const isOn = invert ? brightness < threshold : brightness > threshold;
          if (isOn) {
            pattern |= DOT_BITS[dy][dx];
          }
        }
      }
      chars.push(String.fromCharCode(0x2800 + pattern));
    }
    lines.push(chars.join(''));
  }

  if (cache.size >= MAX_CACHE) {
    cache.delete(cache.keys().next().value!);
  }
  cache.set(cacheKey, lines);
  return lines;
}
