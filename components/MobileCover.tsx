'use client';
import { useEffect, useState } from 'react';
import { CoverFront, TitlePage } from './PageContents';
import { prefersReducedMotion } from '@/hooks/use-reduced-motion';

const W = 400, H = 600;
const SWING_MS = 750;

/**
 * Phone opening screen: the grimoire's real leather cover, sized to fit.
 * Tapping it swings the cover open on its spine to reveal the title page,
 * which is also the first page the reader opens on.
 */
export default function MobileCover({ onTap, onOpen }: {
  /** Runs inside the tap itself (browsers only start audio from a gesture) */
  onTap?: () => void;
  /** Runs once the cover has swung open */
  onOpen: () => void;
}) {
  const [scale, setScale] = useState(0.8);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 64) / W, (window.innerHeight * 0.66) / H, 1));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const open = () => {
    if (opening) return;
    onTap?.();
    if (prefersReducedMotion()) { onOpen(); return; }
    setOpening(true);
    setTimeout(onOpen, SWING_MS);
  };

  return (
    <div className="relative z-20 flex flex-col items-center gap-6">
      <div style={{ width: W * scale, height: H * scale }}>
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
            onClick={open}
            aria-label="Open the grimoire"
            className="absolute inset-0 block text-left"
            style={{
              transformOrigin: '0% 50%',
              transform: opening ? 'rotateY(-118deg)' : 'rotateY(0deg)',
              transition: `transform ${SWING_MS}ms cubic-bezier(.45,.05,.3,1)`,
              backfaceVisibility: 'hidden',
              filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.7))',
            }}
          >
            <CoverFront onOpen={open} />
          </button>
        </div>
      </div>

      <p
        className="font-caveat text-[#d4c5a0]/70 text-lg transition-opacity duration-300"
        style={{ opacity: opening ? 0 : 1 }}
      >
        tap the cover to open
      </p>
    </div>
  );
}
