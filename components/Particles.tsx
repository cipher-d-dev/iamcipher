'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Particles({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const particles = Array.from(containerRef.current.children);
    
    particles.forEach((p, i) => {
      gsap.set(p, {
        x: "random(-500, 500)",
        y: "random(-400, 400)",
        opacity: "random(0.1, 0.6)",
        scale: "random(0.2, 1.2)"
      });

      gsap.to(p, {
        y: "-=150",
        x: "+=random(-80, 80)",
        opacity: 0,
        duration: "random(3, 7)",
        repeat: -1,
        delay: "random(0, 4)",
        ease: "sine.inOut"
      });
    });
  }, []);

  useGSAP(() => {
    gsap.to(containerRef.current, {
      opacity: isActive ? 1 : 0.2,
      scale: isActive ? 1.1 : 1,
      duration: 1.5,
      ease: "power2.inOut"
    });
  }, [isActive]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 overflow-hidden flex items-center justify-center">
      {[...Array(40)].map((_, i) => (
        <div key={i} className={`absolute rounded-full shadow-[0_0_6px_2px_rgba(240,208,137,0.7)] ${
          i % 3 === 0 ? 'bg-[#f0d089]' : 'bg-[#6cdba3]'
        }`} style={{ width: '3px', height: '3px' }} />
      ))}
    </div>
  );
}
