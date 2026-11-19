'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
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

/** Shortens every GSAP duration to (almost) nothing for reduced-motion visitors. */
const D = (seconds: number) => (prefersReducedMotion() ? 0.001 : seconds);

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
  const [scale, setScale] = useState(1);
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
  const bookmarkRef = useRef<HTMLButtonElement>(null);
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

      // The open spread is centred on screen (see SPREAD_SHIFT), so each half
      // of the viewport must hold one page plus, on the right, the catalogue
      // tabs (~120px) and a little breathing room.
      const TABS_W     = 140;
      const PAD_TOP    = 20;
      const PAD_BOTTOM = 60;  // nav hint height (≈36px) + 24px gap

      const scaleW = (vw / 2 - TABS_W) / (BOOK_W / 2 + 10);
      const scaleH = (vh - PAD_TOP - PAD_BOTTOM) / BOOK_H;

      // Never exceed 1.2 so the book doesn't become grotesquely large on big monitors,
      // and never go below 0.4 so it stays legible on very small windows.
      const computed = Math.min(scaleW, scaleH, 1.2);
      const clamped  = Math.max(computed, 0.4);

      setScale(clamped);
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
    leafRefs.current.forEach((leaf, i) => {
      const shadowEl = leaf.querySelector<HTMLElement>('[data-leaf-shadow]');
      const frontEl  = leaf.querySelector<HTMLElement>('[data-leaf-front]');
      const backEl   = leaf.querySelector<HTMLElement>('[data-leaf-back]');

      const updateFace = () => {
        const ry = gsap.getProperty(leaf, 'rotateY') as number;

        // Pointer-events follow actual live rotateY — not React state.
        // Front visible when facing viewer (ry > -90), back visible when flipped past spine.
        if (frontEl) frontEl.style.pointerEvents = ry > -90 ? 'auto' : 'none';
        if (backEl)  backEl.style.pointerEvents  = ry < -90 ? 'auto' : 'none';

        if (!shadowEl) return;
        const absRy    = Math.abs(ry);
        const flatness = Math.max(0, 1 - absRy / 60);
        const blur     = 6 + (1 - flatness) * 12;
        const opacity  = flatness * 0.32;
        shadowEl.style.background = opacity > 0.01
          ? `linear-gradient(to right, rgba(0,0,0,${opacity.toFixed(3)}) 0%, rgba(0,0,0,${(opacity * 0.4).toFixed(3)}) ${blur * 2}px, transparent ${blur * 5}px)`
          : 'none';
      };

      // Always call immediately — GSAP skips onUpdate/onComplete for no-op tweens
      // (leaves already at their target), so we must initialise the state now.
      updateFace();

      if (i < pageIndex) {
        gsap.to(leaf, {
          rotateY: -175,
          duration: D(0.85),
          ease: 'power2.inOut',
          zIndex: i,
          z: i * (26 / total) - 13,
          onUpdate: updateFace,
          onComplete: updateFace,
        });
      } else {
        gsap.to(leaf, {
          rotateY: 0,
          duration: D(0.85),
          ease: 'power2.inOut',
          zIndex: (total - i) + total,
          z: (total - i) * (26 / total) - 13,
          onUpdate: updateFace,
          onComplete: updateFace,
        });
      }
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
  useGSAP(() => {
    const el = bookmarkRef.current;
    if (!el) return;
    if (bookState === 'reading') {
      gsap.to(el, {
        rotateZ: 2,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: 'top center',
        overwrite: 'auto',
      });
    } else {
      gsap.to(el, { rotateZ: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    }
  }, [bookState]);

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
        {/* Spine */}
        <div 
          className="absolute top-0 bottom-0 book-spine"
          style={{ left: '-13px', width: '26px', transform: 'rotateY(-90deg)' }}
        />

        {/* Pageblocks */}
        <div 
          className="absolute top-2 bottom-2 book-pageblock"
          style={{ right: '-13px', width: '26px', transform: 'rotateY(90deg)' }}
        />
        <div 
          className="absolute left-0 right-0 book-pageblock-top" 
          style={{ top: '-13px', height: '26px', transform: 'rotateX(90deg)' }} 
        />
        <div 
          className="absolute left-0 right-0 book-pageblock-bottom" 
          style={{ bottom: '-13px', height: '26px', transform: 'rotateX(-90deg)' }} 
        />

        {/* Center Crease */}
        {bookState === 'reading' && (
          <div 
            className="absolute top-0 left-0 w-12 h-full -translate-x-1/2 bg-gradient-to-r from-black/20 via-black/40 to-black/20 pointer-events-none z-50"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -ml-[0.5px] bg-[#d4c5a0]/40 z-30" />
          </div>
        )}

        {/* Back Cover */}
        <div 
          className="absolute top-0 left-0 w-full h-full preserve-3d shadow-[20px_20px_40px_rgba(0,0,0,0.8)] rounded-[2px_8px_8px_2px]"
          style={{ transform: 'translateZ(-13px)' }}
        >
          <div className="absolute inset-0 backface-hidden rounded-[2px_8px_8px_2px] overflow-hidden">
            <InnerCover />
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2px_8px_8px_2px] overflow-hidden">
            <CoverBack />
          </div>
        </div>

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
            }}
            onMouseEnter={() => { if (bookState === 'closed') pushCursor('lock'); }}
            onMouseLeave={() => { if (bookState === 'closed') popCursor(); }}
            onClick={() => {
               if (bookState === 'closed') handleOpen();
            }}
          >
            {/* Front — pointer-events toggled live by GSAP updateFace callback */}
            <div className="absolute inset-0 backface-hidden flex isolate" data-leaf-front>
              {leaf.front}
              {bookState === 'reading' && index >= CONTENTS_PAGE && index !== GUESTBOOK_PAGE && (
                <PageCorner side="right" onTurn={turnNext} onHover={() => pushCursor('point')} onLeave={() => popCursor()} />
              )}
              <div
                data-leaf-shadow
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'none' }}
              />
            </div>

            {/* Back — pointer-events toggled live by GSAP updateFace callback */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex isolate" data-leaf-back>
              {leaf.back}
              {bookState === 'reading' && index >= CONTENTS_PAGE - 1 && (
                <PageCorner side="left" onTurn={turnPrev} onHover={() => pushCursor('point')} onLeave={() => popCursor()} />
              )}
            </div>
          </div>
          );
        })}


      </div>

      {/* Bookmark Close Button */}
      <button
        type="button"
        aria-label="Close the book"
        ref={bookmarkRef}
        className={`absolute right-16 w-8 bg-[#a31a1a] shadow-lg z-40 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center pt-2 transition-all duration-700 ease-in-out
          ${bookState === 'reading' ? 'top-0 h-32 translate-y-0 opacity-100 pointer-events-auto' : '-top-10 h-0 opacity-0 pointer-events-none'}`}
        onMouseEnter={() => pushCursor('point')}
        onMouseLeave={() => popCursor()}
        onClick={() => {
          playClick();
          // If the guestbook page is open and has unsaved content, confirm first
          if (guestbookHasContent && pageIndex === GUESTBOOK_PAGE) {
            setCloseConfirmOpen(true);
          } else {
            handleClose();
          }
        }}
        title="Close Grimoire"
      >
        <div className="w-4 h-4 rounded-full border border-[#ffae00]/40 flex items-center justify-center text-[10px] text-[#ffae00] mb-1">✕</div>
        <div className="w-[1px] h-12 bg-black/20" />
      </button>

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

      {/* Side Catalogue — vertical index tabs */}
      <div
        className="absolute flex flex-col gap-1 z-50 transition-all duration-700 ease-in-out"
        style={{
          left: `calc(50% + ${(SPREAD_SHIFT + 210) * scale}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: bookState === 'reading' ? 1 : 0,
          pointerEvents: bookState === 'reading' ? 'auto' : 'none',
        }}
      >
        {CATALOGUE.map((entry) => {
          const isActive = !beforeSections && activeSection.index === entry.index;
          return (
            <button
              key={entry.label}
              onClick={() => jumpTo(entry.index)}
              title={entry.label}
              aria-label={`Go to ${entry.label}`}
              aria-current={isActive ? 'page' : undefined}
              onMouseEnter={() => pushCursor('rune')}
              onMouseLeave={() => popCursor()}
              className="group relative flex items-center transition-all duration-300 ease-in-out"
            >
              <div className={`
                flex items-center gap-2 pl-2 pr-3 py-2 border border-r-0
                font-cinzel text-[10px] tracking-widest uppercase shadow-md transition-all duration-300
                ${isActive
                  ? 'bg-[#f4ebd0] border-[#8b6b4e] text-[#a4302a] w-28'
                  : 'bg-[#d4c5a0]/80 border-[#a89060]/60 text-[#5c4d33] translate-x-1 w-24 hover:translate-x-0 hover:w-28 hover:bg-[#eee0c0] hover:text-[#1a0f05]'
                }
              `}>
                <span className={`font-cinzel text-[13px] shrink-0 ${isActive ? 'text-[#a4302a]' : 'text-[#8b6b4e] group-hover:text-[#a4302a]'}`}>
                  {entry.rune}
                </span>
                <span className="truncate">{entry.label}</span>
              </div>
              {isActive && <div className="w-[3px] h-full bg-[#a4302a] absolute right-0 top-0" />}
            </button>
          );
        })}
      </div>

      {/* Navigation hint — sits below the book, always in viewport */}
      <div
        className="absolute z-40 flex items-center gap-3 pointer-events-none transition-all duration-700"
        style={{
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: bookState === 'reading' ? 0.55 : 0,
        }}
      >
        <span className="font-cinzel text-[#d4c5a0] text-[10px] tracking-widest">← prev</span>
        <span className="text-[#8b6b4e] text-[10px]">·</span>
        <span className="font-kalam text-[#a8b5a8] text-[11px]">lift a page corner, use the arrow keys, or swipe</span>
        <span className="text-[#8b6b4e] text-[10px]">·</span>
        <span className="font-cinzel text-[#d4c5a0] text-[10px] tracking-widest">next →</span>
      </div>
    </div>
  );
}
