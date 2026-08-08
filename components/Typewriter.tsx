'use client';
import { useState, useEffect, useRef } from 'react';

export default function Typewriter({
  text,
  active,
  delay = 0,
  playSound,
}: {
  text: string;
  active: boolean;
  delay?: number;
  /** Optional quill-scratch SFX — called throttled every 4 chars while typing */
  playSound?: () => void;
}) {
  const progressRef   = useRef(0);
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track last char index at which the sound fired
  const lastSoundAt   = useRef(-1);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    progressRef.current = 0;
    lastSoundAt.current = -1;
    setDisplayed('');
    setIsTyping(false);
  }, [text]);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current  = null;
      setIsTyping(false);
      return;
    }

    if (progressRef.current >= text.length) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        progressRef.current += 1;
        setDisplayed(text.substring(0, progressRef.current));

        // Throttled quill scratch — fire every 4 visible chars, skip whitespace runs
        if (
          playSound &&
          progressRef.current - lastSoundAt.current >= 4 &&
          text[progressRef.current - 1]?.trim() !== ''
        ) {
          lastSoundAt.current = progressRef.current;
          playSound();
        }

        if (progressRef.current >= text.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsTyping(false);
        }
      }, 30);
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current  = null;
      setIsTyping(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const showCursor = active && (isTyping || progressRef.current < text.length);

  return (
    <span className="font-mono text-[#8fd694] whitespace-pre-wrap leading-relaxed">
      {displayed}
      {showCursor && (
        <span className="inline-block w-[6px] h-[11px] bg-[#8fd694] align-[-1px] animate-[pulse_1s_steps(1)_infinite] ml-[1px]" />
      )}
    </span>
  );
}
