'use client';
import { useEffect, useState, useRef } from 'react';

const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚩ', 'ᚱ', 'ᚳ', 'ᚷ', 'ᚹ', 'ᚻ', 'ᚾ', 'ᛁ', 'ᛄ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛝ', 'ᛞ', 'ᛟ'];

const PHASES = [
  'Summoning the grimoire…',
  'Inscribing the runes…',
  'Binding the pages…',
  'Awakening the sigils…',
  'The tome stirs…',
];

// Images to preload
const PRELOAD_IMAGES = [
  '/photo1.jpg',
  '/photo2.jpg',
  'https://www.transparenttextures.com/patterns/handmade-paper.png',
];

function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // resolve even on error — don't block
          img.src = url;
        })
    )
  );
}

export default function MagicalLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [runeGrid, setRuneGrid] = useState<string[]>([]);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  // Generate a randomised rune grid
  useEffect(() => {
    const grid = Array.from({ length: 24 }, () => RUNES[Math.floor(Math.random() * RUNES.length)]);
    setRuneGrid(grid);
  }, []);

  // Shuffle a random rune every 120ms for the scramble effect
  useEffect(() => {
    const id = setInterval(() => {
      setRuneGrid((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        next[i] = RUNES[Math.floor(Math.random() * RUNES.length)];
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  // Advance phase text every ~600ms
  useEffect(() => {
    const id = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, 700);
    return () => clearInterval(id);
  }, []);

  // Main loading logic
  useEffect(() => {
    let prog = 0;
    const MIN_MS = 2800; // minimum loader display time
    const start = Date.now();

    // Tick progress smoothly
    const ticker = setInterval(() => {
      prog = Math.min(prog + Math.random() * 4, 85); // advance but stall near 85 until real load
      setProgress(Math.round(prog));
    }, 80);

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      clearInterval(ticker);

      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_MS - elapsed);

      setTimeout(() => {
        // Rush to 100%
        let p = prog;
        const rush = setInterval(() => {
          p = Math.min(p + 5, 100);
          setProgress(Math.round(p));
          if (p >= 100) {
            clearInterval(rush);
            setExiting(true);
            setTimeout(onDone, 900); // wait for fade-out
          }
        }, 30);
      }, remaining);
    };

    // Wait for document + images
    Promise.all([
      preloadImages(PRELOAD_IMAGES),
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      }),
    ]).then(finish);

    return () => clearInterval(ticker);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080c09] transition-opacity duration-700 ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#112b1c_0%,transparent_65%)] pointer-events-none" />

      {/* Rune grid background */}
      <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-x-6 gap-y-4 px-16 opacity-[0.06] pointer-events-none select-none">
        {runeGrid.map((r, i) => (
          <span key={i} className="font-cinzel text-[#2eb36f] text-4xl transition-all duration-150">
            {r}
          </span>
        ))}
      </div>

      {/* Central sigil ring */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer spinning ring */}
        <div
          className="absolute w-40 h-40 rounded-full border border-dashed border-[#2eb36f]/30 animate-[spin_8s_linear_infinite]"
          style={{ borderSpacing: '12px' }}
        />
        {/* Inner spinning ring — counter */}
        <div className="absolute w-28 h-28 rounded-full border border-[#ffae00]/20 animate-[spin_5s_linear_infinite_reverse]" />
        {/* Static inner ring */}
        <div className="absolute w-20 h-20 rounded-full border border-[#2eb36f]/15" />

        {/* Sigil centre */}
        <div className="w-16 h-16 rounded-full bg-[#090d0b] border border-[#2eb36f]/20 flex items-center justify-center shadow-[0_0_30px_rgba(46,179,111,0.15)]">
          <span
            className="text-3xl text-[#2eb36f] font-cinzel animate-[pulse_2s_ease-in-out_infinite]"
            style={{ textShadow: '0 0 12px rgba(46,179,111,0.7)' }}
          >
            ✧
          </span>
        </div>
      </div>

      {/* Phase text */}
      <p
        key={phase}
        className="font-caveat text-[#849c89] text-xl mb-6 tracking-wide animate-[fadeIn_0.4s_ease-in]"
      >
        {PHASES[phase]}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-[2px] bg-[#1a2b1f] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-[#2eb36f] to-[#ffae00] rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(46,179,111,0.6)' }}
        />
      </div>

      {/* Progress number */}
      <p className="font-mono text-[#2eb36f]/50 text-[11px] tracking-[0.2em]">
        {String(progress).padStart(3, '0')} / 100
      </p>

      {/* Bottom rune strip */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 opacity-20 select-none pointer-events-none">
        {RUNES.slice(0, 12).map((r, i) => (
          <span key={i} className="font-cinzel text-[#d4af6a] text-sm">
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
