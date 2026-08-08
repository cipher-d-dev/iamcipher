'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

// Sparse, slow dust motes that drift near the open book.
// Distinct from Particles.tsx (which is the full-screen magical embers).
// These are slower, dimmer, and constrained to the book's footprint area.
const MOTE_COUNT = 10;

// Seeded pseudo-random for stable initial positions (avoids SSR/hydration mismatch)
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function DustMotes({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const motes = Array.from(container.children) as HTMLElement[];
    const rand = seededRand(7331);

    // Kill any running tweens
    tweensRef.current.forEach(t => t.kill());
    tweensRef.current = [];

    motes.forEach((mote, i) => {
      // Initial scatter — constrained to ±220px x / ±260px y around center
      const startX = (rand() - 0.5) * 440;
      const startY = (rand() - 0.5) * 520;
      gsap.set(mote, {
        x: startX,
        y: startY,
        opacity: 0,
        scale: 0.4 + rand() * 0.8,
      });

      // Each mote drifts slowly upward and laterally, fading in/out
      const duration = 7 + rand() * 8;       // 7–15s per cycle
      const driftX   = (rand() - 0.5) * 80;  // ±40px lateral drift
      const driftY   = -(30 + rand() * 50);  // 30–80px upward drift

      const tween = gsap.to(mote, {
        x: `+=${driftX}`,
        y: `+=${driftY}`,
        opacity: isActive ? (0.06 + rand() * 0.12) : 0,  // very faint
        duration,
        repeat: -1,
        yoyo: true,
        delay: rand() * duration,   // stagger start so they don't pulse in sync
        ease: 'sine.inOut',
      });

      tweensRef.current.push(tween);
    });

    return () => {
      tweensRef.current.forEach(t => t.kill());
      tweensRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade the whole group in/out as bookState changes
  useEffect(() => {
    gsap.to(containerRef.current, {
      opacity: isActive ? 1 : 0,
      duration: 1.8,
      ease: 'power2.inOut',
    });

    // Also nudge individual mote target opacities when state changes
    const container = containerRef.current;
    if (!container) return;
    const motes = Array.from(container.children) as HTMLElement[];
    const rand = seededRand(7331);
    motes.forEach((mote) => {
      gsap.to(mote, {
        opacity: isActive ? (0.06 + rand() * 0.12) : 0,
        duration: 2,
        ease: 'power2.inOut',
        overwrite: false,
      });
    });
  }, [isActive]);

  return (
    // Constrained to ~book footprint — 500×660 centred on screen
    <div
      ref={containerRef}
      className="pointer-events-none absolute"
      style={{
        width: '500px',
        height: '660px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0,
        zIndex: 15,
      }}
    >
      {Array.from({ length: MOTE_COUNT }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            // Slightly warm white / faint amber — dust in candlelight
            background: i % 3 === 0
              ? 'rgba(255, 220, 160, 0.9)'
              : 'rgba(220, 210, 190, 0.9)',
            width: i % 4 === 0 ? '2px' : '1.5px',
            height: i % 4 === 0 ? '2px' : '1.5px',
            boxShadow: '0 0 3px 1px rgba(255,210,140,0.4)',
            top: '50%',
            left: '50%',
          }}
        />
      ))}
    </div>
  );
}
