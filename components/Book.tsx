'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CoverFront, InnerCover, CoverBack, TitlePage, OriginLeft, OriginTerminal, ExperienceLeft, ExperienceRight, ToolsLeft, ToolsRight, ProjectsLeft, ProjectsRight, FocusTerminal, ContactRight } from './PageContents';

export default function Book({ isActive, onStateChange, playTurn, playClick, playMulti, startTheme }: {
  isActive: boolean;
  onStateChange: (state: 'closed' | 'opening' | 'reading' | 'closing') => void;
  playTurn: () => void;
  playClick: () => void;
  playMulti: () => void;
  startTheme: () => void;
}) {
  const [bookState, setBookState] = useState<'closed' | 'opening' | 'reading' | 'closing'>('closed');
  const [pageIndex, setPageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<HTMLDivElement[]>([]);

  const leavesContent = [
    { front: <CoverFront onOpen={() => { playClick(); handleOpen(); }} />, back: <InnerCover /> },
    { front: <div className="w-full h-full bg-parchment-right" />, back: <div className="w-full h-full bg-parchment-left shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)]" /> },
    { front: <div className="w-full h-full bg-parchment-right shadow-[inset_10px_0_20px_rgba(0,0,0,0.05)]" />, back: <div className="w-full h-full bg-parchment-left shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05)]" /> },
    { front: <TitlePage />, back: <OriginLeft /> },
    { front: <OriginTerminal active={pageIndex === 4} />, back: <ExperienceLeft /> },
    { front: <ExperienceRight />, back: <ToolsLeft /> },
    { front: <ToolsRight />, back: <ProjectsLeft /> },
    { front: <ProjectsRight />, back: <FocusTerminal active={pageIndex === 8} /> },
    { front: <ContactRight />, back: <InnerCover right={true} /> }
  ];

  useEffect(() => {
    const handleResize = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const scaleW = (ww - 60) / 840;
      const scaleH = (wh - 60) / 640;
      setScale(Math.min(scaleW, scaleH, 1.2));
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
    leafRefs.current.forEach((leaf, i) => {
      if (i < pageIndex) {
        gsap.to(leaf, { rotateY: -175, duration: 0.85, ease: 'power2.inOut', zIndex: i, z: i * (26 / total) - 13 });
      } else {
        gsap.to(leaf, { rotateY: 0, duration: 0.85, ease: 'power2.inOut', zIndex: (total - i) + total, z: (total - i) * (26 / total) - 13 });
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
      .to(bookRef.current, { scale: scale * 1.04, duration: 0.5, ease: 'sine.out' }, 0.3)
      .to(bookRef.current, { scale: scale, duration: 0.4, ease: 'sine.inOut' }, 0.9);
      
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
    playTurn();
    if (pageIndex < leavesContent.length) {
      setPageIndex(p => p + 1);
    } else if (pageIndex === leavesContent.length) {
      handleClose();
    }
  };

  const turnPrev = () => {
    if (bookState !== 'reading') return;
    playTurn();
    if (pageIndex > 3) {
      setPageIndex(p => p - 1);
    } else if (pageIndex === 3) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (bookState !== 'reading') return;
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
  const catalogue = [
    { label: 'Origin',     rune: 'ᚩ', index: 3 },
    { label: 'Experience', rune: 'ᛖ', index: 5 },
    { label: 'Tools',      rune: 'ᛏ', index: 6 },
    { label: 'Projects',   rune: 'ᛈ', index: 7 },
    { label: 'Contact',    rune: 'ᛗ', index: 8 },
  ];
  const activeSection = catalogue.reduce((best, entry) =>
    pageIndex >= entry.index ? entry : best, catalogue[0]);
  const jumpTo = (target: number) => {
    playMulti();
    if (bookState === 'closed') { handleOpen(); setTimeout(() => setPageIndex(target), 1400); }
    else if (bookState === 'reading') setPageIndex(target);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center w-full h-full perspective-2000 preserve-3d"
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
              transform: `translateZ(${initialZ}px)`
            }}
            onClick={() => {
               if (bookState === 'closed') handleOpen();
            }}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden flex">
              {leaf.front}
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex">
              {leaf.back}
            </div>
          </div>
          );
        })}

        {/* Navigation Overlays */}
        {bookState === 'reading' && (
          <>
            <div 
              className="absolute left-0 top-0 w-full h-full z-50 opacity-0 hover:opacity-10 bg-transparent rounded-l-md origin-left pointer-events-none"
              style={{ transform: 'rotateY(-180deg) translateZ(30px)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); turnPrev(); }}
                className="absolute right-0 top-0 w-24 h-full cursor-w-resize pointer-events-auto bg-black/20"
                aria-label="Previous Page"
              />
            </div>
            <div 
              className="absolute right-0 top-0 w-full h-full z-50 opacity-0 hover:opacity-10 bg-transparent rounded-r-md pointer-events-none"
              style={{ transform: 'translateZ(30px)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); turnNext(); }}
                className="absolute right-0 top-0 w-24 h-full cursor-e-resize pointer-events-auto bg-black/20"
                aria-label="Next Page"
              />
            </div>
          </>
        )}
      </div>

      {/* Bookmark Close Button */}
      <div 
        className={`absolute right-16 w-8 bg-[#a31a1a] shadow-lg z-40 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center pt-2 transition-all duration-700 ease-in-out
          ${bookState === 'reading' ? 'top-0 h-32 translate-y-0 opacity-100' : '-top-10 h-0 opacity-0 pointer-events-none'}`}
        onClick={() => { playClick(); handleClose(); }}
        title="Close Grimoire"
      >
        <div className="w-4 h-4 rounded-full border border-[#ffae00]/40 flex items-center justify-center text-[10px] text-[#ffae00] mb-1">✕</div>
        <div className="w-[1px] h-12 bg-black/20" />
      </div>

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
        {catalogue.map((entry) => {
          const isActive = activeSection.index === entry.index;
          return (
            <button
              key={entry.label}
              onClick={() => jumpTo(entry.index)}
              title={entry.label}
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
          top: `calc(50% + ${310 * scale}px)`,
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
