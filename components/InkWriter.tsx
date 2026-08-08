'use client';
import { useEffect, useRef, useState } from 'react';
import { letterPaths, fallbackPath, LetterPath } from './letterPaths';

// ── Layout constants ──────────────────────────────────────────────────
const CHAR_HEIGHT    = 80;   // viewBox height per glyph
const LINE_HEIGHT    = 88;   // vertical advance (glyph + leading)
const LEFT_MARGIN    = 8;
const MAX_LINE_WIDTH = 380;  // px before wrapping — matches page inner width

// Duration (ms) for drawing a single path stroke
const STROKE_DURATION = 120;
// Delay between consecutive path strokes within one character
const STROKE_STAGGER  = 60;

// ── Path length cache (avoids repeated getTotalLength calls) ──────────
const lengthCache = new Map<string, number>();

function getPathLength(d: string): number {
  if (lengthCache.has(d)) return lengthCache.get(d)!;
  // Create an offscreen SVG to measure
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.style.cssText = 'position:absolute;visibility:hidden;width:0;height:0;';
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  const len = path.getTotalLength();
  document.body.removeChild(svg);
  lengthCache.set(d, len);
  return len;
}

// ── Layout: map text string → positioned glyph list ──────────────────
interface GlyphSlot {
  char: string;
  letter: LetterPath;
  x: number;
  y: number;
  charIndex: number;
}

function layoutText(text: string): { slots: GlyphSlot[]; totalHeight: number } {
  const slots: GlyphSlot[] = [];
  let x = LEFT_MARGIN;
  let y = 0;
  let line = 0;

  for (let ci = 0; ci < text.length; ci++) {
    const ch = text[ci];
    const letter = letterPaths[ch] ?? fallbackPath;

    if (ch === '\n' || x + letter.width > MAX_LINE_WIDTH) {
      line++;
      x = LEFT_MARGIN;
      y = line * LINE_HEIGHT;
    }

    if (ch !== '\n') {
      slots.push({ char: ch, letter, x, y, charIndex: ci });
      x += letter.width;
    }
  }

  return { slots, totalHeight: y + CHAR_HEIGHT + 16 };
}

// ── Animated stroke path ──────────────────────────────────────────────
// Uses a ref-driven animation via requestAnimationFrame so it fires
// reliably regardless of CSS keyframe timing issues in SVG.
interface AnimatedPathProps {
  d: string;
  delay: number; // ms before animation starts
}

function AnimatedPath({ d, delay }: AnimatedPathProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    // Measure length synchronously (cached after first call per path)
    const length = getPathLength(d);

    // Set initial dash state
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;

    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    timeoutId = setTimeout(() => {
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / STROKE_DURATION, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.style.strokeDashoffset = `${length * (1 - eased)}`;
        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };
      rafId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [d, delay]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke="#2b1a08"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
    />
  );
}

// ── InkWriter ─────────────────────────────────────────────────────────
interface InkWriterProps {
  text: string;
  /** Characters before this index render static (already drawn). */
  animateFromIndex?: number;
  className?: string;
}

export default function InkWriter({ text, animateFromIndex = 0, className = '' }: InkWriterProps) {
  const { slots, totalHeight } = layoutText(text);

  let runningDelay = 0;

  return (
    <svg
      viewBox={`0 0 ${MAX_LINE_WIDTH} ${Math.max(totalHeight, LINE_HEIGHT)}`}
      width="100%"
      height={Math.max(totalHeight, LINE_HEIGHT)}
      className={className}
      style={{ overflow: 'visible', display: 'block' }}
      aria-label={`Calligraphy: ${text}`}
    >
      {slots.map((slot) => {
        const isNew = slot.charIndex >= animateFromIndex;
        const pathCount = slot.letter.paths.length;

        const charStartDelay = isNew ? runningDelay : 0;
        if (isNew) {
          runningDelay += pathCount * (STROKE_DURATION + STROKE_STAGGER);
        }

        if (pathCount === 0) return null; // space character

        return (
          <g key={slot.charIndex} transform={`translate(${slot.x}, ${slot.y})`}>
            {slot.letter.paths.map((d, pi) => {
              if (!isNew) {
                // Already drawn — render fully visible static path
                return (
                  <path
                    key={pi}
                    d={d}
                    fill="none"
                    stroke="#2b1a08"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              }

              const delay = charStartDelay + pi * STROKE_STAGGER;
              return (
                <AnimatedPath
                  key={`${slot.charIndex}-${pi}-${text.length}`}
                  d={d}
                  delay={delay}
                />
              );
            })}
          </g>
        );
      })}

      {/* Blinking quill nib cursor after last character */}
      {slots.length > 0 && (() => {
        const last = slots[slots.length - 1];
        const cx = last.x + last.letter.width + 2;
        const cy = last.y + 60;
        return (
          <g key="cursor" transform={`translate(${cx}, ${cy})`}>
            <line
              x1="0" y1="0" x2="0" y2="16"
              stroke="#a4302a"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ animation: 'ink-cursor-blink 1s steps(1) infinite' }}
            />
          </g>
        );
      })()}

      {/* Cursor blink keyframe — placed in document head style, not SVG style */}
      <defs>
        <style>{`@keyframes ink-cursor-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }`}</style>
      </defs>
    </svg>
  );
}
