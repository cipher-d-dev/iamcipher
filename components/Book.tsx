'use client';
import { useRef, useState, useEffect, useMemo, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CoverFront, InnerCover, CoverBack, TitlePage, TableOfContents, OriginLeft, OriginTerminal, ExperienceLeft, ExperienceRight, ToolsLeft, ToolsRight, ProjectsPage, FocusTerminal, ContactRight, GuestBookLeft, GuestBookRight, type SectionId } from './PageContents';
import GrimoireModal from './GrimoireModal';
import { useCursor } from '@/context/CursorContext';
import { prefersReducedMotion } from '@/hooks/use-reduced-motion';

// ── Static data outside component — never recreated ──────────────────
// pageIndex P shows: left page = back of leaf P-1, right page = front of leaf P.
const CONTENTS_PAGE = 3;   // Contents | Title
const GUESTBOOK_PAGE = 10;
export const SECTION_PAGE: Record<SectionId, number> = {
  origin: 4,      // Origin story | Origin terminal
  experience: 5,  // Experience I | Experience II
  tools: 6,       // Tools I | Tools II
  projects: 7,    // Projects I | II, then III | IV at 8
  contact: 9,     // Current focus | Contact
  guestbook: GUESTBOOK_PAGE,
};

const CATALOGUE: { id: SectionId; label: string; rune: string; index: number }[] = [
  { id: 'origin',     label: 'Origin',     rune: 'ᚩ', index: SECTION_PAGE.origin },
  { id: 'experience', label: 'Experience', rune: 'ᛖ', index: SECTION_PAGE.experience },
  { id: 'tools',      label: 'Tools',      rune: 'ᛏ', index: SECTION_PAGE.tools },
  { id: 'projects',   label: 'Projects',   rune: 'ᛈ', index: SECTION_PAGE.projects },
  { id: 'contact',    label: 'Contact',    rune: 'ᛗ', index: SECTION_PAGE.contact },
  { id: 'guestbook',  label: 'Guestbook',  rune: 'ᛟ', index: SECTION_PAGE.guestbook },
];

const isSection = (v: string): v is SectionId => v in SECTION_PAGE;

// Section tabs live on the leaf whose front page opens the section
const TAB_BY_LEAF: Record<number, (typeof CATALOGUE)[number] | undefined> =
  Object.fromEntries(CATALOGUE.map(c => [c.index, c]));
const TAB_TOP = 46, TAB_STEP = 86, TAB_H = 80;

// The front cover is a real board: a little larger than the pages it covers.
// (Making the leaf itself bigger keeps the overhang in the same layer as the
// cover; separate overhang planes got mis-sorted over the pages.)
const BOARD_X = 11, BOARD_Y = 9;

// ── Print furniture: running heads and folios ──────────────────────────
// Verso (left) pages carry the book's title, recto (right) pages the section.
const RECTO_HEAD: Record<number, string> = {
  4: 'The Origin', 5: 'Journeys & Quests', 6: 'Runes & Tools',
  7: 'Arcane Constructs', 8: 'Arcane Constructs', 9: 'Contact', 10: 'Leave a Word',
};
const VERSO_HEAD = 'The Grimoire of Cipher';

/** Running head + folio for a face. Front of leaf L is the right page of
 *  spread L; back of leaf L is the left page of spread L + 1. */
function pageFurniture(leaf: number, side: 'front' | 'back') {
  const spread = side === 'front' ? leaf : leaf + 1;
  if (spread < 4 || spread > 10) return null; // front matter / end papers
  return side === 'front'
    ? { head: RECTO_HEAD[spread], folio: (spread - 3) * 2 + 1 }
    : { head: VERSO_HEAD, folio: (spread - 3) * 2 };
}

/** Is this face paper (gets curvature, ageing…) or cover leather? */
const isPaperFace = (leaf: number, side: 'front' | 'back', total: number) =>
  leaf !== 0 && !(leaf === total - 1 && side === 'back');

// Deterministic "random" so every page has its own, stable blemishes
function seeded(seed: number) {
  let t = seed * 9301 + 49297;
  return () => { t = (t * 9301 + 49297) % 233280; return t / 233280; };
}

/** Foxing spots, an occasional cup ring and uneven edge browning. */
function ageStyle(seed: number, side: 'front' | 'back'): CSSProperties {
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

/** Shortens every GSAP duration to (almost) nothing for reduced-motion visitors. */
const D = (seconds: number) => (prefersReducedMotion() ? 0.001 : seconds);

// ── Paper layers drawn over every page face ───────────────────────────
function PaperLayers({ leaf, side }: { leaf: number; side: 'front' | 'back' }) {
  const lr = side === 'front' ? 'right' : 'left';
  const furniture = pageFurniture(leaf, side);
  const age = useMemo(() => ageStyle(leaf * 2 + (side === 'front' ? 0 : 1), side), [leaf, side]);
  return (
    <>
      <div aria-hidden className={`page-layer page-ghost page-ghost-${lr}`} />
      <div aria-hidden className="page-layer page-age" style={age} />
      <div aria-hidden className={`page-layer page-curve-${lr}`} />
      <div aria-hidden className="page-layer page-shade" data-leaf-shade />
      <div aria-hidden className="page-layer page-cast" data-leaf-cast />
      {furniture && <>
        <div aria-hidden className="running-head">{furniture.head}</div>
        <div aria-hidden className="folio">{furniture.folio}</div>
      </>}
    </>
  );
}

// ── Lift-able page corner: the mouse way to turn pages ──────────────────
function PageCorner({ side, onTurn, onHover, onLeave }: {
  side: 'left' | 'right';
  onTurn: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const right = side === 'right';
  return (
    <button
      type="button"
      aria-label={right ? 'Next page' : 'Previous page'}
      onClick={(e) => { e.stopPropagation(); onTurn(); }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className={`page-corner page-corner-${side} group absolute bottom-0 ${right ? 'right-0' : 'left-0'} w-[72px] h-[72px] z-30`}
    >
      {/* The folded-back flap */}
      <span aria-hidden className="page-corner-flap" />
      <span
        aria-hidden
        className={`absolute bottom-3 ${right ? 'right-[58px]' : 'left-[58px]'} whitespace-nowrap font-caveat text-[15px] text-[#8b6b4e] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300`}
      >
        {right ? 'turn →' : '← back'}
      </span>
    </button>
  );
}

// The book element is one page wide and its spine is its left edge. Once open,
// the left page hangs off to the left, so shift right by half a spread
// (one half-page = 200px at scale 1) to centre the open book on screen.
const SPREAD_SHIFT = 200;

export default function Book({ ready, onStateChange, playTurnWeighted, playClick, playMulti, playQuill, startTheme, onPageTurn }: {
  /** False while the loader is still covering the page */
  ready: boolean;
  onStateChange: (state: 'closed' | 'opening' | 'reading' | 'closing') => void;
  playTurnWeighted: (leafIndex: number) => void;
  playClick: () => void;
  playMulti: () => void;
  playQuill: () => void;
  startTheme: () => void;
  onPageTurn?: () => void;
}) {
  const [bookState, setBookState] = useState<'closed' | 'opening' | 'reading' | 'closing'>('closed');
  const bookStateRef = useRef(bookState);
  bookStateRef.current = bookState;
  const [pageIndex, setPageIndex] = useState(0);
  const scaleRef = useRef(1); // mirrors scale state — read by GSAP to avoid stale closure
  const [guestbookHasContent, setGuestbookHasContent] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  const { pushCursor, popCursor, setCursorState } = useCursor();

  // Sync book state → cursor state
  useEffect(() => {
    if (bookState === 'reading') setCursorState('reading');
    else setCursorState('idle');
  }, [bookState, setCursorState]);
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<HTMLDivElement[]>([]);
  // Jump-sequence timers — cancelled on close or new jump
  const jumpTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Page to land on when the opening animation finishes (set by jumpTo)
  const openTargetRef = useRef<number | null>(null);
  // Latest jumpTo for children rendered inside the memoised leaves
  const jumpRef = useRef<(target: number) => void>(() => {});

  const leavesContent = useMemo(() => [
    { front: <CoverFront onOpen={() => { playClick(); handleOpen(); }} />, back: <InnerCover /> },
    { front: <div className="w-full h-full bg-parchment-right" />, back: <div className="w-full h-full bg-parchment-left shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)]" /> },
    { front: <div className="w-full h-full bg-parchment-right shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)]" />, back: <TableOfContents onJump={(id) => { playClick(); jumpRef.current(SECTION_PAGE[id]); }} /> },
    { front: <TitlePage />, back: <OriginLeft /> },
    { front: <OriginTerminal active={pageIndex === SECTION_PAGE.origin} playSound={playQuill} />, back: <ExperienceLeft /> },
    { front: <ExperienceRight />, back: <ToolsLeft /> },
    { front: <ToolsRight />, back: <ProjectsPage page={0} /> },
    { front: <ProjectsPage page={1} />, back: <ProjectsPage page={2} /> },
    { front: <ProjectsPage page={3} />, back: <FocusTerminal active={pageIndex === SECTION_PAGE.contact} playSound={playQuill} /> },
    { front: <ContactRight />, back: <GuestBookLeft /> },
    { front: <GuestBookRight onClose={() => handleClose()} onContentChange={setGuestbookHasContent} />, back: <InnerCover right={true} /> },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [pageIndex, playClick, playQuill, setGuestbookHasContent]);

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Book's intrinsic size at scale=1
      const BOOK_W = 800; // 400px * 2 (spread = two pages side-by-side visually)
      const BOOK_H = 600; // 600px height

      // The open spread is centred on screen (see SPREAD_SHIFT). Each half of
      // the viewport holds one page, the page-edge tabs (30px) and the
      // cover board, plus a little breathing room.
      const BESIDE_PAGE = 30 + 14;
      const PAD_TOP    = 30;
      const PAD_BOTTOM = 90;  // ribbon tail + nav hint below the book

      const scaleW = (vw / 2 - 24) / (BOOK_W / 2 + BESIDE_PAGE);
      const scaleH = (vh - PAD_TOP - PAD_BOTTOM) / BOOK_H;

      // Never exceed 1.2 so the book doesn't become grotesquely large on big monitors,
      // and never go below 0.4 so it stays legible on very small windows.
      const computed = Math.min(scaleW, scaleH, 1.2);
      const clamped  = Math.max(computed, 0.4);

      scaleRef.current = clamped;
      // GSAP owns the book's transform (rotations, float, x-shift), so scale
      // goes through GSAP too — a React style string would wipe the others.
      const reading = bookStateRef.current === 'reading';
      gsap.set(bookRef.current, { scale: clamped, x: reading ? SPREAD_SHIFT * clamped : 0 });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse for 3D parallax when closed
  useGSAP(() => {
    if (bookState !== 'closed' || prefersReducedMotion()) {
      gsap.to(containerRef.current, { rotateX: 0, rotateY: 0, duration: D(0.5), ease: "power2.out" });
      return;
    }
    
    const xTo = gsap.quickTo(containerRef.current, "rotateY", { ease: "power2.out", duration: 0.6 });
    const yTo = gsap.quickTo(containerRef.current, "rotateX", { ease: "power2.out", duration: 0.6 });
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      xTo(x * 12);
      yTo(-y * 12);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [bookState]);

  useGSAP(() => {
    if (bookState === 'closed') {
      gsap.to(bookRef.current, {
        rotateX: 12,
        rotateY: -20,
        y: -15,
        duration: D(3),
        yoyo: !prefersReducedMotion(),
        repeat: prefersReducedMotion() ? 0 : -1,
        ease: "sine.inOut",
        overwrite: "auto"
      });
      
      const total = leafRefs.current.length;
      leafRefs.current.forEach((leaf, i) => {
        gsap.set(leaf, { rotateY: 0, zIndex: (total - i) + total, z: (total - i) * (26 / total) - 13 });
        // Restore pointer-events on all faces — updateFace only runs during reading state,
        // so faces that were flipped during reading still have pointer-events:none after close.
        const frontEl = leaf.querySelector<HTMLElement>('[data-leaf-front]');
        const backEl  = leaf.querySelector<HTMLElement>('[data-leaf-back]');
        if (frontEl) frontEl.style.pointerEvents = 'auto';
        if (backEl)  backEl.style.pointerEvents  = 'none';
      });
    }
  }, [bookState]);

  useGSAP(() => {
    if (bookState !== 'reading') return;
    const total = leafRefs.current.length;

    onPageTurn?.();
    const q = (i: number, sel: string) => leafRefs.current[i]?.querySelector<HTMLElement>(sel) ?? null;

    leafRefs.current.forEach((leaf, i) => {
      const frontEl    = leaf.querySelector<HTMLElement>('[data-leaf-front]');
      const backEl     = leaf.querySelector<HTMLElement>('[data-leaf-back]');
      const frontShade = q(i, '[data-leaf-front] > [data-leaf-shade]');
      const backShade  = q(i, '[data-leaf-back] > [data-leaf-shade]');
      // Pages this leaf passes over while turning
      const castRight  = q(i + 1, '[data-leaf-front] > [data-leaf-cast]');
      const castLeft   = q(i - 1, '[data-leaf-back] > [data-leaf-cast]');
      const owner = String(i);
      const setCast = (el: HTMLElement | null, bg: string) => {
        if (!el) return;
        if (bg === 'none') { if (el.dataset.owner === owner) { el.style.background = 'none'; delete el.dataset.owner; } }
        else { el.style.background = bg; el.dataset.owner = owner; }
      };

      const updateFace = () => {
        const ry = gsap.getProperty(leaf, 'rotateY') as number;

        // Pointer-events follow actual live rotateY — not React state.
        // Front visible when facing viewer (ry > -90), back visible when flipped past spine.
        if (frontEl) frontEl.style.pointerEvents = ry > -90 ? 'auto' : 'none';
        if (backEl)  backEl.style.pointerEvents  = ry < -90 ? 'auto' : 'none';

        // ── Paper shading while turning ──
        // a = 0 lying on the right, 90 upright, 175 lying on the left.
        const a = Math.min(180, Math.max(0, -ry));
        const turning = a > 0.5 && a < 174.5;
        if (!turning) {
          if (frontShade) frontShade.style.background = 'none';
          if (backShade)  backShade.style.background  = 'none';
          setCast(castRight, 'none');
          setCast(castLeft, 'none');
          return;
        }
        const rad = (deg: number) => (deg * Math.PI) / 180;
        // Lifting face: darker at the spine as it rises, a sheen across the
        // bend, and the far edge falling into shade as it goes upright.
        const shade = (t: number, dir: 'right' | 'left') =>
          `linear-gradient(to ${dir}, rgba(25,12,0,${(0.08 + 0.28 * t).toFixed(3)}) 0%, rgba(25,12,0,${(0.03 * t).toFixed(3)}) 24%, rgba(255,244,214,${(0.22 * Math.sin(Math.PI * t)).toFixed(3)}) 58%, rgba(25,12,0,${(0.4 * t * t).toFixed(3)}) 100%)`;
        // Shadow the lifted page throws on the page beneath it: covers the
        // projected width of the leaf and fades as the leaf stands up.
        const cast = (deg: number, dir: 'right' | 'left') => {
          const w = 400 * Math.cos(rad(deg));
          const k = 0.34 * Math.sin(rad(deg)) * Math.min(1, w / 120 + 0.25);
          return `linear-gradient(to ${dir}, rgba(10,5,0,${k.toFixed(3)}) 0px, rgba(10,5,0,${(k * 0.75).toFixed(3)}) ${Math.max(0, w - 34).toFixed(0)}px, transparent ${(w + 28).toFixed(0)}px)`;
        };
        if (a <= 90) {
          if (frontShade) frontShade.style.background = shade(a / 90, 'right');
          if (backShade)  backShade.style.background  = 'none';
          setCast(castRight, cast(a, 'right'));
          setCast(castLeft, 'none');
        } else {
          // Back faces have the spine on their local right
          if (backShade)  backShade.style.background  = shade((180 - a) / 90, 'left');
          if (frontShade) frontShade.style.background = 'none';
          setCast(castLeft, cast(180 - a, 'left'));
          setCast(castRight, 'none');
        }
      };

      // Always call immediately — GSAP skips onUpdate/onComplete for no-op tweens
      // (leaves already at their target), so we must initialise the state now.
      updateFace();

      const flipped = i < pageIndex;
      const target = flipped ? -175 : 0;
      const zTarget = flipped ? i * (26 / total) - 13 : (total - i) * (26 / total) - 13;

      gsap.to(leaf, {
        rotateY: target,
        duration: D(0.9),
        ease: 'power3.inOut', // slow lift, quick fall, soft landing
        zIndex: flipped ? i : (total - i) + total,
        z: zTarget,
        onUpdate: updateFace,
        onComplete: updateFace,
      });
    });
  }, [pageIndex, bookState]);

  const handleOpen = () => {
    if (bookState !== 'closed') return;
    setBookState('opening');
    onStateChange('opening');
    startTheme();
    playMulti();
    
    gsap.killTweensOf(bookRef.current);
    const total = leafRefs.current.length;
    
    // Snap all leaves flat
    setPageIndex(0);
    leafRefs.current.forEach((leaf, i) => {
      gsap.set(leaf, { rotateY: 0, zIndex: (total - i) + total, z: (total - i) * (26 / total) - 13 });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setBookState('reading');
        onStateChange('reading');
        // Contents | Title spread, unless a jump asked for a section
        setPageIndex(openTargetRef.current ?? CONTENTS_PAGE);
        openTargetRef.current = null;
      }
    });

    // Animate book flat to the center
    tl.to(bookRef.current, { rotateX: 0, rotateY: 0, y: 0, x: SPREAD_SHIFT * scaleRef.current, duration: 1, ease: "power2.inOut" }, 0)
      .to(bookRef.current, { scale: scaleRef.current * 1.04, duration: 0.5, ease: 'sine.out' }, 0.3)
      .to(bookRef.current, { scale: scaleRef.current, duration: 0.4, ease: 'sine.inOut' }, 0.9);
    if (prefersReducedMotion()) tl.timeScale(50);
      
    // Gently flip open the cover and flyleaves
    const leavesToFlip = [leafRefs.current[0], leafRefs.current[1], leafRefs.current[2]];
    leavesToFlip.forEach((leaf, i) => {
      tl.to(leaf, { 
        rotateY: -175, 
        duration: 0.7, 
        ease: "power2.inOut",
        zIndex: i,
        z: i * (26 / total) - 13
      }, 0.5 + i * 0.15); // stagger opening
    });
    
    // Gently fan remaining pages as it settles.
    // The two phases must not overlap for any page: when they did, the last
    // page's "lift" finished after its "settle" and it stayed tilted, poking
    // through every page above it (a visible tear on the right-hand page).
    // Lift top-down and settle bottom-up so a lower page is never tilted
    // further than the pages resting on it.
    const pages = leafRefs.current.slice(3);
    const FAN_AT = 0.8, FAN_STEP = 0.03, FAN_DUR = 0.3;
    const settleAt = FAN_AT + FAN_STEP * (pages.length - 1) + FAN_DUR;
    tl.to(pages, { rotateY: -10, duration: FAN_DUR, stagger: FAN_STEP, ease: "power1.out" }, FAN_AT)
      .to(pages, { rotateY: 0, duration: FAN_DUR, stagger: { each: FAN_STEP, from: 'end' }, ease: "power1.in" }, settleAt);
  };

  const handleClose = () => {
    if (bookState !== 'reading') return;
    jumpTimersRef.current.forEach(clearTimeout);
    jumpTimersRef.current = [];
    setGuestbookHasContent(false);
    setBookState('closing');
    onStateChange('closing');
    playMulti();
    
    const total = leafRefs.current.length;
    
    const tl = gsap.timeline({
      onComplete: () => {
        setPageIndex(0);
        setBookState('closed');
        onStateChange('closed');
        
        // Start floating animation again
        if (prefersReducedMotion()) return;
        gsap.to(bookRef.current, {
          rotateX: 12,
          rotateY: -20,
          y: -15,
          duration: 3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          overwrite: "auto"
        });
      }
    });

    // Flip all currently opened pages back to 0
    const openedLeaves = [];
    const maxOpened = Math.min(pageIndex, total);
    for (let i = 0; i < maxOpened; i++) {
      openedLeaves.push(leafRefs.current[i]);
    }
    
    // Reverse so the top-most left page flips first
    openedLeaves.reverse().forEach((leaf, i) => {
      const originalIndex = pageIndex - 1 - i;
      tl.to(leaf, { 
        rotateY: 0, 
        duration: 0.6, 
        ease: 'power2.inOut', 
        zIndex: (total - originalIndex) + total,
        z: (total - originalIndex) * (26 / total) - 13
      }, i * 0.15);
    });

    // Close the book cover 3D angle
    const coverCloseTime = openedLeaves.length * 0.15 + 0.3;
    tl.to(bookRef.current, { rotateX: 12, rotateY: -20, y: -15, x: 0, duration: 1.2, ease: "power2.inOut" }, coverCloseTime);
    if (prefersReducedMotion()) tl.timeScale(50);
  };

  const turnNext = () => {
    if (bookState !== 'reading') return;
    // pageIndex is the leaf about to flip — pass it for weight tier
    playTurnWeighted(pageIndex);
    if (pageIndex < leavesContent.length) {
      setPageIndex(p => p + 1);
    } else if (pageIndex === leavesContent.length) {
      handleClose();
    }
  };

  const turnPrev = () => {
    if (bookState !== 'reading') return;
    // leaf returning is pageIndex - 1
    playTurnWeighted(Math.max(0, pageIndex - 1));
    if (pageIndex > CONTENTS_PAGE) {
      setPageIndex(p => p - 1);
    } else if (pageIndex === CONTENTS_PAGE) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (bookState !== 'reading') return;
      // Don't hijack arrow keys when the user is typing in an input or textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === ' ') turnNext();
      if (e.key === 'ArrowLeft') turnPrev();
      if (e.key === 'Escape') handleClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookState, pageIndex]);

  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const end = e.changedTouches[0].clientX;
    if (touchStart.current - end > 50) turnNext();
    if (end - touchStart.current > 50) turnPrev();
  };

  // Fore-edges of the page block beside the open spread: thinner on the
  // side you came from, thicker on the side still to read.
  const stackRight = 1.5 + Math.max(0, leavesContent.length - pageIndex) * 0.9;
  const stackLeft  = 1.5 + Math.max(0, pageIndex - 1) * 0.9;
  const showStacks = bookState === 'reading';

  // Section catalogue
  const activeSection = CATALOGUE.reduce((best, entry) =>
    pageIndex >= entry.index ? entry : best, CATALOGUE[0]);
  const beforeSections = pageIndex < CATALOGUE[0].index;

  // Ref to cancel any in-progress jump sequence (declared at top of component)

  const jumpTo = (target: number) => {
    if (bookState === 'closed') {
      // Open the book; the opening timeline lands on the target section
      // when it finishes (see openTargetRef in handleOpen).
      openTargetRef.current = target;
      handleOpen();
      return;
    }
    if (bookState !== 'reading') return;

    // Cancel any ongoing jump sequence
    jumpTimersRef.current.forEach(clearTimeout);
    jumpTimersRef.current = [];

    const distance = Math.abs(target - pageIndex);

    if (distance === 0) return;

    if (distance === 1) {
      // Single page flip — use the weighted turn sound
      playTurnWeighted(pageIndex);
        setPageIndex(target);
      return;
    }

    // Multi-page jump: step through every page between current and target
    // Per-step delay: 180ms at 2 hops, compresses to 120ms for 5+ hops
    const PER_STEP_MS = prefersReducedMotion() ? 0 : Math.max(120, Math.round(200 - (distance - 2) * 16));
    const direction = target > pageIndex ? 1 : -1;

    // Build the sequence of intermediate page indices to visit
    const steps: number[] = [];
    for (let i = pageIndex + direction; i !== target; i += direction) {
      steps.push(i);
    }
    steps.push(target); // include the destination

    // Play multi sound once immediately for the whole sequence
    playMulti();

    steps.forEach((stepIndex, i) => {
      const t = setTimeout(() => {
        setPageIndex(stepIndex);
        if (i > 0) playTurnWeighted(stepIndex);
      }, i * PER_STEP_MS);
      jumpTimersRef.current.push(t);
    });
  };

  useEffect(() => { jumpRef.current = jumpTo; });

  // ── Deep links: #projects, #contact … ─────────────────────────────
  // Opening grimoire.dev/#projects opens the book at that section once the
  // loader is gone; reading updates the hash so the URL is always shareable.
  const activeId = activeSection.id;
  useEffect(() => {
    if (!ready) return;
    const go = () => {
      const id = window.location.hash.slice(1);
      if (isSection(id)) jumpRef.current(SECTION_PAGE[id]);
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, [ready]);
  const hasReadRef = useRef(false);
  useEffect(() => {
    if (bookState === 'reading') hasReadRef.current = true;
    // Before the visitor has opened the book, leave an incoming #hash alone
    // so the deep-link effect above can use it.
    if (!hasReadRef.current || (bookState !== 'reading' && bookState !== 'closed')) return;
    const hash = bookState === 'reading' && pageIndex >= SECTION_PAGE.origin ? `#${activeId}` : '';
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash || window.location.pathname + window.location.search);
    }
  }, [bookState, pageIndex, activeId]);

  // ── Page interactivity gating ─────────────────────────────────────
  // The HTML `inert` attribute is the only reliable way to block ALL interaction
  // (pointer events, keyboard focus, tab order) on a subtree — even when child
  // elements have their own React event handlers, canvas listeners, or CSS
  // pointer-events rules. CSS pointer-events:none on a parent does NOT cascade
  // to children that explicitly set pointer-events:auto (e.g. inputs, canvases).
  //
  // Visible spread at pageIndex P:
  //   Left  page = back  of leaf (P - 1)
  //   Right page = front of leaf (P)
  //
  // We gate at the individual face level (front/back divs) so that the leaf
  // container itself stays interactive for GSAP and click-to-open.
  useEffect(() => {
    if (bookState !== 'reading') {
      // When not reading, remove inert from everything so GSAP and open-click work
      leafRefs.current.forEach(leaf => {
        if (!leaf) return;
        const front = leaf.querySelector<HTMLElement>('[data-leaf-front]');
        const back  = leaf.querySelector<HTMLElement>('[data-leaf-back]');
        front?.removeAttribute('inert');
        back?.removeAttribute('inert');
      });
      return;
    }

    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const front = leaf.querySelector<HTMLElement>('[data-leaf-front]');
      const back  = leaf.querySelector<HTMLElement>('[data-leaf-back]');

      // Front face is the right page when its leaf index === pageIndex
      if (front) {
        if (i === pageIndex) front.removeAttribute('inert');
        else                 front.setAttribute('inert', '');
      }
      // Back face is the left page when its leaf index === pageIndex - 1
      if (back) {
        if (i === pageIndex - 1) back.removeAttribute('inert');
        else                     back.setAttribute('inert', '');
      }
    });
  }, [bookState, pageIndex]);
  return (
    <div
      ref={containerRef}
      className="book-interactive relative flex items-center justify-center w-full h-full perspective-2000 preserve-3d"
      // The container and book wrapper share the 3-D rendering context with the
      // leaves and sit at z = 0. Leaves further into the stack have a negative
      // translateZ (page thickness), so without this the wrappers' own boxes
      // sit *in front* of those pages and swallow every click, scroll and pen
      // stroke from the Experience spread onward. Only the leaves take input.
      style={{ pointerEvents: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={bookRef}
        className="relative preserve-3d"
        style={{ width: '400px', height: '600px', pointerEvents: 'none' }}
      >
        {/* Spine and the edges of the page block. They sit a hair inside the
            boards and never share an edge with a leaf or cover: planes meeting
            exactly on an edge made the browser's 3D sort paint them over the
            closed cover (showing as parchment bands down the spine side). */}
        <div
          className="absolute top-0 bottom-0 book-spine"
          style={{ left: '-14.5px', width: '26px', transform: 'rotateY(-90deg)' }}
        />
        <div
          className="absolute top-2 bottom-2 book-pageblock"
          style={{ right: '-12.5px', width: '22px', transform: 'rotateY(90deg)' }}
        />
        <div
          className="absolute left-1 right-1 book-pageblock-top"
          style={{ top: '-12.5px', height: '22px', transform: 'rotateX(90deg)' }}
        />
        <div
          className="absolute left-1 right-1 book-pageblock-bottom"
          style={{ bottom: '-12.5px', height: '22px', transform: 'rotateX(-90deg)' }}
        />

        {/* Surface shadow: the open book rests on something */}
        <div
          aria-hidden
          className="book-surface-shadow absolute transition-opacity duration-700"
          style={{
            left: -440, right: -40, top: -8, bottom: -30,
            transform: 'translateZ(-40px)',
            background: 'radial-gradient(ellipse 50% 48% at 50% 54%, rgba(0,0,0,.8), rgba(0,0,0,.4) 55%, transparent 75%)',
            filter: 'blur(16px)',
            opacity: bookState === 'reading' ? 1 : 0,
          }}
        />

        {/* Back Cover */}
        <div
          className="absolute top-0 left-0 w-full h-full preserve-3d"
          style={{ transform: 'translateZ(-13px)' }}
        >
          <div className="absolute inset-0 backface-hidden isolate">
            <div className="absolute inset-0 overflow-hidden"><InnerCover /></div>
            {/* Flat and furthest back, so it needs a touch more overhang to
                match the tilted left board */}
            <div className="board-edge board-edge-right" style={{ top: -11, bottom: -11, right: -13 }} aria-hidden />
            <div aria-hidden className="page-stack" style={{ left: 400, width: stackRight, opacity: showStacks ? 1 : 0 }} />
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 isolate">
            <div className="absolute inset-0 overflow-hidden rounded-[2px_8px_8px_2px]"><CoverBack /></div>
            <div className="board-edge board-edge-left" aria-hidden />
          </div>
        </div>

        {/* Headbands at the head and tail of the spine */}
        <div aria-hidden className="headband" style={{ top: -6, transform: 'translateZ(-6px)', opacity: bookState === 'reading' ? 1 : 0 }} />
        <div aria-hidden className="headband" style={{ bottom: -6, transform: 'translateZ(-6px)', opacity: bookState === 'reading' ? 1 : 0 }} />

        {/* Leaves */}
        {leavesContent.map((leaf, index) => {
          const total = leavesContent.length;
          const initialZIndex = (total - index) + total;
          const initialZ = (total - index) * (26 / total) - 13;
          return (
          <div
            key={index}
            ref={(el) => { if (el) leafRefs.current[index] = el; }}
            className="absolute top-0 left-0 w-full h-full preserve-3d origin-left cursor-pointer"
            style={{
              zIndex: initialZIndex,
              transform: `translateZ(${initialZ}px)`,
              pointerEvents: 'auto',
              ...(index === 0 && { top: -BOARD_Y, height: 600 + 2 * BOARD_Y, width: 400 + BOARD_X }),
            }}
            onMouseEnter={() => { if (bookState === 'closed') pushCursor('lock'); }}
            onMouseLeave={() => { if (bookState === 'closed') popCursor(); }}
            onClick={() => {
               if (bookState === 'closed') handleOpen();
            }}
          >
            {/* Front — pointer-events toggled live by GSAP updateFace callback.
                While closed, inner pages aren't drawn: they're hidden behind the
                cover anyway, and with the spine/page-edge planes present the
                browser's 3D sort painted them over the cover. */}
            <div className="absolute inset-0 backface-hidden flex isolate" data-leaf-front
              style={{ visibility: bookState === 'closed' && index > 0 ? 'hidden' : undefined }}>
              {leaf.front}
              {isPaperFace(index, 'front', total) && <PaperLayers leaf={index} side="front" />}
              {bookState === 'reading' && index >= CONTENTS_PAGE && index !== GUESTBOOK_PAGE && (
                <PageCorner side="right" onTurn={turnNext} onHover={() => pushCursor('point')} onLeave={() => popCursor()} />
              )}
            </div>

            {/* Back — pointer-events toggled live by GSAP updateFace callback */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex isolate" data-leaf-back
              style={{ visibility: bookState === 'closed' && index > 0 ? 'hidden' : undefined }}>
              {leaf.back}
              {index === 0 && (
                // Fore-edge of the pages already read, resting on the board
                <div aria-hidden className="page-stack"
                  style={{ left: BOARD_X - stackLeft, width: stackLeft, top: BOARD_Y + 3, bottom: BOARD_Y + 3, opacity: showStacks ? 1 : 0, zIndex: 1 }} />
              )}
              {isPaperFace(index, 'back', total) && <PaperLayers leaf={index} side="back" />}
              {bookState === 'reading' && index >= CONTENTS_PAGE - 1 && (
                <PageCorner side="left" onTurn={turnPrev} onHover={() => pushCursor('point')} onLeave={() => popCursor()} />
              )}
            </div>

            {/* Section tab glued to this leaf's fore-edge: it sticks out on the
                right until you pass it, then out of the left like a real book */}
            {TAB_BY_LEAF[index] && (() => {
              const entry = TAB_BY_LEAF[index]!;
              const k = CATALOGUE.indexOf(entry);
              const current = !beforeSections && activeSection.id === entry.id && bookState === 'reading';
              return (['front', 'back'] as const).map(face => (
                <button
                  key={face}
                  type="button"
                  className={`leaf-tab leaf-tab-${face} backface-hidden`}
                  style={{ top: TAB_TOP + k * TAB_STEP, height: TAB_H }}
                  aria-label={`Go to ${entry.label}`}
                  aria-current={current ? 'page' : undefined}
                  title={entry.label}
                  onClick={(e) => { e.stopPropagation(); playClick(); jumpTo(entry.index); }}
                  onMouseEnter={() => pushCursor('rune')}
                  onMouseLeave={() => popCursor()}
                >
                  <span className="font-cinzel text-[12px] leading-none">{entry.rune}</span>
                  <span className="leaf-tab-label">{entry.label}</span>
                </button>
              ));
            })()}
          </div>
          );
        })}

        {/* Ribbon bookmark lying in the gutter: pull it to close the book */}
        <button
          type="button"
          aria-label="Close the book"
          title="Close the book"
          className="ribbon-btn absolute group transition-opacity duration-500"
          style={{
            left: 2, width: 14, top: -18, height: 600 + 18 + 46,
            transform: 'translateZ(7px) rotateZ(-0.6deg)',
            transformOrigin: 'top center',
            opacity: bookState === 'reading' ? 1 : 0,
            pointerEvents: bookState === 'reading' ? 'auto' : 'none',
          }}
          onMouseEnter={() => pushCursor('point')}
          onMouseLeave={() => popCursor()}
          onClick={() => {
            playClick();
            // If the guestbook page is open and has unsaved content, confirm first
            if (guestbookHasContent && pageIndex === GUESTBOOK_PAGE) setCloseConfirmOpen(true);
            else handleClose();
          }}
        >
          <span className="ribbon" aria-hidden />
          <span aria-hidden className="absolute bottom-1 left-5 whitespace-nowrap font-caveat text-[15px] text-[#d4c5a0] opacity-0 group-hover:opacity-90 group-focus-visible:opacity-90 transition-opacity">
            close the book
          </span>
        </button>
      </div>

      {/* Confirm-close modal — shown when closing with unsaved guestbook content */}
      <GrimoireModal
        open={closeConfirmOpen}
        variant="confirm"
        rune="ᛉ"
        title="Abandon your words?"
        message="Your message has not been sent. Close the grimoire and let it fade to nothing?"
        confirmLabel="Close anyway"
        cancelLabel="Stay a while"
        onConfirm={() => {
          setCloseConfirmOpen(false);
          setGuestbookHasContent(false);
          handleClose();
        }}
        onCancel={() => setCloseConfirmOpen(false)}
      />

    </div>
  );
}
