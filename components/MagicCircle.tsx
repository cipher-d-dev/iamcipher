'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MagicCircle({ isActive }: { isActive: boolean }) {
  const circleRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<SVGUseElement>(null);

  useGSAP(() => {
    gsap.to(circleRef.current, {
      rotateZ: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  // Inner text ring rotates counter to the outer circle for layered motion
  useGSAP(() => {
    gsap.to(innerTextRef.current, {
      rotateZ: -720,
      duration: 90,
      repeat: -1,
      ease: 'none',
      transformOrigin: '500px 500px',
    });
  }, []);

  useGSAP(() => {
    gsap.to(circleRef.current, {
      scale: isActive ? 1.1 : 0.8,
      opacity: isActive ? 0.6 : 0.15,
      duration: 1.5,
      ease: 'power2.out',
    });
  }, [isActive]);

  return (
    <div ref={circleRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" className="text-[#2eb36f] fill-transparent stroke-current stroke-2">
        <defs>
          {/* Outer text path — r=415, just outside the outermost circle */}
          <path
            id="outerTextCircle"
            d="M 500,500 m -415,0 a 415,415 0 1,1 830,0 a 415,415 0 1,1 -830,0"
          />
          {/* Mid text path — r=320, between the two inner circles */}
          <path
            id="midTextCircle"
            d="M 500,500 m -320,0 a 320,320 0 1,1 640,0 a 320,320 0 1,1 -640,0"
          />
          {/* Inner text path — r=230, inside the inner geometry */}
          <path
            id="innerTextCircle"
            d="M 500,500 m -230,0 a 230,230 0 1,1 460,0 a 230,230 0 1,1 -460,0"
          />
        </defs>

        {/* Structural circles */}
        <circle cx="500" cy="500" r="400" strokeDasharray="10 10" opacity="0.5" className="stroke-[#ffae00]/30" />
        <circle cx="500" cy="500" r="380" />
        <circle cx="500" cy="500" r="280" strokeDasharray="40 20" strokeWidth="4" />
        <circle cx="500" cy="500" r="270" opacity="0.3" />

        {/* Outer Hexagram */}
        <polygon points="500,120 829,690 171,690" strokeWidth="2" opacity="0.6" className="stroke-[#ffae00]/40" />
        <polygon points="500,880 171,310 829,310" strokeWidth="2" opacity="0.6" className="stroke-[#ffae00]/40" />

        {/* Inner Geometry */}
        <rect x="302" y="302" width="396" height="396" transform="rotate(45 500 500)" strokeWidth="2" opacity="0.4" />

        {/* Outer curved text — Greek & Elder Futhark runes */}
        <text
          className="stroke-none"
          style={{ fontSize: '18px', letterSpacing: '14px', fill: '#ffae00', opacity: 0.85 }}
        >
          <textPath href="#outerTextCircle" startOffset="0%">
            Δ · Θ · Λ · Σ · Ψ · Ω · ᚨ · ᚱ · ᚲ · ᚷ · ᚹ · ᚺ · ᚾ · ᛁ · ᛃ · ᛇ · ᛈ · ᛉ · ᛊ · ᛏ · ᛒ · ᛖ · ᛗ · ᛚ ·
          </textPath>
        </text>

        {/* Mid curved text — counter-rotating, smaller */}
        <g ref={innerTextRef}>
          <text
            className="stroke-none"
            style={{ fontSize: '13px', letterSpacing: '10px', fill: '#2eb36f', opacity: 0.7 }}
          >
            <textPath href="#midTextCircle" startOffset="0%">
              ᚠ · ᚢ · ᚦ · ᚩ · ᚱ · ᚳ · ᚷ · ᚹ · ᚻ · ᚾ · ᛁ · ᛄ · ᛇ · ᛈ · ᛉ · ᛋ · ᛏ · ᛒ · ᛖ · ᛗ · ᛚ · ᛝ · ᛞ · ᛟ ·
            </textPath>
          </text>
        </g>

        {/* Inner curved text — smallest ring */}
        <text
          className="stroke-none"
          style={{ fontSize: '11px', letterSpacing: '8px', fill: '#ffae00', opacity: 0.5 }}
        >
          <textPath href="#innerTextCircle" startOffset="50%">
            ✦ · Ω · Ψ · Φ · Ξ · Δ · ᛟ · ᛞ · ᛝ · ᛚ · ᛗ · ᛖ · ✦ · ᛒ · ᛏ · ᛋ · ᛉ · ᛈ · ᛇ · ᛄ · ᛁ ·
          </textPath>
        </text>
      </svg>
    </div>
  );
}
