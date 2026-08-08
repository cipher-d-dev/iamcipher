'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export type GrimoireModalVariant = 'alert' | 'confirm';

interface GrimoireModalProps {
  open: boolean;
  variant?: GrimoireModalVariant;
  rune?: string;
  title: string;
  message: string;
  /** Confirm button label (default: "Very well") */
  confirmLabel?: string;
  /** Cancel button label — only shown for variant="confirm" (default: "Not yet") */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function GrimoireModal({
  open,
  variant = 'alert',
  rune = 'ᛟ',
  title,
  message,
  confirmLabel = 'Very well',
  cancelLabel  = 'Not yet',
  onConfirm,
  onCancel,
}: GrimoireModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const runeRef     = useRef<HTMLSpanElement>(null);

  // Animate in when opened, animate out before calling handlers
  useEffect(() => {
    if (!open) return;
    const backdrop = backdropRef.current;
    const card     = cardRef.current;
    const runeEl   = runeRef.current;
    if (!backdrop || !card || !runeEl) return;

    // Entry
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    gsap.fromTo(card,
      { opacity: 0, y: 24, scale: 0.94 },
      { opacity: 1, y: 0,  scale: 1,    duration: 0.35, ease: 'back.out(1.4)', delay: 0.05 }
    );
    gsap.fromTo(runeEl,
      { opacity: 0, scale: 0.6, rotation: -20 },
      { opacity: 1, scale: 1,   rotation: 0,   duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: 0.1 }
    );
  }, [open]);

  const dismiss = (cb: () => void) => {
    const backdrop = backdropRef.current;
    const card     = cardRef.current;
    if (!backdrop || !card) { cb(); return; }
    gsap.to(card,     { opacity: 0, y: 16, scale: 0.95, duration: 0.2, ease: 'power2.in' });
    gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in', delay: 0.05,
      onComplete: cb });
  };

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(8,12,9,0.72)', backdropFilter: 'blur(2px)' }}
      onClick={() => { if (variant === 'alert') dismiss(onConfirm); }}
    >
      {/* Card */}
      <div
        ref={cardRef}
        className="relative flex flex-col items-center gap-4 px-8 py-7 mx-4 max-w-xs w-full"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #2a1f0e 0%, #1a1208 100%)',
          border: '1px solid rgba(212,175,106,0.35)',
          boxShadow: '0 0 40px rgba(164,48,42,0.18), 0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,106,0.1)',
        }}
      >
        {/* Corner rune marks */}
        <span className="absolute top-2 left-2.5 font-cinzel text-[#8b6b4e]/25 text-[10px]">ᚲ</span>
        <span className="absolute top-2 right-2.5 font-cinzel text-[#8b6b4e]/25 text-[10px]">ᚷ</span>
        <span className="absolute bottom-2 left-2.5 font-cinzel text-[#8b6b4e]/25 text-[10px]">ᛉ</span>
        <span className="absolute bottom-2 right-2.5 font-cinzel text-[#8b6b4e]/25 text-[10px]">ᛏ</span>

        {/* Top divider */}
        <div className="w-full flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af6a]/30 to-[#d4af6a]/30" />
          <div className="w-1 h-1 rounded-full bg-[#d4af6a]/40" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#d4af6a]/30 to-[#d4af6a]/30" />
        </div>

        {/* Central rune glyph */}
        <span
          ref={runeRef}
          className="font-cinzel text-4xl"
          style={{
            color: '#f0d089',
            textShadow: '0 0 18px rgba(240,208,137,0.7), 0 0 36px rgba(240,208,137,0.3)',
          }}
        >
          {rune}
        </span>

        {/* Title */}
        <h3
          className="font-cinzel text-[13px] tracking-[0.18em] uppercase text-center"
          style={{ color: '#e8d4a0', textShadow: '0 0 10px rgba(232,212,160,0.3)' }}
        >
          {title}
        </h3>

        {/* Message */}
        <p className="font-caveat text-[15px] text-center leading-snug text-[#a8b5a8]">
          {message}
        </p>

        {/* Bottom divider */}
        <div className="w-full flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af6a]/20 to-[#d4af6a]/20" />
          <div className="w-1 h-1 rounded-full bg-[#d4af6a]/30" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#d4af6a]/20 to-[#d4af6a]/20" />
        </div>

        {/* Buttons */}
        <div className={`flex gap-3 w-full ${variant === 'alert' ? 'justify-center' : 'justify-between'}`}>
          {variant === 'confirm' && onCancel && (
            <button
              onClick={() => dismiss(onCancel)}
              className="flex-1 font-cinzel text-[10px] tracking-widest uppercase py-2 px-3 transition-all duration-200
                border border-[#8b6b4e]/40 text-[#8b6b4e] hover:border-[#8b6b4e]/70 hover:text-[#c9b783]"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={() => dismiss(onConfirm)}
            className={`font-cinzel text-[10px] tracking-widest uppercase py-2 px-3 transition-all duration-200
              ${variant === 'confirm' ? 'flex-1' : 'px-8'}
              border border-[#a4302a]/60 text-[#f0d089] hover:border-[#a4302a] hover:bg-[#a4302a]/15
              shadow-[0_0_8px_rgba(164,48,42,0.2)] hover:shadow-[0_0_14px_rgba(164,48,42,0.4)]`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
