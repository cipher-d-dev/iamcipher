'use client';
import { useEffect, useRef, useCallback } from 'react';

type AudioOptions = {
  loop?: boolean;
  volume?: number;
};

/**
 * Returns a stable play() callback for a given audio src.
 * The Audio element is created once and reused (restarts on each call for SFX).
 */
export function useSound(src: string, { loop = false, volume = 1 }: AudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src, loop, volume]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // For SFX restart from beginning; for music just resume
    if (!loop) {
      audio.currentTime = 0;
    }
    audio.play().catch(() => {
      // Autoplay blocked — silently ignore
    });
  }, [loop]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v));
  }, []);

  const fadeOut = useCallback((durationMs = 1500) => {
    const audio = audioRef.current;
    if (!audio) return;
    const step = audio.volume / (durationMs / 50);
    const interval = setInterval(() => {
      if (!audioRef.current) { clearInterval(interval); return; }
      const next = audioRef.current.volume - step;
      if (next <= 0) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
        clearInterval(interval);
      } else {
        audioRef.current.volume = next;
      }
    }, 50);
  }, []);

  return { play, pause, setVolume, fadeOut, ref: audioRef };
}
