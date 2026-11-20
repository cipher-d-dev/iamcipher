import type { CSSProperties } from 'react';

// Shared by the desktop book and the phone reader.

// Deterministic "random" so every page has its own, stable blemishes
function seeded(seed: number) {
  let t = seed * 9301 + 49297;
  return () => { t = (t * 9301 + 49297) % 233280; return t / 233280; };
}

/** Foxing spots, an occasional cup ring and uneven edge browning. */
export function ageStyle(seed: number, side: 'front' | 'back'): CSSProperties {
  const r = seeded(seed + 7);
  const layers: string[] = [];
  const spots = 2 + Math.floor(r() * 3);
  for (let k = 0; k < spots; k++) {
    const x = Math.round(8 + r() * 84), y = Math.round(6 + r() * 88);
    const size = Math.round(6 + r() * 22), a = (0.04 + r() * 0.07).toFixed(3);
    layers.push(`radial-gradient(circle at ${x}% ${y}%, rgba(120,72,22,${a}) 0, rgba(120,72,22,${(+a * 0.45).toFixed(3)}) ${Math.round(size * 0.45)}px, transparent ${size}px)`);
  }
  if (r() < 0.3) { // a faint cup ring
    const x = Math.round(25 + r() * 50), y = Math.round(55 + r() * 35), rad = Math.round(34 + r() * 18);
    layers.push(`radial-gradient(circle at ${x}% ${y}%, transparent ${rad - 3}px, rgba(110,66,20,.07) ${rad - 1}px, rgba(110,66,20,.035) ${rad + 1}px, transparent ${rad + 3}px)`);
  }
  // Browning creeping in unevenly from the outer edge
  const outer = side === 'front' ? 100 : 0;
  for (let k = 0; k < 3; k++) {
    const y = Math.round(r() * 100), w = Math.round(30 + r() * 60);
    layers.push(`radial-gradient(ellipse ${Math.round(w * 0.5)}px ${w}px at ${outer}% ${y}%, rgba(110,66,20,${(0.05 + r() * 0.05).toFixed(3)}), transparent 70%)`);
  }
  return { zIndex: 2, background: layers.join(','), mixBlendMode: 'multiply' };
}
