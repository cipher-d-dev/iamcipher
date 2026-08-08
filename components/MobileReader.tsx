'use client';
import { useState, useRef } from 'react';
import {
  TitlePage, OriginLeft, OriginTerminal,
  ExperienceLeft, ExperienceRight,
  ToolsLeft, ToolsRight,
  ProjectsLeft, ProjectsRight,
  FocusTerminal, ContactRight,
  GuestBookLeft, GuestBookRight,
  InnerCover,
} from './PageContents';

// Flat ordered list of all readable pages for mobile
const PAGES: { label: string; rune: string; node: React.ReactNode }[] = [
  { label: 'Title',       rune: 'ᚨ', node: <TitlePage mobile /> },
  { label: 'Origin',      rune: 'ᚩ', node: <OriginLeft mobile /> },
  { label: 'Origin',      rune: 'ᚩ', node: <OriginTerminal active={true} mobile /> },
  { label: 'Experience',  rune: 'ᛖ', node: <ExperienceLeft mobile /> },
  { label: 'Experience',  rune: 'ᛖ', node: <ExperienceRight mobile /> },
  { label: 'Tools',       rune: 'ᛏ', node: <ToolsLeft mobile /> },
  { label: 'Tools',       rune: 'ᛏ', node: <ToolsRight mobile /> },
  { label: 'Projects',    rune: 'ᛈ', node: <ProjectsLeft mobile /> },
  { label: 'Projects',    rune: 'ᛈ', node: <ProjectsRight mobile /> },
  { label: 'Focus',       rune: 'ᛇ', node: <FocusTerminal active={true} mobile /> },
  { label: 'Contact',     rune: 'ᛗ', node: <ContactRight mobile /> },
  { label: 'Guestbook',   rune: 'ᛟ', node: <GuestBookLeft mobile /> },
  { label: 'Guestbook',   rune: 'ᛟ', node: <GuestBookRight mobile /> },
  { label: 'End',         rune: 'ᛟ', node: <InnerCover right={true} /> },
];

const CATALOGUE = [
  { label: 'Origin',     rune: 'ᚩ', pageIndex: 1 },
  { label: 'Experience', rune: 'ᛖ', pageIndex: 3 },
  { label: 'Tools',      rune: 'ᛏ', pageIndex: 5 },
  { label: 'Projects',   rune: 'ᛈ', pageIndex: 7 },
  { label: 'Contact',    rune: 'ᛗ', pageIndex: 10 },
  { label: 'Guestbook',  rune: 'ᛟ', pageIndex: 11 },
];

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
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'left' | 'right' | null>(null);
  const [animating, setAnimating] = useState(false);
  const touchStart = useRef(0);

  const navigate = (direction: 'next' | 'prev') => {
    if (animating) return;
    if (direction === 'next' && index >= PAGES.length - 1) { playTurn(); onClose(); return; }
    if (direction === 'prev' && index <= 0) { playTurn(); onClose(); return; }

    playTurn();
    setDir(direction === 'next' ? 'left' : 'right');
    setAnimating(true);
    setTimeout(() => {
      setIndex(i => direction === 'next' ? i + 1 : i - 1);
      setDir(null);
      setAnimating(false);
    }, 260);
  };

  const jumpTo = (i: number) => {
    if (animating || i === index) return;
    playMulti();
    setDir(i > index ? 'left' : 'right');
    setAnimating(true);
    setTimeout(() => {
      setIndex(i);
      setDir(null);
      setAnimating(false);
    }, 260);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (dx < -40) navigate('next');
    if (dx > 40) navigate('prev');
  };

  // Which catalogue tab is active
  const activeCat = [...CATALOGUE].reverse().find(c => index >= c.pageIndex) ?? CATALOGUE[0];

  const slideClass = dir === 'left'
    ? 'translate-x-[-100%] opacity-0'
    : dir === 'right'
    ? 'translate-x-[100%] opacity-0'
    : 'translate-x-0 opacity-100';

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#080c09]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2eb36f]/10 bg-[#080c09]/90 backdrop-blur-sm shrink-0">
        <span className="font-cinzel text-[#2eb36f]/60 text-[11px] tracking-widest uppercase">
          {PAGES[index].rune} {PAGES[index].label}
        </span>
        <span className="font-mono text-[#5a7a60] text-[10px]">
          {index + 1} / {PAGES.length}
        </span>
        <button
          onClick={() => { playClick(); onStateChange('closing'); onClose(); }}
          className="font-cinzel text-[#a31a1a] text-[11px] tracking-widest border border-[#a31a1a]/30 px-2 py-0.5 rounded-sm"
        >
          ✕
        </button>
      </div>

      {/* Page card */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className={`absolute inset-0 transition-all duration-[260ms] ease-in-out ${slideClass}`}
          style={{ willChange: 'transform' }}
        >
          {PAGES[index].node}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-[#2eb36f]/10 bg-[#080c09]/90 backdrop-blur-sm">

        {/* Catalogue strip */}
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {CATALOGUE.map((entry) => {
            const isActive = activeCat.label === entry.label;
            return (
              <button
                key={entry.label}
                onClick={() => jumpTo(entry.pageIndex)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-all duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <span
                  className={`font-cinzel text-[15px] ${isActive ? 'text-[#2eb36f]' : 'text-[#8b6b4e]'}`}
                  style={isActive ? { textShadow: '0 0 8px rgba(46,179,111,0.6)' } : {}}
                >
                  {entry.rune}
                </span>
                <span className={`font-cinzel text-[8px] tracking-widest uppercase ${isActive ? 'text-[#a4302a]' : 'text-[#5c4d33]'}`}>
                  {entry.label}
                </span>
                {isActive && <div className="w-4 h-[1px] bg-[#a4302a] mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center justify-between px-6 pb-3 pt-1">
          <button
            onClick={() => navigate('prev')}
            disabled={animating}
            className="flex items-center gap-1.5 font-cinzel text-[#d4c5a0]/60 text-[11px] tracking-widest hover:text-[#d4c5a0] transition-colors disabled:opacity-30"
          >
            ← <span>prev</span>
          </button>

          {/* Page dots */}
          <div className="flex gap-1">
            {PAGES.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-200 ${
                  i === index
                    ? 'w-3 h-1.5 bg-[#2eb36f]'
                    : 'w-1.5 h-1.5 bg-[#2eb36f]/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate('next')}
            disabled={animating}
            className="flex items-center gap-1.5 font-cinzel text-[#d4c5a0]/60 text-[11px] tracking-widest hover:text-[#d4c5a0] transition-colors disabled:opacity-30"
          >
            <span>next</span> →
          </button>
        </div>
      </div>
    </div>
  );
}
