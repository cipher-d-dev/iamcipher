'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MagicCircle({ isActive }: { isActive: boolean }) {
  const circleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(circleRef.current, {
      rotateZ: 360,
      duration: 60,
      repeat: -1,
      ease: "none"
    });
  }, []);

  useGSAP(() => {
    gsap.to(circleRef.current, {
      scale: isActive ? 1.1 : 0.8,
      opacity: isActive ? 0.6 : 0.15,
      duration: 1.5,
      ease: "power2.out"
    });
  }, [isActive]);

  return (
    <div ref={circleRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" className="text-[#2eb36f] fill-transparent stroke-current stroke-2">
        <circle cx="500" cy="500" r="400" strokeDasharray="10 10" opacity="0.5" className="stroke-[#ffae00]/30" />
        <circle cx="500" cy="500" r="380" />
        <circle cx="500" cy="500" r="280" strokeDasharray="40 20" strokeWidth="4" />
        <circle cx="500" cy="500" r="270" opacity="0.3" />
        
        {/* Outer Hexagram */}
        <polygon points="500,120 829,690 171,690" strokeWidth="2" opacity="0.6" className="stroke-[#ffae00]/40" />
        <polygon points="500,880 171,310 829,310" strokeWidth="2" opacity="0.6" className="stroke-[#ffae00]/40" />
        
        {/* Inner Geometry */}
        <rect x="302" y="302" width="396" height="396" transform="rotate(45 500 500)" strokeWidth="2" opacity="0.4"/>
        
        {/* Runes / Arcane Text */}
        <text x="500" y="80" textAnchor="middle" className="text-3xl font-serif fill-[#ffae00] stroke-none text-glow-gold" style={{letterSpacing: '24px', opacity: 0.8}}>
          Δ Θ Λ Σ Ψ Ω ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ
        </text>
        <text x="500" y="945" textAnchor="middle" className="text-3xl font-serif fill-[#ffae00] stroke-none text-glow-gold" style={{letterSpacing: '24px', opacity: 0.8}}>
          ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ
        </text>
      </svg>
    </div>
  );
}
