'use client';
import { useState, useEffect, useRef } from 'react';

export default function Typewriter({ text, active, delay = 0 }: { text: string, active: boolean, delay?: number }) {
  // Persists across renders — tracks how far we've typed
  const progressRef = useRef(0);
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Holds the active interval so we can clear it
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset only when the text itself changes (different page)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    progressRef.current = 0;
    setDisplayed('');
    setIsTyping(false);
  }, [text]);

  // Start/pause typing based on active — never resets progress
  useEffect(() => {
    if (!active) {
      // Pause: stop any running interval/timeout but keep progress
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
      setIsTyping(false);
      return;
    }

    // Already finished
    if (progressRef.current >= text.length) {
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        progressRef.current += 1;
        setDisplayed(text.substring(0, progressRef.current));
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
      timeoutRef.current = null;
      setIsTyping(false);
    };
  // Only re-run when active changes — text changes are handled by the effect above
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
