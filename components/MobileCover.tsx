'use client';
import { useEffect, useRef, useState } from 'react';
import { CoverFront, TitlePage } from './PageContents';
import { prefersReducedMotion } from '@/hooks/use-reduced-motion';

const W = 400, H = 600;
export const SWING_MS = 750;

/** Scale that fits the cover on screen (also used to predict where it sits). */
export function coverScale() {
  if (typeof window === 'undefined') return 0.8;
  return Math.min((window.innerWidth - 64) / W, (window.innerHeight * 0.66) / H, 1);
}

/**
 * Phone opening screen: the grimoire's real leather cover, sized to fit.
 * Tapping it swings the cover open on its spine to reveal the title page,
 * then hands the page's on-screen rectangle to the reader so the page can
 * grow from exactly there. When the book closes it mounts already open and
 * swings shut.
 */
export default function MobileCover({ onTap, onOpen, startOpen = false, holdOpen = false, onSettled }: {
  /** Runs inside the tap itself (browsers only start audio from a gesture) */
  onTap?: () => void;
  /** Runs once the cover has swung open, with where the first page sits */
  onOpen: (pageRect: DOMRect) => void;
  /** Mount open (the book is closing) and swing shut */
  startOpen?: boolean;
  /** Stay open while the reader is still shrinking back onto the cover */
  holdOpen?: boolean;
  onSettled?: () => void;
}) {
  // Computed up front: this only renders on the client, and a first render at
  // a placeholder size would visibly jump.
  const [scale, setScale] = useState(coverScale);
  const [open, setOpen] = useState(startOpen);
  const [animating, setAnimating] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => setScale(coverScale());
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Closing: once the reader has landed on us, swing shut
  useEffect(() => {
    if (!startOpen || holdOpen) return;
    if (prefersReducedMotion()) { setOpen(false); onSettled?.(); return; }
    let t: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      setAnimating(true);
      setOpen(false);
      t = setTimeout(() => { setAnimating(false); onSettled?.(); }, SWING_MS);
    }));
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdOpen]);

  const tap = () => {
    if (open || animating) return;
    onTap?.();
    const rect = () => pageRef.current!.getBoundingClientRect();
    if (prefersReducedMotion()) { onOpen(rect()); return; }
    setAnimating(true);
    setOpen(true);
    setTimeout(() => onOpen(rect()), SWING_MS);
  };

  return (
    <div className="relative z-20 flex flex-col items-center gap-6">
      <div ref={pageRef} style={{ width: W * scale, height: H * scale }}>
        <div
          className="relative"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0', perspective: '1800px' }}
        >
          {/* Thickness: the page block peeking out at the fore-edge and foot */}
          <div aria-hidden className="page-stack absolute" style={{ left: 8, right: -7, top: 8, bottom: -6, borderRadius: 2 }} />
          <div aria-hidden className="absolute bg-cover-back" style={{ left: 4, right: -11, top: 4, bottom: -10, borderRadius: '2px 8px 8px 2px', zIndex: -1 }} />

          {/* The first page, waiting under the cover */}
          <div aria-hidden className="absolute inset-0 overflow-hidden rounded-r-sm">
            <TitlePage mobile />
          </div>

          {/* The cover itself, hinged at the spine */}
          <button
            type="button"
            onClick={tap}
            aria-label="Open the grimoire"
            className="absolute inset-0 block text-left"
            style={{
              transformOrigin: '0% 50%',
              transform: open ? 'rotateY(-118deg)' : 'rotateY(0deg)',
              transition: animating ? `transform ${SWING_MS}ms cubic-bezier(.45,.05,.3,1)` : 'none',
              backfaceVisibility: 'hidden',
              filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.7))',
            }}
          >
            <CoverFront onOpen={tap} />
          </button>
        </div>
      </div>

      <p
        className="font-caveat text-[#d4c5a0]/70 text-lg transition-opacity duration-500"
        style={{ opacity: open ? 0 : 1 }}
      >
        tap the cover to open
      </p>
    </div>
  );
}
