'use client';
import { useEffect, useRef } from 'react';
import { useCursor, CursorState } from '@/context/CursorContext';

// ── Config ────────────────────────────────────────────────────────────
const AURA_LERP      = 0.20;   // aura spring — higher = tighter
const TRAIL_MAX      = 12;     // max live ink drops
const TRAIL_LIFE_MS  = 420;    // drop lifetime
const TRAIL_INTERVAL = 38;     // min ms between drop spawns
const SIGIL_LIFE_MS  = 600;    // click burst lifetime

// Aura gradient strings — pre-built, no allocation in RAF
const AURA_BG: Record<CursorState, string> = {
  idle:    'radial-gradient(circle, rgba(212,175,106,0.50) 0%, transparent 70%)',
  point:   'radial-gradient(circle, rgba(46,179,111,0.60)  0%, transparent 70%)',
  reading: 'radial-gradient(circle, rgba(46,179,111,0.40)  0%, transparent 70%)',
  brush:   'radial-gradient(circle, rgba(164,48,42,0.55)   0%, transparent 70%)',
  rune:    'radial-gradient(circle, rgba(180,130,220,0.60) 0%, transparent 70%)',
  lock:    'radial-gradient(circle, rgba(240,208,137,0.75) 0%, transparent 70%)',
};

// Ink color prefix strings — pre-built
const INK: Record<CursorState, string> = {
  idle:    'rgba(212,175,106,',
  point:   'rgba(46,179,111,',
  reading: 'rgba(92,77,51,',
  brush:   'rgba(164,48,42,',
  rune:    'rgba(180,130,220,',
  lock:    'rgba(240,208,137,',
};

// Pre-built alpha strings: indices 0–99 map to "0.00"–"0.99"
// Avoids toFixed() string allocation every frame
const ALPHA = Array.from({ length: 100 }, (_, i) => (i / 100).toFixed(2));

interface Drop {
  x: number; y: number;
  r: number;
  born: number;
  ink: string;   // full pre-built color prefix e.g. "rgba(212,175,106,"
  cos: number;   // pre-baked cos(angle) for rotation-free ellipse
  sin: number;   // pre-baked sin(angle)
  sy: number;    // pre-baked y-scale
}

interface Sigil {
  x: number; y: number;
  born: number;
  ink: string;
}

// ── SVG shapes (no SVG filters — filters are GPU-expensive in animated layers) ──

function ShapeIdle() {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
      <defs>
        <linearGradient id="a-fill" x1="3" y1="3" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f5ecd0"/>
          <stop offset="40%"  stopColor="#e8d5a8"/>
          <stop offset="100%" stopColor="#c9a96e"/>
        </linearGradient>
      </defs>
      <path d="M3 3 L28 14 L18 17 L24 36 L19 38 L13 19 L3 22 Z"
        fill="url(#a-fill)" stroke="#8b6b2e" strokeWidth="0.8" strokeLinejoin="round"/>
      <path d="M3 3 L28 14 L18 17" stroke="#d4af6a" strokeWidth="1"   strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <path d="M3 3 L3 22 L13 19"  stroke="#d4af6a" strokeWidth="0.7" strokeLinecap="round" opacity="0.6"/>
      <line x1="16" y1="23" x2="19" y2="27" stroke="#a07830" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
      <line x1="16" y1="27" x2="19" y2="31" stroke="#a07830" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
      <circle cx="3" cy="3" r="1.2" fill="#fff8e0" opacity="0.95"/>
    </svg>
  );
}

function ShapePoint() {
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
      <defs>
        <radialGradient id="pt-g" cx="50%" cy="20%" r="60%">
          <stop offset="0%"   stopColor="#a0ffcc"/>
          <stop offset="100%" stopColor="#2eb36f"/>
        </radialGradient>
      </defs>
      <path d="M14 2 C14 2 8 8 8 20 L8 26 C8 30 20 30 20 26 L20 20 C20 8 14 2 14 2Z"
        fill="url(#pt-g)" stroke="#2eb36f" strokeWidth="0.8" opacity="0.92"/>
      <line x1="11" y1="18" x2="17" y2="18" stroke="#fff" strokeWidth="0.7" opacity="0.5"/>
      <line x1="14" y1="15" x2="14" y2="21" stroke="#fff" strokeWidth="0.7" opacity="0.5"/>
      <circle cx="14" cy="3" r="2" fill="#a0ffcc" opacity="0.9"/>
    </svg>
  );
}

function ShapeReading() {
  return (
    <svg width="20" height="44" viewBox="0 0 20 44" fill="none">
      <defs>
        <linearGradient id="q-shaft" x1="10" y1="2" x2="10" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f5f0e0"/>
          <stop offset="60%"  stopColor="#e0d0a0"/>
          <stop offset="100%" stopColor="#b89a60"/>
        </linearGradient>
      </defs>
      <path d="M10 4 C6 8 2 18 4 28 L10 26 Z"  fill="#f0ead8" stroke="#c8b88a" strokeWidth="0.5" opacity="0.8"/>
      <path d="M10 4 C14 8 18 18 16 28 L10 26 Z" fill="#e8ddc8" stroke="#c8b88a" strokeWidth="0.5" opacity="0.7"/>
      <line x1="10" y1="4" x2="10" y2="42" stroke="url(#q-shaft)" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M8 38 L10 44 L12 38 Z" fill="#2b2013" opacity="0.9"/>
      <circle cx="10" cy="43" r="1" fill="#2eb36f" opacity="0.8"/>
    </svg>
  );
}

function ShapeBrush() {
  return (
    <div style={{
      position: 'absolute',
      left: '-9px',
      top:  '-46px',
      transform: 'rotate(-45deg)',
      transformOrigin: '9px 46px',
    }}>
      <svg width="18" height="46" viewBox="0 0 18 46" fill="none">
        <defs>
          <linearGradient id="b-handle" x1="9" y1="0" x2="9" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#c9a96e"/>
            <stop offset="100%" stopColor="#8b6b2e"/>
          </linearGradient>
        </defs>
        <rect x="7.5" y="1" width="3" height="30" rx="1.5" fill="url(#b-handle)" stroke="#6b4e1e" strokeWidth="0.5"/>
        <rect x="6.5" y="28" width="5" height="4" rx="0.5" fill="#b0b0b0" stroke="#888" strokeWidth="0.4"/>
        <path d="M6.5 32 C5 36 4 40 9 46 C14 40 13 36 11.5 32 Z" fill="#a4302a" opacity="0.95"/>
        <line x1="9" y1="33" x2="9" y2="44" stroke="rgba(255,180,180,0.4)" strokeWidth="0.8" strokeLinecap="round"/>
        <circle cx="9" cy="45" r="0.8" fill="#ff9980" opacity="0.85"/>
      </svg>
    </div>
  );
}

function ShapeRune() {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
      <defs>
        <linearGradient id="r-fill" x1="3" y1="3" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#e0c8f8"/>
          <stop offset="100%" stopColor="#9060c0"/>
        </linearGradient>
      </defs>
      <path d="M3 3 L28 14 L18 17 L24 36 L19 38 L13 19 L3 22 Z"
        fill="url(#r-fill)" stroke="#b490e0" strokeWidth="0.8" strokeLinejoin="round" opacity="0.95"/>
      <line x1="15" y1="22" x2="19" y2="26" stroke="#e0c8f8" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="15" y1="26" x2="19" y2="30" stroke="#e0c8f8" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="3" cy="3" r="1.2" fill="#e0c8f8" opacity="0.9"/>
    </svg>
  );
}

function ShapeLock() {
  return (
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
      <defs>
        <linearGradient id="l-fill" x1="3" y1="3" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fff8d0"/>
          <stop offset="100%" stopColor="#d4af6a"/>
        </linearGradient>
      </defs>
      <path d="M3 3 L28 14 L18 17 L24 36 L19 38 L13 19 L3 22 Z"
        fill="url(#l-fill)" stroke="#f0d089" strokeWidth="1" strokeLinejoin="round"/>
      <rect x="13" y="23" width="7" height="5" rx="1" stroke="#d4af6a" strokeWidth="0.8" fill="none" opacity="0.9"/>
      <path d="M14.5 23 C14.5 21 18.5 21 18.5 23" stroke="#d4af6a" strokeWidth="0.8" fill="none" opacity="0.9"/>
      <circle cx="16.5" cy="25.5" r="0.8" fill="#f0d089" opacity="0.9"/>
      <circle cx="3" cy="3" r="1.4" fill="#fff8d0"/>
    </svg>
  );
}

// ── Batched canvas paint — single save/restore per full pass ──────────

function paintDrops(ctx: CanvasRenderingContext2D, drops: Drop[], now: number) {
  if (!drops.length) return;
  // Draw all drops in one save/restore block
  ctx.save();
  for (const d of drops) {
    const age   = now - d.born;
    const t     = age / TRAIL_LIFE_MS;   // 0 → 1
    if (t >= 1) continue;
    // Fast rise (0→0.15t), slow fade (0.15t→1t)
    const alpha = t < 0.15 ? t / 0.15 * 0.65 : 0.65 * (1 - (t - 0.15) / 0.85);
    if (alpha < 0.01) continue;

    const ai = Math.min(99, Math.floor(alpha * 100));
    ctx.fillStyle = d.ink + ALPHA[ai] + ')';
    ctx.beginPath();
    // Rotation-free ellipse via transform matrix directly on the path points
    // For small circles just draw arc — skip the transform, use slight y-scale via ellipse
    ctx.ellipse(d.x, d.y, d.r, d.r * d.sy, d.cos, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function paintSigils(ctx: CanvasRenderingContext2D, sigils: Sigil[], now: number) {
  if (!sigils.length) return;
  ctx.save();
  for (const s of sigils) {
    const t     = (now - s.born) / SIGIL_LIFE_MS;
    if (t >= 1) continue;
    const alpha = 1 - t;
    const ai    = Math.min(99, Math.floor(alpha * 100));

    ctx.translate(s.x, s.y);

    // Outer ring
    ctx.beginPath();
    ctx.arc(0, 0, 8 + t * 52, 0, Math.PI * 2);
    ctx.strokeStyle = s.ink + ALPHA[Math.min(99, Math.floor(alpha * 0.9 * 100))] + ')';
    ctx.lineWidth   = 1.5 * (1 - t);
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(0, 0, 5 + t * 28, 0, Math.PI * 2);
    ctx.strokeStyle = s.ink + ALPHA[Math.min(99, Math.floor(alpha * 0.55 * 100))] + ')';
    ctx.lineWidth   = 1;
    ctx.stroke();

    ctx.translate(-s.x, -s.y);
  }
  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────
export default function MagicCursor() {
  const { cursorState } = useCursor();

  const sharpRef  = useRef<HTMLDivElement>(null);
  const auraRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable state lives in refs — zero re-renders on move
  const px        = useRef(-200);
  const py        = useRef(-200);
  const ax        = useRef(-200);   // aura x (lerped)
  const ay        = useRef(-200);   // aura y (lerped)
  const visible   = useRef(false);
  const stateRef  = useRef<CursorState>('idle');
  const drops     = useRef<Drop[]>([]);
  const sigils    = useRef<Sigil[]>([]);
  const lastDrop  = useRef(0);
  const rafId     = useRef(0);
  const dirty     = useRef(false);  // true when canvas needs a repaint

  // Sync state ref + aura color without touching the RAF loop
  useEffect(() => {
    stateRef.current = cursorState;
    if (auraRef.current) {
      auraRef.current.style.background = AURA_BG[cursorState];
    }
  }, [cursorState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ctx = canvas.getContext('2d')!;

    // ── Pointer: update position directly in handler, not in RAF ──────
    // This is the key fix for sharp cursor lag — DOM mutation happens
    // synchronously in the event handler, not one frame later.
    const onMove = (e: PointerEvent | MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      px.current = x;
      py.current = y;

      // Move sharp cursor immediately — no RAF delay
      if (sharpRef.current) {
        sharpRef.current.style.transform = `translate(${x}px,${y}px)`;
      }

      if (!visible.current) {
        visible.current = true;
        ax.current = x;
        ay.current = y;
        if (sharpRef.current) sharpRef.current.style.opacity = '1';
      }

      // Spawn ink drop (throttled)
      const now = Date.now();
      if (now - lastDrop.current >= TRAIL_INTERVAL) {
        lastDrop.current = now;
        if (drops.current.length >= TRAIL_MAX) drops.current.shift();
        const r   = 1.2 + Math.random() * 2.0;
        const ang = Math.random() * Math.PI * 2;
        drops.current.push({
          x, y, r,
          born: now,
          ink:  INK[stateRef.current],
          cos:  Math.cos(ang),
          sin:  Math.sin(ang),
          sy:   0.70 + Math.random() * 0.15,
        });
        dirty.current = true;
      }
    };

    const onLeave = () => {
      visible.current = false;
      if (sharpRef.current) sharpRef.current.style.opacity = '0';
      if (auraRef.current)  auraRef.current.style.opacity  = '0';
    };
    const onEnter = () => {
      visible.current = true;
      if (sharpRef.current) sharpRef.current.style.opacity = '1';
    };
    const onDown = (e: MouseEvent) => {
      sigils.current.push({ x: e.clientX, y: e.clientY, born: Date.now(), ink: INK[stateRef.current] });
      dirty.current = true;
    };

    // capture:true — fires before setPointerCapture redirection
    document.addEventListener('pointermove', onMove as EventListener, { passive: true, capture: true });
    document.addEventListener('mouseleave',  onLeave);
    document.addEventListener('mouseenter',  onEnter);
    document.addEventListener('mousedown',   onDown,  { capture: true });

    // ── RAF loop: only aura spring + canvas repaints ─────────────────
    // Sharp cursor is already moved in the event handler above.
    // This loop only runs aura lerp and canvas — both need per-frame timing.
    const tick = () => {
      rafId.current = requestAnimationFrame(tick);

      // Aura spring
      const dax = px.current - ax.current;
      const day = py.current - ay.current;
      if (Math.abs(dax) > 0.1 || Math.abs(day) > 0.1) {
        ax.current += dax * AURA_LERP;
        ay.current += day * AURA_LERP;
        if (auraRef.current) {
          auraRef.current.style.transform = `translate(${ax.current - 32}px,${ay.current - 32}px)`;
          auraRef.current.style.opacity   = visible.current ? '1' : '0';
        }
      }

      // Canvas — only repaint if something is alive or was just marked dirty
      const now = Date.now();
      const hasDrops  = drops.current.length  > 0;
      const hasSigils = sigils.current.length > 0;

      if (!dirty.current && !hasDrops && !hasSigils) return;
      dirty.current = false;

      // Cull expired — in-place splice is faster than filter (no allocation)
      for (let i = drops.current.length - 1; i >= 0; i--) {
        if (now - drops.current[i].born >= TRAIL_LIFE_MS) drops.current.splice(i, 1);
        else dirty.current = true;  // still alive → need next frame
      }
      for (let i = sigils.current.length - 1; i >= 0; i--) {
        if (now - sigils.current[i].born >= SIGIL_LIFE_MS) sigils.current.splice(i, 1);
        else dirty.current = true;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paintDrops(ctx, drops.current, now);
      paintSigils(ctx, sigils.current, now);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener('pointermove', onMove as EventListener, { capture: true });
      document.removeEventListener('mouseleave',  onLeave);
      document.removeEventListener('mouseenter',  onEnter);
      document.removeEventListener('mousedown',   onDown,  { capture: true });
      window.removeEventListener('resize', resize);
    };
  }, []);

  const Shape = {
    idle:    <ShapeIdle />,
    point:   <ShapePoint />,
    reading: <ShapeReading />,
    brush:   <ShapeBrush />,
    rune:    <ShapeRune />,
    lock:    <ShapeLock />,
  }[cursorState];

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99997 }}
      />
      <div
        ref={auraRef}
        aria-hidden="true"
        style={{
          position:     'fixed',
          top: 0, left: 0,
          width: 64, height: 64,
          borderRadius:  '50%',
          pointerEvents: 'none',
          zIndex:        99998,
          opacity:       0,
          willChange:    'transform',
          background:    AURA_BG['idle'],
          transition:    'background 0.35s ease',
        }}
      />
      <div
        ref={sharpRef}
        aria-hidden="true"
        style={{
          position:     'fixed',
          top: 0, left: 0,
          pointerEvents: 'none',
          zIndex:        99999,
          opacity:       0,
          willChange:    'transform',
        }}
      >
        {Shape}
      </div>
    </>
  );
}
