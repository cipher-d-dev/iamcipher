'use client';
import { useEffect, useRef } from 'react';

// ── Grimoire Arrow Cursor ─────────────────────────────────────────────
// A single bone/ivory arrow with gold trim and an etched rune on the shaft.
// Hotspot is the arrow tip at (3, 3) in the SVG coordinate space.
// Position is driven by direct DOM mutation — zero React re-renders on move.

const HOTSPOT_X = 3;
const HOTSPOT_Y = 3;

export default function MagicCursor() {
  const elRef  = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent | MouseEvent) => {
      // Deduplicate — only one RAF per frame
      if (rafRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        el.style.transform = `translate(${x - HOTSPOT_X}px, ${y - HOTSPOT_Y}px)`;
        el.style.opacity = '1';
      });
    };

    const onLeave = () => { el.style.opacity = '0'; };
    const onEnter = () => { el.style.opacity = '1'; };

    window.addEventListener('pointermove', onMove as EventListener, { passive: true });
    window.addEventListener('mousemove',   onMove as EventListener, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove as EventListener);
      window.removeEventListener('mousemove',   onMove as EventListener);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 32,
        height: 40,
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform',
        transform: 'translate(-100px, -100px)',
      }}
    >
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="grim-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.6"/>
          </filter>
        </defs>

        {/* Arrow body — ivory/bone fill with aged texture gradient */}
        <path
          d="M3 3 L28 14 L18 17 L24 36 L19 38 L13 19 L3 22 Z"
          fill="url(#arrow-fill)"
          stroke="#8b6b2e"
          strokeWidth="0.8"
          strokeLinejoin="round"
          filter="url(#grim-shadow)"
        />

        {/* Fill gradient — bone white at tip, aged parchment toward tail */}
        <defs>
          <linearGradient id="arrow-fill" x1="3" y1="3" x2="24" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#f5ecd0"/>
            <stop offset="40%"  stopColor="#e8d5a8"/>
            <stop offset="100%" stopColor="#c9a96e"/>
          </linearGradient>
        </defs>

        {/* Gold trim — edge highlight on leading face */}
        <path
          d="M3 3 L28 14 L18 17"
          stroke="#d4af6a"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M3 3 L3 22 L13 19"
          stroke="#d4af6a"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Rune etched into shaft — ᛋ Sowilo (will/victory), centre of the tail */}
        {/* Drawn as two angled lines forming the rune */}
        <line x1="16" y1="23" x2="19" y2="27" stroke="#a07830" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
        <line x1="16" y1="27" x2="19" y2="31" stroke="#a07830" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>

        {/* Tip accent — tiny bright point at hotspot */}
        <circle cx="3" cy="3" r="1" fill="#fff8e0" opacity="0.95"/>
      </svg>
    </div>
  );
}
