import React from 'react';
import Typewriter from './Typewriter';
import GrimoireModal from './GrimoireModal';
import { useCursor } from '@/context/CursorContext';


const COVER_SPARKS = [
  { sx: '0px',   sy: '-52px', delay: '0s',    color: '#2eb36f' },
  { sx: '37px',  sy: '-37px', delay: '0.1s',  color: '#f0d089' },
  { sx: '52px',  sy: '0px',   delay: '0.05s', color: '#2eb36f' },
  { sx: '37px',  sy: '37px',  delay: '0.15s', color: '#f0d089' },
  { sx: '0px',   sy: '52px',  delay: '0.08s', color: '#2eb36f' },
  { sx: '-37px', sy: '37px',  delay: '0.12s', color: '#f0d089' },
  { sx: '-52px', sy: '0px',   delay: '0.03s', color: '#2eb36f' },
  { sx: '-37px', sy: '-37px', delay: '0.18s', color: '#f0d089' },
];

export function CoverFront({ onOpen }: { onOpen?: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  const { pushCursor, popCursor } = useCursor();

  return (
    <div className="w-full h-full bg-cover-texture flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-[2px_8px_8px_2px]">
      
      {/* Outer embossing */}
      <div className="absolute inset-3 rounded-[2px_6px_6px_2px] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15),inset_-1px_-1px_3px_rgba(0,0,0,0.8),0_1px_3px_rgba(0,0,0,0.8)] border border-[#1a2b22] pointer-events-none" />
      
      {/* Inner embossing */}
      <div className="absolute inset-5 rounded-[2px_4px_4px_2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] border border-[#0f1c14] pointer-events-none" />
      
      {/* Corner Metal Clasps */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#d4af6a] to-[#7a5e30] rounded-bl-xl rounded-tr-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-b border-l border-black/40">
        <div className="w-3 h-3 mt-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tr from-[#d4af6a] to-[#7a5e30] rounded-tl-xl rounded-br-[8px] shadow-[0_-2px_4px_rgba(0,0,0,0.6),inset_1px_-1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-t border-l border-black/40">
        <div className="w-3 h-3 mb-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      {/* Spine edge thin metal plates */}
      <div className="absolute top-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bottom-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>

      <p className="text-[#a8b5a8] font-noto-jp text-sm tracking-widest mb-6 z-10 opacity-70">
        私は誰だろう？
      </p>

      {/* Embossed Title Box */}
      <div className="relative py-4 px-8 w-[85%] mx-auto rounded shadow-[inset_0_3px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.1)] border border-[#090a09] bg-[#0c120e] flex items-center justify-center mb-6">
        <h1 className="text-3xl lg:text-4xl font-cinzel-dec font-bold text-[#f0d089] text-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center z-10">
          Favour Ejiofor
        </h1>
      </div>
      
      <p className="text-[#849c89] font-kalam text-sm lg:text-base mb-12 z-10 shadow-black drop-shadow-md">
        software engineer · systems designer
      </p>
      
      {/* Debossed/Embossed Central Sigil — magic spell activates on hover */}
      <div
        className="w-32 h-32 rounded-full flex items-center justify-center relative mb-12 cursor-pointer select-none"
        style={{
          background: '#090d0b',
          border: '1px solid #090a09',
          boxShadow: hovered
            ? 'inset 0 4px 12px rgba(0,0,0,0.9), 0 0 32px 8px rgba(46,179,111,0.45), 0 0 60px 16px rgba(46,179,111,0.15)'
            : 'inset 0 4px 12px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.1)',
          transition: 'box-shadow 0.4s ease',
        }}
        onMouseEnter={() => { setHovered(true); pushCursor('lock'); }}
        onMouseLeave={() => { setHovered(false); popCursor(); }}
        onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
      >
        {/* Slow ambient spin ring — always on */}
        <div
          className="absolute inset-3 rounded-full border-[2px] border-[#2eb36f]/30"
          style={{
            borderStyle: 'dashed',
            animation: 'sigil-spin-cw 20s linear infinite',
            boxShadow: hovered ? 'inset 0 0 10px rgba(46,179,111,0.2), 0 0 8px rgba(46,179,111,0.3)' : 'inset 0 0 10px rgba(46,179,111,0.1)',
            transition: 'box-shadow 0.4s ease',
          }}
        />

        {/* Hover: fast outer ring CW */}
        <div style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          border: '1px solid rgba(46,179,111,0.5)',
          borderStyle: 'dashed',
          animation: hovered ? 'sigil-spin-cw 2s linear infinite' : 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          boxShadow: '0 0 10px rgba(46,179,111,0.3)',
        }} />

        {/* Hover: inner ring CCW */}
        <div style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: '50%',
          border: '1px solid rgba(240,208,137,0.6)',
          animation: hovered ? 'sigil-spin-ccw 1.2s linear infinite' : 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          boxShadow: '0 0 8px rgba(240,208,137,0.4)',
        }} />

        {/* Expanding cast rings — two offset loops */}
        {[0, 0.5].map((delay, i) => (
          <div key={i} style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1.5px solid rgba(46,179,111,0.7)',
            animation: hovered ? `sigil-cast-ring 1.4s ease-out ${delay}s infinite` : 'none',
            opacity: 0,
          }} />
        ))}

        {/* Core radial glow pulse */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,179,111,0.4) 0%, rgba(46,179,111,0.1) 55%, transparent 75%)',
          animation: hovered ? 'sigil-pulse-glow 1s ease-in-out infinite' : 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Ambient blur glow — always subtle */}
        <div className="w-20 h-20 absolute rounded-full" style={{
          background: 'radial-gradient(circle at center, #2eb36f, transparent)',
          opacity: hovered ? 0.45 : 0.2,
          filter: 'blur(10px)',
          transition: 'opacity 0.4s ease',
        }} />

        {/* Floating rune glyphs at compass points — appear on hover */}
        {hovered && ['ᚩ', 'ᛖ', 'ᛏ', 'ᛈ'].map((rune, i) => {
          const angle = i * 90 - 90;
          const rad = angle * Math.PI / 180;
          const r = 56;
          return (
            <span key={i} style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${Math.cos(rad) * r}px), calc(-50% + ${Math.sin(rad) * r}px))`,
              fontSize: '10px',
              color: '#2eb36f',
              textShadow: '0 0 8px rgba(46,179,111,0.9)',
              animation: `sigil-rune-fade ${0.8 + i * 0.15}s ease-in-out ${i * 0.1}s infinite`,
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              {rune}
            </span>
          );
        })}

        {/* Sparks */}
        {hovered && COVER_SPARKS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            marginTop: '-1.5px',
            marginLeft: '-1.5px',
            background: s.color,
            boxShadow: `0 0 5px 2px ${s.color}`,
            ['--sx' as string]: s.sx,
            ['--sy' as string]: s.sy,
            animation: `sigil-spark-fly 0.7s ease-out ${s.delay} infinite`,
          }} />
        ))}

        {/* The ✧ glyph */}
        <span
          className="font-cinzel relative z-10 -mt-1"
          style={{
            fontSize: '3rem',
            color: hovered ? '#5fffb0' : '#2eb36f',
            textShadow: hovered
              ? '0 0 20px rgba(46,179,111,1), 0 0 40px rgba(46,179,111,0.6), 0 0 60px rgba(46,179,111,0.3)'
              : '0 0 15px rgba(46,179,111,0.6)',
            transition: 'color 0.3s ease, text-shadow 0.3s ease',
            animation: hovered ? 'sigil-spin-cw 8s linear infinite' : 'none',
          }}
        >
          ✧
        </span>
      </div>
      
      <p
        className="font-caveat text-2xl z-10 mt-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none"
        style={{
          color: hovered ? '#f0d089' : '#f0d089cc',
          textShadow: hovered ? '0 0 12px rgba(240,208,137,0.7)' : 'none',
          transition: 'text-shadow 0.3s ease',
        }}
      >
        open grimoire
      </p>
    </div>
  );
}

export const InnerCover = React.memo(function InnerCover({ right = false }: { right?: boolean }) {
  if (right) {
    return (
      <div className="w-full h-full bg-cover-texture flex items-center justify-center relative shadow-[inset_20px_0_20px_rgba(0,0,0,0.8)] border-y border-[#d4c5a0]/10 overflow-hidden">
        <style>{`
          @keyframes grimoire-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes grimoire-pulse-slow {
            0%, 100% { opacity: 0.85; }
            50% { opacity: 0.3; }
          }
          .grimoire-pulse { animation: grimoire-pulse 2.5s ease-in-out infinite; }
          .grimoire-pulse-slow { animation: grimoire-pulse-slow 4s ease-in-out infinite; }
          .grimoire-pulse-xslow { animation: grimoire-pulse-slow 6s ease-in-out infinite 1s; }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

        {/* Faint background runes */}
        <div className="opacity-[0.03] text-[#8b6b4e] flex flex-col gap-12 absolute select-none">
          <span className="text-[10rem]">ᛟ</span>
          <span className="text-[10rem]">ᛉ</span>
        </div>

        {/* Glowing closing inscription */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-10 text-center">

          <span
            className="grimoire-pulse text-4xl text-[#2eb36f]"
            style={{ textShadow: '0 0 20px rgba(46,179,111,0.9), 0 0 40px rgba(46,179,111,0.5)' }}
          >
            ✦
          </span>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#2eb36f]/40 to-transparent" />

          <p
            className="grimoire-pulse-slow font-cinzel text-[#a8c8b0] text-[12px] tracking-[0.15em] leading-relaxed"
            style={{ textShadow: '0 0 14px rgba(46,179,111,0.6), 0 0 28px rgba(46,179,111,0.3)' }}
          >
            You&apos;ve reached the end —
          </p>

          <p
            className="grimoire-pulse font-caveat text-[#7ab88a] text-[20px]"
            style={{ textShadow: '0 0 10px rgba(46,179,111,0.5)', animationDuration: '3s' }}
          >
            for now.
          </p>

          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#ffae00]/25 to-transparent" />

          <p
            className="font-kalam text-[#5a7a60] text-[11px] leading-[1.9] max-w-[180px] italic"
            style={{ textShadow: '0 0 8px rgba(46,179,111,0.25)' }}
          >
            Come back to see where this journey goes.
          </p>
          <p
            className="font-kalam text-[#3d5c44] text-[10.5px] italic"
            style={{ textShadow: '0 0 6px rgba(46,179,111,0.2)' }}
          >
            The grimoire is never finished.
          </p>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#2eb36f]/20 to-transparent mt-1" />

          <span
            className="grimoire-pulse-xslow text-base text-[#ffae00]/60"
            style={{ textShadow: '0 0 12px rgba(255,174,0,0.5)' }}
          >
            ᛟ
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-cover-texture flex items-center justify-center relative shadow-[inset_-20px_0_20px_rgba(0,0,0,0.8)] border-y border-[#d4c5a0]/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
      <div className="opacity-[0.03] text-[#8b6b4e] flex flex-col gap-12">
        <span className="text-[10rem]">ᚲ</span>
        <span className="text-[10rem]">ᚷ</span>
      </div>
    </div>
  );
});

export const CoverBack = React.memo(function CoverBack() {
  return (
    <div className="w-full h-full bg-cover-back rounded-[2px_8px_8px_2px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Outer embossing */}
      <div className="absolute inset-3 rounded-[2px_6px_6px_2px] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15),inset_-1px_-1px_3px_rgba(0,0,0,0.8),0_1px_3px_rgba(0,0,0,0.8)] border border-[#1a2b22] pointer-events-none" />
      
      {/* Inner embossing */}
      <div className="absolute inset-5 rounded-[2px_4px_4px_2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] border border-[#0f1c14] pointer-events-none" />
      
      {/* Corner Metal Clasps */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#d4af6a] to-[#7a5e30] rounded-bl-xl rounded-tr-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-b border-l border-black/40">
        <div className="w-3 h-3 mt-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tr from-[#d4af6a] to-[#7a5e30] rounded-tl-xl rounded-br-[8px] shadow-[0_-2px_4px_rgba(0,0,0,0.6),inset_1px_-1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-t border-l border-black/40">
        <div className="w-3 h-3 mb-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      {/* Spine edge thin metal plates */}
      <div className="absolute top-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bottom-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>

      <div className="w-20 h-20 rounded-full flex items-center justify-center relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)] bg-[#090d0b] border border-[#090a09]">
        <div className="absolute inset-2 rounded-full border border-[#2eb36f]/10" />
      </div>

      {/* Closing inscription */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 px-10 text-center pointer-events-none">
        <div className="w-12 h-[1px] bg-[#2eb36f]/20 mb-1" />
        <p className="font-caveat text-[#849c89] text-[15px] leading-relaxed max-w-[260px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          You&apos;ve reached the end — for now.
        </p>
        <p className="font-kalam text-[#5a7a60] text-[12px] leading-relaxed max-w-[240px] italic">
          Come back later to see where this journey goes. The grimoire is never truly finished.
        </p>
        <div className="w-8 h-[1px] bg-[#2eb36f]/20 mt-1" />
        <span className="text-[#2eb36f]/30 text-lg">✦</span>
      </div>
    </div>
  );
});

export const TitlePage = React.memo(function TitlePage({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-right p-6 relative ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? '' : 'rounded-r-md shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)] border-l-2 border-[#d4c5a0]'}`}>
      <span className="absolute top-6 right-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛉ</span>
      <span className="absolute bottom-6 right-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛏ</span>

      <div className="h-full border border-[#8b6b4e]/40 rounded p-8 flex flex-col items-center justify-center text-center">
        <h2 className={`font-cinzel text-[#1a0f05] mb-2 font-semibold tracking-widest ${mobile ? 'text-3xl' : 'text-4xl'}`}>Favour Ejiofor</h2>
        <h3 className={`font-cinzel text-[#a4302a] mb-4 tracking-wide ${mobile ? 'text-lg' : 'text-xl'}`}>&ldquo;Cipher&rdquo;</h3>
        <div className="w-24 h-[2px] bg-[#8b6b4e]/60 mb-8" />
        <p className={`font-semibold text-[#1a0f05] mb-4 font-serif ${mobile ? 'text-base' : 'text-[14px]'}`}>
          Digital Alchemist &amp; Systems Engineer
        </p>
        <p className={`italic text-[#3d2b1f] leading-loose max-w-[90%] font-serif ${mobile ? 'text-sm' : 'text-[12.5px]'}`}>
          Crafting scalable backends, embedding neural intelligence, and enforcing Zero-Trust security.
        </p>
        <div className="mt-12 opacity-40">
          <span className="text-2xl text-[#1a0f05] font-cinzel">✦</span>
        </div>
      </div>
    </div>
  );
});

// ── Table of contents ────────────────────────────────────────────────
// Sits on the left page of the title spread (previously blank) so the very
// first spread already tells visitors what is inside and lets them jump.
export const TOC_ENTRIES = [
  { id: 'origin',     label: 'The Origin Incantation', rune: 'ᚩ' },
  { id: 'experience', label: 'Journeys & Quests',      rune: 'ᛖ' },
  { id: 'tools',      label: 'Runes & Tools',          rune: 'ᛏ' },
  { id: 'projects',   label: 'Arcane Constructs',      rune: 'ᛈ' },
  { id: 'contact',    label: 'Current Focus & Contact', rune: 'ᛗ' },
  { id: 'guestbook',  label: 'Leave a Word',           rune: 'ᛟ' },
] as const;
export type SectionId = typeof TOC_ENTRIES[number]['id'];

export function TableOfContents({ onJump }: { onJump: (id: SectionId) => void }) {
  return (
    <div className="w-full h-full bg-parchment-left rounded-l-md px-10 py-12 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0] flex flex-col overflow-hidden">
      <p className="font-cinzel text-[10px] tracking-[0.3em] text-[#8b6b4e] uppercase text-center">Contents</p>
      <div className="w-10 h-[1px] bg-[#a4302a]/60 mx-auto mt-2 mb-8" />
      <nav aria-label="Table of contents">
        <ol className="space-y-[18px]">
          {TOC_ENTRIES.map((e, i) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => onJump(e.id)}
                className="group w-full flex items-baseline gap-3 text-left font-serif text-[14px] text-[#1a0f05] hover:text-[#a4302a] transition-colors"
              >
                <span className="font-cinzel text-[#a4302a]/70 w-4 text-center shrink-0">{e.rune}</span>
                <span className="shrink-0">{e.label}</span>
                <span aria-hidden className="flex-1 border-b border-dotted border-[#8b6b4e]/50 translate-y-[-4px] group-hover:border-[#a4302a]/60" />
                <span className="font-cinzel text-[11px] text-[#8b6b4e] shrink-0">{['i', 'ii', 'iii', 'iv', 'v', 'vi'][i]}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-auto text-center space-y-1.5">
        <p className="font-caveat text-[17px] text-[#5c4d33]">Lift a page corner to turn it,</p>
        <p className="font-kalam text-[10.5px] text-[#8b6b4e] italic">or use ← → · Esc closes the book</p>
      </div>
    </div>
  );
}

export const OriginLeft = React.memo(function OriginLeft({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-left flex flex-col justify-center ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? 'p-6' : 'rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]'}`}>
      <h2 className={`font-cinzel font-semibold text-[#1a0f05] mb-6 border-b border-[#8b6b4e]/30 pb-4 inline-block self-start
        ${mobile ? 'text-xl' : 'text-2xl'}`}>
        The Origin Incantation
      </h2>

      {mobile ? (
        <>
          <div className="flex justify-center mb-4">
            <div className="w-28 h-36 bg-[#f4ebd0] p-2 shadow-md rotate-2 border border-[#d4c5a0] flex flex-col">
              <div className="w-full flex-1 bg-[#d0c6a8]/40 border border-[#a4302a]/20 flex items-center justify-center relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/photo1.jpg" alt="Profile" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <p className="font-caveat text-center text-[#5c4d33] text-[13px] mt-1 -mb-1">Me</p>
            </div>
          </div>
          <div className="text-[#3d2b1f] space-y-4 text-sm leading-relaxed font-serif">
            <p>
              <span className="font-cinzel-dec text-4xl float-left leading-[0.8] pt-1 pr-2 text-[#a4302a]">A</span>
              t age 12, inspired by Kenzi&apos;s effortless tech brilliance on <span className="italic">Game Shakers</span>, the obsession began. First came Scratch, which quickly sparked a jump into raw Python scripts.
            </p>
            <p>As basic scripts turned into visual projects, web development opened the door to building interfaces and handling real-world data flow.</p>
            <p>But as complexity grew, so did the fascination with what went on under the hood — moving past basic code to design resilient, beautifully structured systems.</p>
          </div>
        </>
      ) : (
        <div className="text-[#3d2b1f] space-y-4 text-[12.5px] leading-[1.5] font-serif">
          <div className="float-right ml-4 mb-2 w-32 h-40 bg-[#f4ebd0] p-2 shadow-md rotate-2 border border-[#d4c5a0] flex flex-col">
            <div className="w-full flex-1 bg-[#d0c6a8]/40 border border-[#a4302a]/20 flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <div className="text-center p-2 text-[#8b6b4e]">
                <p className="font-kalam text-[10px] leading-tight group-hover:hidden">Upload your photo to <br/><span className="font-mono bg-[#d4c5a0]/40 px-1">/public/photo1.jpg</span></p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo1.jpg" alt="Profile 1" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.remove('group'); }} />
            </div>
            <p className="font-caveat text-center text-[#5c4d33] text-[13px] mt-1 -mb-1">Me</p>
          </div>
          <p>
            <span className="font-cinzel-dec text-4xl float-left leading-[0.8] pt-1 pr-2 text-[#a4302a]">A</span>
            t age 12, inspired by Kenzi&apos;s effortless tech brilliance on <span className="italic">Game Shakers</span>, the obsession began. First came the logical playgrounds of Scratch, which quickly sparked a jump into raw Python scripts to see how real software came to life.
          </p>
          <p>As basic scripts turned into visual projects, web development opened the door to building interfaces and handling real-world data flow.</p>
          <p>But as complexity grew, so did the fascination with what went on under the hood—moving past basic code to design resilient, beautifully structured, and properly architected systems.</p>
        </div>
      )}
    </div>
  );
});

export const OriginTerminal = React.memo(function OriginTerminal({ active, mobile = false, playSound }: { active: boolean; mobile?: boolean; playSound?: () => void }) {
  const logText = `> Executing initiation sequence...
> Loading chronos_logs.dat...
> [USER] identified: Cipher
> Class: Systems Engineer & Digital Alchemist
> Level: Senior
> Primary Elements: TypeScript, Python, Go, Node.js
> Specialization: Zero-Trust Security, Neural Intelligence
> Status: Core systems online.
> Ready for deployment.`;

  return (
    <div className={`w-full h-full bg-parchment-right flex flex-col overflow-hidden
      ${mobile ? 'p-4' : 'rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]'}`}>
       <div className={`bg-[#161210] p-6 rounded-sm border border-[#d4af6a]/25 shadow-xl flex flex-col relative overflow-hidden
         ${mobile ? 'flex-1 my-2' : 'h-[80%] my-4 -rotate-1'}`}>
         {/* Scanline overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
         <div className="flex gap-2 mb-4 bg-[#0d0b09] -mt-6 -mx-6 p-3 border-b border-[#3d2b1f] relative z-10">
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
         </div>
         <div className={`flex-1 overflow-y-auto leading-[1.65] relative z-10 font-mono
           ${mobile ? 'text-[13px]' : 'text-[10.8px]'}`} style={{ isolation: 'isolate' }}>
           <Typewriter text={logText} active={active} delay={800} playSound={playSound} />
         </div>
       </div>
    </div>
  );
});

export const ExperienceLeft = React.memo(function ExperienceLeft({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-left flex flex-col ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? 'p-6' : 'rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]'}`}>
      <div className="w-16 h-16 rounded-full border-2 border-[#a4302a] flex items-center justify-center mb-6 shrink-0 relative">
        <div className="absolute inset-1 rounded-full border border-[#d4af6a]/50 border-dashed animate-[spin_20s_linear_infinite]" />
        <span className="font-cinzel text-xl text-[#1a0f05]">Exp</span>
      </div>

      <div className={`text-[#3d2b1f] space-y-4 leading-[1.62] font-serif pr-2
        ${mobile ? 'text-sm' : 'text-[13.5px]'}`}>
        <h2 className={`font-cinzel font-semibold text-[#1a0f05] mb-2 border-b border-[#a4302a] pb-1
          ${mobile ? 'text-xl' : 'text-2xl'}`}>Journeys &amp; Quests</h2>
        <p>
          The path of a developer is paved with trials. Herein lies the record of my past campaigns, from small skirmishes to grand sieges on legacy codebases.
        </p>

        <div className="mt-4 space-y-5">
          <div className="border-l-2 border-[#a4302a]/40 pl-3 relative">
            <div className="absolute w-2 h-2 rounded-full bg-[#a4302a] -left-[5px] top-1.5" />
            <h3 className="font-bold text-[#1a0f05]">Senior Fullstack Engineer</h3>
            <p className="text-[#a4302a] text-xs font-mono mb-1">2025 - Present | ISBMPA (isbmpa.com)</p>
            <p className="text-sm">Managed web infrastructure, domain configurations, and media gallery hosting using Appwrite while optimizing data fetching limits and backend performance.</p>
          </div>

          <div className="border-l-2 border-[#5c4d33]/40 pl-3 relative">
            <div className="absolute w-2 h-2 rounded-full bg-[#5c4d33] -left-[5px] top-1.5" />
            <h3 className="font-bold text-[#1a0f05]">Entry Deep Learning Trainee</h3>
            <p className="text-[#a4302a] text-xs font-mono mb-1">2026 | NVIDIA x UNILAG</p>
            <p className="text-sm">Trained in deep learning fundamentals and neural network architectures through hands-on technical workshops and model optimization exercises.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const ExperienceRight = React.memo(function ExperienceRight({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-right flex flex-col ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? 'p-6' : 'rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]'}`}>
      {!mobile && <div className="w-full h-8 border-b border-[#a4302a] mb-6 opacity-0" />}
      {mobile && <h2 className="text-xl font-cinzel font-semibold text-[#1a0f05] mb-4 border-b border-[#a4302a] pb-1">Journeys &amp; Quests (cont.)</h2>}

      <div className={`text-[#3d2b1f] space-y-5 leading-[1.62] font-serif pr-2 mt-2
        ${mobile ? 'text-sm' : 'text-[13.5px]'}`}>
        <div className="border-l-2 border-[#5c4d33]/40 pl-3 relative">
          <div className="absolute w-2 h-2 rounded-full bg-[#5c4d33] -left-[5px] top-1.5" />
          <h3 className="font-bold text-[#1a0f05]">CTF Winner</h3>
          <p className="text-[#a4302a] text-xs font-mono mb-1">2026 | Go2Cyber</p>
          <p className="text-sm">Secured first place in a competitive capture-the-flag tournament by exploiting system vulnerabilities and executing real-time threat analysis under timed conditions.</p>
        </div>

        <div className="border-l-2 border-[#5c4d33]/40 pl-3 relative">
          <div className="absolute w-2 h-2 rounded-full border border-[#5c4d33] bg-transparent -left-[5px] top-1.5" />
          <h3 className="font-bold text-[#1a0f05]">Software Engineering Intern</h3>
          <p className="text-[#a4302a] text-xs font-mono mb-1">2024 | HNG</p>
          <p className="text-sm">Collaborated with cross-functional teams to build, test, and ship full-stack web features in a fast-paced agile development environment.</p>
        </div>

        <p className="italic text-[#5c4d33] pt-4 border-t border-[#d4c5a0] mt-4">
          &quot;Experience is not merely time spent, but the wisdom distilled from countless compiled errors.&quot;
        </p>
      </div>
    </div>
  );
});

export const ToolsLeft = React.memo(function ToolsLeft({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-left flex flex-col ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? 'p-6' : 'rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]'}`}>
      <h2 className={`font-cinzel font-semibold text-[#1a0f05] mb-6 border-b border-[#a4302a] pb-2 inline-block self-start
        ${mobile ? 'text-xl' : 'text-2xl'}`}>Core &amp; Frontend Runes</h2>

      <div className="flex-1 pr-2 space-y-4">
        <div className="space-y-4 text-[13px] font-serif">
          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`font-semibold font-cinzel text-[#1a0f05] mb-2 flex items-center gap-2 ${mobile ? 'text-base' : 'text-[15px]'}`}>
              <span className="text-[#a4302a] text-lg">✦</span> Core Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/typescript/typescript-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="TypeScript" title="TypeScript" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/javascript/javascript-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="JavaScript" title="JavaScript" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/python/python-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Python" title="Python" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/go/go-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Go" title="Go" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/java/java-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Java" title="Java" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/kotlin/kotlin-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Kotlin" title="Kotlin" />
            </div>
            <p className={`text-[#5c4d33] leading-relaxed mt-2 ${mobile ? 'text-sm' : 'text-xs'}`}>Primary incantations: TypeScript, JavaScript, Python. Systems: Go, Java, Kotlin.</p>
          </div>

          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`font-semibold font-cinzel text-[#1a0f05] mb-2 flex items-center gap-2 ${mobile ? 'text-base' : 'text-[15px]'}`}>
              <span className="text-[#a4302a] text-lg">⚛</span> Web &amp; Mobile Frontend
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/react/react-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="React" title="React" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/vitejs/vitejs-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Vite" title="Vite" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/tailwindcss/tailwindcss-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Tailwind" title="Tailwind CSS" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/androidstudio/androidstudio-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Android Studio" title="Android Studio" />
            </div>
            <p className={`text-[#5c4d33] leading-relaxed mt-2 ${mobile ? 'text-sm' : 'text-xs'}`}>Visual manifestation: React, React Native, Vite, Tailwind CSS, Android Studio.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export const ToolsRight = React.memo(function ToolsRight({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-right flex flex-col ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? 'p-6' : 'rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]'}`}>
      <div className="flex-1 pr-2 space-y-4">
        <h2 className={`font-cinzel font-semibold text-[#1a0f05] mb-2 border-b border-[#a4302a] pb-2 inline-block self-start
          ${mobile ? 'text-xl' : 'text-2xl'}`}>Backend &amp; Systems</h2>

        <div className="space-y-4 text-[13px] font-serif mt-4">
          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`font-semibold font-cinzel text-[#1a0f05] mb-2 flex items-center gap-2 ${mobile ? 'text-base' : 'text-[15px]'}`}>
              <span className="text-[#a4302a] text-lg">⚡</span> Backend Architecture
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/nodejs/nodejs-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Node" title="Node.js" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/express/express-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Express" title="Express.js" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/appwrite/appwrite-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Appwrite" title="Appwrite" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/firebase/firebase-plain.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Firebase" title="Firebase" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/supabase/supabase-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Supabase" title="Supabase" />
            </div>
            <p className={`text-[#5c4d33] leading-relaxed ${mobile ? 'text-sm' : 'text-xs'}`}>Distributed Systems, Zero-Trust Architecture, REST APIs, Microservices, P2P / Mesh Networking.</p>
          </div>

          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`font-semibold font-cinzel text-[#1a0f05] mb-2 flex items-center gap-2 ${mobile ? 'text-base' : 'text-[15px]'}`}>
              <span className="text-[#a4302a] text-lg">🗄</span> Data Infrastructure
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/postgresql/postgresql-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="PostgreSQL" title="PostgreSQL" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/mysql/mysql-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="MySQL" title="MySQL" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/redis/redis-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Redis" title="Redis" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/prisma/prisma-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Prisma" title="Prisma" />
            </div>
            <p className={`text-[#5c4d33] leading-relaxed ${mobile ? 'text-sm' : 'text-xs'}`}>Relational DBs, ORMs, and AI Data Layers (pgvector, Qdrant).</p>
          </div>

          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`font-semibold font-cinzel text-[#1a0f05] mb-2 flex items-center gap-2 ${mobile ? 'text-base' : 'text-[15px]'}`}>
              <span className="text-[#a4302a] text-lg">🛡</span> DevOps &amp; Security
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/docker/docker-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Docker" title="Docker" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/githubactions/githubactions-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="GitHub Actions" title="GitHub Actions" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/linux/linux-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Linux" title="Linux" />
            </div>
            <p className={`text-[#5c4d33] leading-relaxed ${mobile ? 'text-sm' : 'text-xs'}`}>CI/CD, Cryptographic libraries, Token Rotation/mTLS, Pentesting &amp; Local LLMs.</p>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── Projects ─────────────────────────────────────────────────────────
// Single source of truth for the book, the phone reader and the plain
// summary page. Ordered by how much each one says about the work.
export interface Project {
  name: string;
  year: string;
  role: string;
  stack: string;
  blurb: string;
  github?: string;
  live?: string;
  tag?: string;
}

export const PROJECTS: Project[] = [
  {
    name: 'Quellix', year: '2026', role: 'Creator & Lead Developer', tag: 'open-source',
    stack: 'TS / React / Express / Prisma / PostgreSQL',
    blurb: 'Open-source authentication SDK for React: drop-in components, hooks, sessions, MFA and organizations, backed by a self-hostable API. Clerk-grade auth without the vendor lock-in.',
    github: 'https://github.com/cipher-d-dev/Quellix',
  },
  {
    name: 'Clarion', year: '2026', role: 'Fullstack & AI Engineer',
    stack: 'TS / React / AI Pipelines / Express / PostgreSQL',
    blurb: 'AI-powered complaint and issue platform for tertiary institutions. Classifies tickets, routes them to the right office, and tracks them in real time with admin analytics.',
    github: 'https://github.com/cipher-d-dev/Clarion', live: 'https://clarion-schools.vercel.app',
  },
  {
    name: 'Aetheris', year: '2026', role: 'Systems & Security Developer',
    stack: 'React Native / Kotlin / Nearby Connections / libsodium',
    blurb: 'Offline messenger where every phone is a relay. Messages hop device-to-device over Bluetooth and Wi‑Fi along the shortest route, end-to-end encrypted, with signed route announcements so relays can\'t hijack traffic.',
    github: 'https://github.com/cipher-d-dev/Aetheris',
  },
  {
    name: 'cipher_auth', year: '2026', role: 'Backend & Security Engineer',
    stack: 'JS / TS / Node.js / Passport.js',
    blurb: 'Authentication infrastructure built on Passport for JS/TS apps. Secure by default, customizable by design.',
    github: 'https://github.com/cipher-d-dev/cipher_auth',
  },
  {
    name: 'ISBMPA', year: '2025 – now', role: 'Senior Fullstack Engineer',
    stack: 'TS / React / Appwrite',
    blurb: 'Official government liaison website for institutional media and information. Built the media gallery hosting, custom domain routing and backend tuning.',
    github: 'https://github.com/cipher-d-dev/isbmpa', live: 'https://isbmpa.com',
  },
  {
    name: 'fslens', year: '2026', role: 'Frontend Engineer',
    stack: 'TS / React / Next.js / Tailwind CSS',
    blurb: 'Cinematic portfolio for a professional videographer: fast media delivery, responsive galleries and motion-led layouts.',
    github: 'https://github.com/cipher-d-dev/fslens', live: 'https://fslens.vercel.app',
  },
  {
    name: 'Weft', year: '2026', role: 'Android Developer',
    stack: 'Kotlin / Android SDK',
    blurb: 'A working Android home-screen launcher built on a live design-token architecture.',
    github: 'https://github.com/cipher-d-dev/Weft',
  },
  {
    name: 'Hopper', year: '2026', role: 'Systems Developer',
    stack: 'C# / C++ / Windows API',
    blurb: 'Keyboard-driven Windows automation tool for fast navigation and quick execution.',
    github: 'https://github.com/cipher-d-dev/Hopper',
  },
  {
    name: 'Traverse Programming', year: '2025', role: 'Desktop Developer',
    stack: 'VB.NET / Windows Forms',
    blurb: 'Closed-traverse computation for surveying: bearings, Bowditch adjustment, coordinates, accuracy and area.',
    github: 'https://github.com/cipher-d-dev/Tranverse-Programming-Surverying',
  },
];

// How the projects are laid out across the book's pages (no page scrolls).
export const PROJECT_PAGES: Project[][] = [
  PROJECTS.slice(0, 2),
  PROJECTS.slice(2, 4),
  PROJECTS.slice(4, 6),
  PROJECTS.slice(6, 9),
];
const NUMERALS = ['I', 'II', 'III', 'IV'];

export const ProjectsPage = React.memo(function ProjectsPage({
  page, mobile = false,
}: { page: number; mobile?: boolean }) {
  const side: 'left' | 'right' = page % 2 === 0 ? 'left' : 'right';
  const items = PROJECT_PAGES[page];
  const compact = items.length > 2;
  const linkClass = `inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] transition-colors relative z-10 ${mobile ? 'text-sm' : 'text-[12.5px]'}`;
  const metaClass = `text-[#5c4d33] font-mono tracking-[0.03em] mb-1.5 ${mobile ? 'text-[11px]' : 'text-[9px]'}`;
  const bodyClass = `text-[#1a0f05] mb-1.5 font-serif ${mobile ? 'text-sm leading-[1.6]' : compact ? 'text-[12.5px] leading-[1.5]' : 'text-[13px] leading-[1.58]'}`;
  const titleClass = `font-semibold font-cinzel text-[#1a0f05] mb-0.5 ${mobile ? 'text-lg' : 'text-[17px]'}`;
  const frame = side === 'left'
    ? 'bg-parchment-left rounded-l-md shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]'
    : 'bg-parchment-right rounded-r-md shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]';

  return (
    <div className={`w-full h-full flex flex-col ${mobile ? `${side === 'left' ? 'bg-parchment-left' : 'bg-parchment-right'} p-6 overflow-auto` : `${frame} px-10 py-9 overflow-hidden`}`}>
      <div className="flex items-baseline justify-between mb-5 border-b border-[#a4302a] pb-2">
        <h2 className={`font-cinzel font-semibold text-[#1a0f05] ${mobile ? 'text-xl' : 'text-2xl'}`}>
          Arcane Constructs <span className="text-[#a4302a]">{NUMERALS[page]}</span>
        </h2>
        <span className="font-mono text-[9px] text-[#8b6b4e]">{page + 1}/{PROJECT_PAGES.length}</span>
      </div>
      <div className={compact ? 'space-y-4' : 'space-y-6'}>
        {items.map((proj) => (
          <article key={proj.name} className="relative">
            <div className="flex items-center justify-between">
              <h3 className={titleClass}>{proj.name}</h3>
              {proj.tag && <span className="font-caveat text-[#a4302a] text-sm rotate-[3deg]">{proj.tag} →</span>}
            </div>
            <p className={metaClass}>{proj.year} · {proj.role} · {proj.stack}</p>
            <p className={bodyClass}>{proj.blurb}</p>
            <div className="flex gap-4">
              {proj.github && <a href={proj.github} target="_blank" rel="noreferrer" className={linkClass} aria-label={`${proj.name} on GitHub`}>→ GitHub</a>}
              {proj.live && <a href={proj.live} target="_blank" rel="noreferrer" className={linkClass} aria-label={`${proj.name} live site`}>→ Live</a>}
            </div>
          </article>
        ))}
      </div>
      {page === PROJECT_PAGES.length - 1 && (
        <p className={`mt-auto pt-4 font-caveat text-[#5c4d33] text-center ${mobile ? 'text-base' : 'text-[16px]'}`}>
          more experiments live on{' '}
          <a href="https://github.com/cipher-d-dev" target="_blank" rel="noreferrer" className="text-[#2f5d8a] border-b border-dashed border-[#2f5d8a]">github</a>
        </p>
      )}
    </div>
  );
});

export const FocusTerminal = React.memo(function FocusTerminal({ active, mobile = false, playSound }: { active: boolean; mobile?: boolean; playSound?: () => void }) {
  const focusText = `$ status --current
> focus: Mesh Networks & Cryptography
> learning: Vector DBs & LLM Runners
> open to: Senior / System Architect roles
> status: compiling runes...`;

  return (
    <div className={`w-full h-full bg-parchment-left flex flex-col overflow-hidden
      ${mobile ? 'p-4' : 'rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]'}`}>
      <div className={`bg-[#161210] p-6 rounded-sm border border-[#d4af6a]/25 shadow-xl flex flex-col relative overflow-hidden
        ${mobile ? 'flex-1 my-2' : 'h-[80%] my-4 -rotate-1'}`}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
        <div className="flex gap-2 mb-4 bg-[#0d0b09] -mt-6 -mx-6 p-3 border-b border-[#3d2b1f] relative z-10">
          <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
          <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
          <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
        </div>
        <div className={`flex-1 overflow-y-auto leading-[1.65] relative z-10 font-mono
          ${mobile ? 'text-[13px]' : 'text-[10.8px]'}`} style={{ isolation: 'isolate' }}>
          <Typewriter text={focusText} active={active} delay={400} playSound={playSound} />
        </div>
      </div>
    </div>
  );
});

export const ContactRight = React.memo(function ContactRight({ mobile = false }: { mobile?: boolean }) {
  const rowClass = `flex items-center gap-3 py-3 border-b border-dashed border-[#c9b783] font-mono ${mobile ? 'text-sm' : 'text-[11.5px]'}`;
  const labelClass = `text-[#5c4d33] ${mobile ? 'w-20' : 'min-w-[68px]'}`;
  const linkClass = 'text-[#1a0f05] hover:text-[#2f5d8a] transition-colors relative z-10';

  return (
    <div className={`w-full h-full bg-parchment-right flex flex-col justify-center ${mobile ? 'overflow-auto' : 'overflow-hidden'}
      ${mobile ? 'p-6' : 'rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]'}`}
      style={{ isolation: 'isolate' }}>
      <span className="absolute top-6 right-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛃ</span>
      <span className="absolute bottom-6 left-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛗ</span>

      {mobile ? (
        /* Mobile: stacked header + photo centred, then contact rows */
        <>
          <div className="flex flex-col items-center mb-6 gap-3">
            <div className="w-24 h-32 bg-[#f4ebd0] p-1.5 shadow-sm -rotate-3 border border-[#d4c5a0] flex flex-col">
              <div className="w-full flex-1 bg-[#d0c6a8]/40 border border-[#a4302a]/20 flex items-center justify-center relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/photo2.jpg" alt="Profile" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-cinzel font-semibold text-[#1a0f05] mb-1 border-b border-[#a4302a] pb-2 inline-block">Contact</h2>
              <p className="text-[#5c4d33] text-sm font-serif mt-1">Only what I actually check.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-[17px] font-cinzel font-semibold text-[#1a0f05] mb-2 border-b border-[#a4302a] pb-2 inline-block">Contact</h2>
            <p className="text-[#5c4d33] text-[11.5px] font-serif">Only what I actually check.</p>
          </div>
          <div className="w-24 h-32 bg-[#f4ebd0] p-1.5 shadow-sm -rotate-3 border border-[#d4c5a0] flex flex-col mt-2 mr-4">
            <div className="w-full flex-1 bg-[#d0c6a8]/40 border border-[#a4302a]/20 flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <div className="text-center p-1 text-[#8b6b4e]">
                <p className="font-kalam text-[8px] leading-tight group-hover:hidden">Upload to <br/><span className="font-mono bg-[#d4c5a0]/40 px-1">/public/photo2.jpg</span></p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo2.jpg" alt="Profile 2" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.remove('group'); }} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full space-y-0">
        <div className={rowClass}>
          <span className={labelClass}>email</span>
          <a href="mailto:faveejiofor2009@gmail.com" className={linkClass}>faveejiofor2009@gmail.com</a>
        </div>
        <div className={rowClass}>
          <span className={labelClass}>github</span>
          <a href="https://github.com/cipher-d-dev" target="_blank" rel="noreferrer" className={linkClass}>github.com/cipher-d-dev</a>
        </div>
        <div className={rowClass}>
          <span className={labelClass}>linkedin</span>
          <a href="https://www.linkedin.com/in/fave-ejiofor-a05bab260" target="_blank" rel="noreferrer" className={`${linkClass} ${mobile ? 'truncate' : ''}`}>
            {mobile ? 'linkedin/fave-ejiofor' : 'linkedin.com/in/fave-ejiofor-a05bab260'}
          </a>
        </div>
        <div className={rowClass}>
          <span className={labelClass}>resume</span>
          <a href="/resume.pdf" download="resume.pdf" target="_blank" rel="noreferrer" className={linkClass}>/resume.pdf</a>
        </div>
      </div>

      <div className="mt-8 text-center w-full">
        <span className="font-caveat text-[19px] text-[#5c4d33]">— fin —</span>
      </div>
    </div>
  );
});


export const GuestBookLeft = React.memo(function GuestBookLeft({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`w-full h-full bg-parchment-left flex flex-col justify-center overflow-hidden relative
      ${mobile ? 'p-6' : 'rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]'}`}>

      {/* Ruled lines behind content */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 27px, rgba(139,107,78,0.12) 28px)',
        backgroundPosition: '0 48px',
      }} />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Rune mark */}
        <span className="font-cinzel text-[#a4302a]/40 text-4xl self-center" style={{ textShadow: '0 0 12px rgba(164,48,42,0.2)' }}>ᛗ</span>

        {/* Invitation */}
        <div className="text-center space-y-3">
          <h2 className={`font-cinzel font-semibold text-[#1a0f05] tracking-wide ${mobile ? 'text-xl' : 'text-2xl'}`}>
            Leave a Word
          </h2>
          <div className="w-16 h-[1px] bg-[#a4302a]/40 mx-auto" />
          <p className={`font-caveat text-[#3d2b1f] leading-relaxed max-w-[220px] mx-auto ${mobile ? 'text-base' : 'text-lg'}`}>
            &ldquo;Leave a word before you go. The grimoire remembers.&rdquo;
          </p>
        </div>

        {/* Quill illustration — simple SVG */}
        <div className="flex justify-center mt-4 opacity-25">
          <svg width="60" height="90" viewBox="0 0 60 90" fill="none">
            <line x1="8" y1="82" x2="52" y2="8" stroke="#5c4d33" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M52,8 Q38,22 18,50 L8,82 Q22,58 44,28 Z" fill="#8b6b4e" fillOpacity="0.6" stroke="#5c4d33" strokeWidth="0.8"/>
            <path d="M52,8 Q44,16 36,30 L8,82 Q18,62 34,36 Z" fill="#c9b783" fillOpacity="0.4"/>
            <line x1="8" y1="82" x2="52" y2="8" stroke="#3d2b1f" strokeWidth="0.8" strokeLinecap="round"/>
            <circle cx="8" cy="82" r="2" fill="#1a0f05"/>
          </svg>
        </div>

        <p className={`font-kalam text-[#5c4d33] text-center italic leading-relaxed ${mobile ? 'text-xs' : 'text-[11px]'}`}>
          Your name and message will be sent<br />privately to the author.
        </p>
      </div>
    </div>
  );
});

export function GuestBookRight({
  mobile = false,
  onClose,
  onContentChange,
}: {
  mobile?: boolean;
  onClose?: () => void;
  /** Called whenever the drawn/recognized message content changes — lets parent know if there's unsaved work */
  onContentChange?: (hasContent: boolean) => void;
}) {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [modalOpen, setModalOpen] = React.useState(false);
  // Handwriting is the signature touch; typing is always one click away
  // for keyboard, screen-reader and trackpad users.
  const [mode, setMode] = React.useState<'hand' | 'type'>('hand');
  const { pushCursor, popCursor } = useCursor();

  const handleTextChange = (text: string) => {
    setMessage(text);
    onContentChange?.(text.trim().length > 0);
  };

  const handleSend = async () => {
    // Empty message — show grimoire alert instead of silently failing
    if (!message.trim()) {
      setModalOpen(true);
      return;
    }
    if (status === 'sending' || status === 'sent') return;
    setStatus('sending');
    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: name.trim() || 'An anonymous traveller',
          message: message.trim(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );
      setStatus('sent');
      onContentChange?.(false);
      if (onClose) setTimeout(onClose, 2800);
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  return (
    <div className={`w-full h-full bg-parchment-right flex flex-col overflow-hidden relative
      ${mobile ? 'p-4' : 'rounded-r-md p-6 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]'}`}>

      <div className="relative z-10 flex flex-col h-full gap-3">

        {/* Name field */}
        <div className="relative z-20 flex items-center gap-2 border-b border-[#c9b783]/50 pb-1 shrink-0">
          <span className="font-kalam text-[#8b6b4e] text-[12px] shrink-0">From:</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.slice(0, 60))}
            placeholder="click here — type your name (optional)"
            disabled={status !== 'idle'}
            className="flex-1 bg-transparent font-caveat text-[#1a0f05] text-[16px] outline-none placeholder:text-[#8b6b4e]/40 cursor-text"
          />
        </div>

        {/* Write / type switch */}
        <div className="relative z-20 flex items-center gap-3 shrink-0 -mt-1" role="radiogroup" aria-label="How to write your message">
          {(['hand', 'type'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              disabled={status !== 'idle'}
              onClick={() => setMode(m)}
              className={`font-kalam text-[11px] transition-colors ${mode === m ? 'text-[#a4302a] underline underline-offset-4 decoration-dashed' : 'text-[#8b6b4e]/70 hover:text-[#1a0f05]'}`}
            >
              {m === 'hand' ? '✎ write by hand' : 'Aa type instead'}
            </button>
          ))}
        </div>

        {mode === 'hand' ? (
          /* Handwriting canvas — fills the writing area, IS the page */
          <div className="flex-1 min-h-0 relative overflow-hidden"
            onMouseEnter={() => pushCursor('brush')}
            onMouseLeave={() => popCursor()}
          >
            <React.Suspense fallback={
              <div className="absolute inset-0 bg-[#edeef0]/40 flex items-center justify-center">
                <span className="font-kalam text-[#8b6b4e] text-[11px] italic animate-pulse">loading…</span>
              </div>
            }>
              <HandwritingInputLazy
                initialText={message}
                onTextChange={handleTextChange}
                disabled={status !== 'idle'}
              />
            </React.Suspense>
          </div>
        ) : (
          <textarea
            value={message}
            onChange={(e) => handleTextChange(e.target.value.slice(0, 1000))}
            disabled={status !== 'idle'}
            aria-label="Your message"
            placeholder="Write your message…"
            autoFocus
            className="flex-1 min-h-0 resize-none rounded-sm bg-[#edeef0]/60 px-3 py-1 font-caveat text-[20px] text-[#1a0f05] leading-[32px] outline-none placeholder:text-[#8b6b4e]/40 focus-visible:outline-2 focus-visible:outline-[#d4af6a]"
            style={{
              backgroundImage: 'repeating-linear-gradient(180deg, transparent 0px, transparent 31px, rgba(160,160,175,0.3) 32px)',
              backgroundPosition: '0 4px',
            }}
          />
        )}

        {/* Footer */}
        <div className="relative z-20 flex items-center justify-between pt-2 border-t border-[#c9b783]/40 shrink-0">
          <span className="font-mono text-[9px] text-[#8b6b4e]/40">
            {message ? `"${message.slice(0, 28)}${message.length > 28 ? '…' : ''}"` : mode === 'hand' ? 'draw to compose' : 'type to compose'}
          </span>

          {status === 'sent' ? (
            <span className="font-caveat text-[#2eb36f] text-sm">
              ✦ Your words have been received.
            </span>
          ) : status === 'error' ? (
            <button onClick={() => setStatus('idle')} className="font-caveat text-[#a4302a] text-sm hover:underline">
              Something went wrong — try again.
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={status === 'sending'}
              className={`group flex items-center gap-2 font-cinzel text-[10px] tracking-widest uppercase transition-all duration-300
                ${status === 'idle' ? 'text-[#a4302a] hover:text-[#1a0f05]' : 'text-[#8b6b4e]/40 cursor-not-allowed'}`}
            >
              <span className={`w-7 h-7 rounded-full bg-[#a31a1a] flex items-center justify-center text-[10px] text-[#f0d089] shadow-md transition-all duration-300
                ${status === 'sending' ? 'scale-110 shadow-[0_0_12px_rgba(163,26,26,0.7)]' : 'group-hover:scale-110 group-hover:shadow-[0_0_8px_rgba(163,26,26,0.5)]'}`}>
                {status === 'sending' ? '◌' : '✦'}
              </span>
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          )}
        </div>
      </div>

      {/* Empty-submit alert modal */}
      <GrimoireModal
        open={modalOpen}
        variant="alert"
        rune="ᚹ"
        title="The page is blank"
        message="Your quill has not yet touched the parchment. Write your message before sealing it."
        confirmLabel="I shall write"
        onConfirm={() => setModalOpen(false)}
      />
    </div>
  );
}

const HandwritingInputLazy = React.lazy(() => import('./HandwritingInput'));
