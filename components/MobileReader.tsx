'use client';
import { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import {
  TitlePage, OriginLeft, OriginTerminal,
  ExperienceLeft, ExperienceRight,
  ToolsLeft, ToolsRight,
  ProjectsPage, PROJECT_PAGES, type SectionId,
  FocusTerminal, ContactRight,
  GuestBookLeft, GuestBookRight,
  InnerCover,
} from './PageContents';
import { ageStyle } from '@/lib/paper';
import { prefersReducedMotion } from '@/hooks/use-reduced-motion';

// ── The pages, in reading order ──────────────────────────────────────
const PAGES: { label: string; head: string; rune: string; node: React.ReactNode; paper: boolean }[] = [
  { label: 'Title',      head: '',                  rune: 'ᚨ', node: <TitlePage mobile />, paper: true },
  { label: 'Origin',     head: 'The Origin',        rune: 'ᚩ', node: <OriginLeft mobile />, paper: true },
  { label: 'Origin',     head: 'The Origin',        rune: 'ᚩ', node: <OriginTerminal active={true} mobile />, paper: true },
  { label: 'Experience', head: 'Journeys & Quests', rune: 'ᛖ', node: <ExperienceLeft mobile />, paper: true },
  { label: 'Experience', head: 'Journeys & Quests', rune: 'ᛖ', node: <ExperienceRight mobile />, paper: true },
  { label: 'Tools',      head: 'Runes & Tools',     rune: 'ᛏ', node: <ToolsLeft mobile />, paper: true },
  { label: 'Tools',      head: 'Runes & Tools',     rune: 'ᛏ', node: <ToolsRight mobile />, paper: true },
  ...PROJECT_PAGES.map((_, i) => ({ label: 'Projects', head: 'Arcane Constructs', rune: 'ᛈ', node: <ProjectsPage page={i} mobile />, paper: true })),
  { label: 'Focus',      head: 'Current Focus',     rune: 'ᛇ', node: <FocusTerminal active={true} mobile />, paper: true },
  { label: 'Contact',    head: 'Contact',           rune: 'ᛗ', node: <ContactRight mobile />, paper: true },
  { label: 'Guestbook',  head: 'Leave a Word',      rune: 'ᛟ', node: <GuestBookLeft mobile />, paper: true },
  { label: 'Guestbook',  head: 'Leave a Word',      rune: 'ᛟ', node: <GuestBookRight mobile />, paper: true },
  { label: 'End',        head: '',                  rune: 'ᛟ', node: <InnerCover right={true} />, paper: false },
];

const firstPage = (label: string) => PAGES.findIndex(p => p.label === label);

const CATALOGUE: { id: SectionId; label: string; rune: string; pageIndex: number }[] = [
  { id: 'origin',     label: 'Origin',     rune: 'ᚩ', pageIndex: firstPage('Origin') },
  { id: 'experience', label: 'Journeys',   rune: 'ᛖ', pageIndex: firstPage('Experience') },
  { id: 'tools',      label: 'Tools',      rune: 'ᛏ', pageIndex: firstPage('Tools') },
  { id: 'projects',   label: 'Projects',   rune: 'ᛈ', pageIndex: firstPage('Projects') },
  { id: 'contact',    label: 'Contact',    rune: 'ᛗ', pageIndex: firstPage('Focus') },
  { id: 'guestbook',  label: 'Guestbook',  rune: 'ᛟ', pageIndex: firstPage('Guestbook') },
];

// Deep link support: /#projects opens the reader at that section
function pageFromHash(): number {
  if (typeof window === 'undefined') return 0;
  const id = window.location.hash.slice(1);
  return CATALOGUE.find(c => c.id === id)?.pageIndex ?? 0;
}

// Elements a drag must never hijack (drawing, typing, tapping links/buttons)
const NO_DRAG = 'input, textarea, select, canvas, button, a, [contenteditable="true"]';

// ── One page of the book ─────────────────────────────────────────────
function MobilePage({ idx }: { idx: number }) {
  const page = PAGES[idx];
  const age = useMemo(() => ageStyle(idx * 2 + 101, 'front'), [idx]);
  if (!page.paper) return <div className="absolute inset-0">{page.node}</div>;
  return (
    <div className="m-page absolute inset-0 flex flex-col bg-parchment-right overflow-hidden">
      <div className="m-head shrink-0" aria-hidden>{page.head}</div>
      <div className="relative flex-1 min-h-0">{page.node}</div>
      <div className="m-folio shrink-0" aria-hidden>{idx + 1}</div>
      <div aria-hidden className="page-layer page-age" style={age} />
      <div aria-hidden className="page-layer page-curve-right" />
    </div>
  );
}

type Turn = { dir: 'next' | 'prev'; target: number };

export default function MobileReader({
  onClose,
  onStateChange,
  playTurn,
  playClick,
  playMulti,
}: {
  onClose: () => void;
  onStateChange: (state: 'reading' | 'closing') => void;
  playTurn: () => void;
  playClick: () => void;
  playMulti: () => void;
}) {
  const [index, setIndex] = useState(pageFromHash);
  const [turn, setTurn] = useState<Turn | null>(null);

  const areaRef = useRef<HTMLDivElement>(null);
  const turningRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const castRef = useRef<HTMLDivElement>(null);
  const progress = useRef({ v: 0 });
  const turnRef = useRef<Turn | null>(null);
  turnRef.current = turn;
  const autoFinish = useRef(false);
  const busy = useRef(false);

  // ── Drawing a turn at progress p (0 → 1) ──────────────────────────
  // The turning page hinges at the spine (left edge). Going forward the
  // current page lifts away; going back the previous page comes down onto
  // the current one. The page under it gets the turning page's shadow.
  const apply = useCallback(() => {
    const t = turnRef.current, el = turningRef.current;
    if (!t || !el) return;
    const p = progress.current.v;
    const angle = t.dir === 'next' ? -180 * p : -180 * (1 - p);
    el.style.transform = `rotateY(${angle.toFixed(2)}deg)`;
    const a = Math.abs(angle); // 0 flat on the page, 90 upright
    if (shadeRef.current) shadeRef.current.style.opacity = (Math.min(1, a / 90) * 0.55).toFixed(3);
    const cast = castRef.current;
    if (cast) {
      const w = areaRef.current?.clientWidth ?? 360;
      if (a < 90) {
        const edge = w * Math.cos((a * Math.PI) / 180);
        const k = 0.38 * Math.sin((a * Math.PI) / 180);
        cast.style.background = `linear-gradient(to right, rgba(10,5,0,${(k * 0.5).toFixed(3)}) 0px, rgba(10,5,0,${k.toFixed(3)}) ${edge.toFixed(0)}px, transparent ${(edge + 34).toFixed(0)}px)`;
      } else {
        cast.style.background = 'none';
      }
    }
  }, []);

  const finish = useCallback((to: 0 | 1, speed = 1) => {
    const t = turnRef.current;
    if (!t) return;
    busy.current = true;
    const distance = Math.abs(to - progress.current.v);
    gsap.to(progress.current, {
      v: to,
      duration: prefersReducedMotion() ? 0.001 : Math.max(0.12, 0.55 * distance / speed),
      ease: to === 1 ? 'power2.out' : 'power2.inOut',
      onUpdate: apply,
      onComplete: () => {
        if (to === 1) setIndex(t.target);
        setTurn(null);
        busy.current = false;
      },
    });
  }, [apply]);

  // Paint the first frame of a turn as soon as its layers exist
  useLayoutEffect(() => {
    if (!turn) return;
    apply();
    if (autoFinish.current) { autoFinish.current = false; finish(1); }
  }, [turn, apply, finish]);

  const begin = (dir: Turn['dir'], target: number, auto: boolean) => {
    progress.current.v = 0;
    autoFinish.current = auto;
    setTurn({ dir, target });
  };

  // ── Buttons, tabs, keys ───────────────────────────────────────────
  const navigate = (direction: 'next' | 'prev') => {
    if (busy.current || turn) return;
    if (direction === 'next' && index >= PAGES.length - 1) { playTurn(); onClose(); return; }
    if (direction === 'prev' && index <= 0) { playTurn(); onClose(); return; }
    playTurn();
    begin(direction, direction === 'next' ? index + 1 : index - 1, true);
  };

  const jumpTo = (i: number) => {
    if (busy.current || turn || i === index) return;
    playMulti();
    begin(i > index ? 'next' : 'prev', i, true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') navigate('next');
      if (e.key === 'ArrowLeft') navigate('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ── Turning with a finger ─────────────────────────────────────────
  const drag = useRef<{ id: number; x: number; y: number; t: number; dir: Turn['dir'] | null } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (busy.current || turn || e.button > 0) return;
    if ((e.target as HTMLElement).closest(NO_DRAG)) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), dir: null };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.dir) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { drag.current = null; return; } // a scroll
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      const dir = dx < 0 ? 'next' : 'prev';
      const target = dir === 'next' ? index + 1 : index - 1;
      if (target < 0 || target >= PAGES.length) { drag.current = null; return; }
      d.dir = dir;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      playTurn();
      begin(dir, target, false);
    }
    const w = areaRef.current?.clientWidth ?? 360;
    const along = d.dir === 'next' ? -dx : dx;
    progress.current.v = Math.min(1, Math.max(0, along / (w * 0.85)));
    apply();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.dir || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const velocity = (d.dir === 'next' ? -dx : dx) / Math.max(1, performance.now() - d.t); // px/ms
    const complete = e.type !== 'pointercancel' && (progress.current.v > 0.33 || velocity > 0.45);
    finish(complete ? 1 : 0, complete ? Math.max(1, velocity * 2) : 1);
  };

  // ── Section tabs and the URL ──────────────────────────────────────
  const activeCat = [...CATALOGUE].reverse().find(c => index >= c.pageIndex) ?? CATALOGUE[0];
  const beforeSections = index < CATALOGUE[0].pageIndex;

  useEffect(() => {
    const hash = index >= CATALOGUE[0].pageIndex ? `#${activeCat.id}` : '';
    if (window.location.hash !== hash) history.replaceState(null, '', hash || window.location.pathname);
  }, [index, activeCat.id]);
  useEffect(() => () => { history.replaceState(null, '', window.location.pathname); }, []);

  // Layers: the page underneath, the turning page's shadow, the turning page
  const beneath = turn ? (turn.dir === 'next' ? turn.target : index) : index;
  const turning = turn ? (turn.dir === 'next' ? index : turn.target) : null;
  const pagesLeft = PAGES.length - 1 - index;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#080c09]">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-11 shrink-0">
        <span className="font-cinzel text-[#d4af6a]/70 text-[10px] tracking-[0.3em] uppercase">The Grimoire of Cipher</span>
        <button
          onClick={() => { playClick(); onStateChange('closing'); onClose(); }}
          aria-label="Close the book"
          className="font-cinzel text-[#d4c5a0]/70 text-[11px] tracking-widest border border-[#d4c5a0]/25 w-8 h-8 rounded-full flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* The book: a leather board with the open page on it */}
      <div className="flex-1 min-h-0 px-2 pb-0 pt-1">
        <div className="relative h-full rounded-[3px_8px_0_0] bg-cover-texture pl-[11px] pr-[10px] pt-[9px] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          {/* Spine edge where the page is bound */}
          <div aria-hidden className="absolute left-0 top-0 bottom-0 w-[11px] rounded-l-[3px] bg-[linear-gradient(90deg,#070a08,#1c2620_60%,#0d120f)]" />
          {/* Fore-edge: the pages still to read */}
          <div aria-hidden className="page-stack absolute right-[3px] top-[11px] bottom-0" style={{ width: 2 + pagesLeft * 0.45 }} />

          <div
            ref={areaRef}
            className="relative h-full overflow-hidden"
            style={{ perspective: '1700px', perspectiveOrigin: '0% 50%', touchAction: 'pan-y' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div key={beneath} className="absolute inset-0" style={{ zIndex: 1 }} inert={turn ? true : undefined}>
              <MobilePage idx={beneath} />
            </div>
            {turn && <div ref={castRef} aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />}
            {turning !== null && (
              <div
                key={turning}
                ref={turningRef}
                className="absolute inset-0"
                inert
                style={{ zIndex: 3, transformOrigin: '0% 50%', backfaceVisibility: 'hidden', transform: turn?.dir === 'prev' ? 'rotateY(-180deg)' : undefined }}
              >
                <MobilePage idx={turning} />
                <div ref={shadeRef} aria-hidden className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(20,10,0,.35),rgba(20,10,0,.75))]" style={{ opacity: 0 }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leather tabs glued to the foot of the page block */}
      <nav aria-label="Sections" className="shrink-0 px-2">
        <div className="flex gap-[3px] px-[11px] -mt-px">
          {CATALOGUE.map((entry) => {
            const isActive = !beforeSections && activeCat.id === entry.id;
            return (
              <button
                key={entry.id}
                onClick={() => jumpTo(entry.pageIndex)}
                aria-label={`Go to ${entry.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`m-tab flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-b-[6px] transition-all duration-200 ${isActive ? 'm-tab-active h-[46px]' : 'h-[40px]'}`}
              >
                <span className="font-cinzel text-[13px] leading-none">{entry.rune}</span>
                <span className="font-cinzel text-[7.5px] tracking-[0.12em] uppercase truncate max-w-full px-0.5">{entry.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Page controls */}
      <div className="shrink-0 flex items-center justify-between px-5 h-12">
        <button
          onClick={() => navigate('prev')}
          aria-label="Previous page"
          className="font-cinzel text-[#d4c5a0]/70 text-[11px] tracking-widest px-2 py-2"
        >
          ← prev
        </button>
        <span className="font-serif italic text-[12px] text-[#d4c5a0]/60" aria-live="polite">
          {index + 1} <span className="opacity-50">of</span> {PAGES.length}
        </span>
        <button
          onClick={() => navigate('next')}
          aria-label="Next page"
          className="font-cinzel text-[#d4c5a0]/70 text-[11px] tracking-widest px-2 py-2"
        >
          next →
        </button>
      </div>
    </div>
  );
}
