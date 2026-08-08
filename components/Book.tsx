'use client';
import { useRef, useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CoverFront, InnerCover, CoverBack, TitlePage, OriginLeft, OriginTerminal, ExperienceLeft, ExperienceRight, ToolsLeft, ToolsRight, ProjectsLeft, ProjectsRight, FocusTerminal, ContactRight, GuestBookLeft, GuestBookRight } from './PageContents';
import GrimoireModal from './GrimoireModal';
import { useCursor } from '@/context/CursorContext';

// ── Static data outside component — never recreated ──────────────────
const CATALOGUE = [
  { label: 'Origin',     rune: 'ᚩ', index: 3 },
  { label: 'Experience', rune: 'ᛖ', index: 5 },
  { label: 'Tools',      rune: 'ᛏ', index: 6 },
  { label: 'Projects',   rune: 'ᛈ', index: 7 },
  { label: 'Contact',    rune: 'ᛗ', index: 8 },
  { label: 'Guestbook',  rune: 'ᛟ', index: 9 },
];

export default function Book({ isActive, onStateChange, playTurnWeighted, playClick, playMulti, playQuill, startTheme, onPageTurn }: {
  isActive: boolean;
  onStateChange: (state: 'closed' | 'opening' | 'reading' | 'closing') => void;
  playTurnWeighted: (leafIndex: number) => void;
  playClick: () => void;
  playMulti: () => void;
  playQuill: () => void;
  startTheme: () => void;
  onPageTurn?: () => void;
}) {
  const [bookState, setBookState] = useState<'closed' | 'opening' | 'reading' | 'closing'>('closed');
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
  const bookmarkRef = useRef<HTMLDivElement>(null);
  // Jump-sequence timers — cancelled on close or new jump
  const jumpTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const leavesContent = useMemo(() => [
    { front: <CoverFront onOpen={() => { playClick(); handleOpen(); }} />, back: <InnerCover /> },
    { front: <div className="w-full h-full bg-parchment-right" />, back: <div className="w-full h-full bg-parchment-left shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)]" /> },
    { front: <div className="w-full h-full bg-parchment-right shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)]" />, back: <div className="w-full h-full bg-parchment-left shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)]" /> },
    { front: <TitlePage />, back: <OriginLeft /> },
    { front: <OriginTerminal active={pageIndex === 4} playSound={playQuill} />, back: <ExperienceLeft /> },
    { front: <ExperienceRight />, back: <ToolsLeft /> },
    { front: <ToolsRight />, back: <ProjectsLeft /> },
    { front: <ProjectsRight />, back: <FocusTerminal active={pageIndex === 8} playSound={playQuill} /> },
    { front: <ContactRight />, back: <GuestBookLeft /> },
    { front: <GuestBookRight onClose={() => handleClose()} onContentChange={setGuestbookHasContent} />, back: <InnerCover right={true} /> },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [pageIndex, playClick, playQuill, setGuestbookHasContent]);

  useEffect(() => {
    const handleResize = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const dpr = window.devicePixelRatio ?? 1;

      // devicePixelRatio tells us if Windows/OS display scaling is active.
      // A 1920×1080 monitor at 125% Windows scale → CSS viewport ~1536×864, DPR 1.25
      // A genuine 1536×864 laptop screen at 100%     → CSS viewport ~1536×864, DPR 1.0
      // A 4K monitor at 200%                         → CSS viewport ~1920×1080, DPR 2.0
      // We use DPR to recover the physical intent and set padding accordingly.

      // Physical pixel height estimate
      const physH = wh * dpr;

      // Vertical padding: more on physically small/dense screens (laptops),
      // less on large monitors where the book can breathe naturally.
      const vPad = physH >= 1600 ? 120   // 4K / large HiDPI — generous
                 : physH >= 1200 ? 100   // 1080p HiDPI or 1440p — comfortable
                 :                  70;  // 720p / compact

      // Horizontal padding accounts for catalogue tabs (~120px) + margin
      const hPad = 180;

      const scaleW = (ww - hPad) / 840;
      const scaleH = (wh - vPad) / 640;

      // On a genuine large monitor (wide CSS viewport, low DPR) allow up to 1.2.
      // On a scaled laptop (narrower CSS viewport, DPR > 1) cap lower so it doesn't crowd.
      const maxScale = dpr <= 1 && ww >= 1400 ? 1.2   // large monitor at 100%
                     : dpr <= 1              ? 1.0   // smaller monitor at 100%
                     : wh >= 900             ? 1.0   // scaled but tall enough
                     :                        0.88;  // scaled and short — laptop

      setScale(Math.min(scaleW, scaleH, maxScale));
      scaleRef.current = Math.min(scaleW, scaleH, maxScale);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse for 3D parallax when closed
  useGSAP(() => {
    if (bookState !== 'closed') {
      gsap.to(containerRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
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
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        overwrite: "auto"
      });
      
      const total = leafRefs.current.length;
      leafRefs.current.forEach((leaf, i) => {
        gsap.set(leaf, { rotateY: 0, zIndex: (total - i) + total, z: (total - i) * (26 / total) - 13 });
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
          duration: 0.85,
          ease: 'power2.inOut',
          zIndex: i,
          z: i * (26 / total) - 13,
          onUpdate: updateFace,
          onComplete: updateFace,
        });
      } else {
        gsap.to(leaf, {
          rotateY: 0,
          duration: 0.85,
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
        setPageIndex(3); // Land on TitlePage
      }
    });

    // Animate book flat to the center
    tl.to(bookRef.current, { rotateX: 0, rotateY: 0, y: 0, duration: 1, ease: "power2.inOut" }, 0)
      .to(bookRef.current, { scale: scaleRef.current * 1.04, duration: 0.5, ease: 'sine.out' }, 0.3)
      .to(bookRef.current, { scale: scaleRef.current, duration: 0.4, ease: 'sine.inOut' }, 0.9);
      
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
    
    // Gently fan remaining pages as it settles
    const pages = leafRefs.current.slice(3);
    tl.to(pages, { rotateY: -10, duration: 0.4, stagger: 0.05, ease: "power1.out" }, 0.8)
      .to(pages, { rotateY: 0, duration: 0.3, stagger: -0.05, ease: "power1.in" }, 1.2);
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
    tl.to(bookRef.current, { rotateX: 12, rotateY: -20, y: -15, duration: 1.2, ease: "power2.inOut" }, coverCloseTime);
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
    if (pageIndex > 3) {
      setPageIndex(p => p - 1);
    } else if (pageIndex === 3) {
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

  // Ref to cancel any in-progress jump sequence (declared at top of component)

  const jumpTo = (target: number) => {
    if (bookState === 'closed') {
      // Open the book, then jump directly to the target section once settled.
      // The open animation takes ~1.4s; we wait 1.6s to be safe.
      handleOpen();
      const t = setTimeout(() => setPageIndex(target), 1600);
      jumpTimersRef.current.push(t);
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
    const PER_STEP_MS = Math.max(120, Math.round(200 - (distance - 2) * 16));
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

  // Bookmark ribbon sway — gentle cloth-settling idle when reading
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={bookRef}
        className="relative preserve-3d transition-transform duration-300"
        style={{ width: '400px', height: '600px', transform: `scale(${scale})` }}
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
            }}
            onMouseEnter={() => { if (bookState === 'closed') pushCursor('lock'); }}
            onMouseLeave={() => { if (bookState === 'closed') popCursor(); }}
            onClick={() => {
               if (bookState === 'closed') handleOpen();
            }}
          >
            {/* Front — pointer-events toggled live by GSAP updateFace callback */}
            <div className="absolute inset-0 backface-hidden flex" data-leaf-front>
              {leaf.front}
              <div
                data-leaf-shadow
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'none' }}
              />
            </div>

            {/* Back — pointer-events toggled live by GSAP updateFace callback */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex" data-leaf-back>
              {leaf.back}
            </div>
          </div>
          );
        })}


      </div>

      {/* Bookmark Close Button */}
      <div 
        ref={bookmarkRef}
        className={`absolute right-16 w-8 bg-[#a31a1a] shadow-lg z-40 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center pt-2 transition-all duration-700 ease-in-out
          ${bookState === 'reading' ? 'top-0 h-32 translate-y-0 opacity-100' : '-top-10 h-0 opacity-0 pointer-events-none'}`}
        onMouseEnter={() => pushCursor('point')}
        onMouseLeave={() => popCursor()}
        onClick={() => {
          playClick();
          // If the guestbook page is open and has unsaved content, confirm first
          if (guestbookHasContent && pageIndex === 9) {
            setCloseConfirmOpen(true);
          } else {
            handleClose();
          }
        }}
        title="Close Grimoire"
      >
        <div className="w-4 h-4 rounded-full border border-[#ffae00]/40 flex items-center justify-center text-[10px] text-[#ffae00] mb-1">✕</div>
        <div className="w-[1px] h-12 bg-black/20" />
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

      {/* Side Catalogue — vertical index tabs */}
      <div
        className="absolute flex flex-col gap-1 z-50 transition-all duration-700 ease-in-out"
        style={{
          left: `calc(50% + ${210 * scale}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: bookState === 'reading' ? 1 : 0,
          pointerEvents: bookState === 'reading' ? 'auto' : 'none',
        }}
      >
        {CATALOGUE.map((entry) => {
          const isActive = activeSection.index === entry.index;
          return (
            <button
              key={entry.label}
              onClick={() => jumpTo(entry.index)}
              title={entry.label}
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

      {/* Navigation hint */}
      <div
        className="absolute z-40 flex items-center gap-3 pointer-events-none transition-all duration-700"
        style={{
          top: `calc(50% + ${Math.min(310 * scale, 270)}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: bookState === 'reading' ? 0.55 : 0,
        }}
      >
        <span className="font-cinzel text-[#d4c5a0] text-[10px] tracking-widest">← prev</span>
        <span className="text-[#8b6b4e] text-[10px]">·</span>
        <span className="font-kalam text-[#a8b5a8] text-[11px]">arrow keys or swipe to turn pages</span>
        <span className="text-[#8b6b4e] text-[10px]">·</span>
        <span className="font-cinzel text-[#d4c5a0] text-[10px] tracking-widest">next →</span>
      </div>
    </div>
  );
}
