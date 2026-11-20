'use client';
import { useSyncExternalStore } from 'react';

/**
 * Graphics quality: "full" is the textured, curling grimoire; "lite" is the
 * plainer book (no paper textures, ageing, candlelight, particles, custom
 * cursor or curling pages) for slower devices.
 *
 * The choice lives on <html data-graphics="…"> so CSS can react to it, and in
 * localStorage once the visitor picks one. Until then it is chosen from the
 * device: little memory, few cores, or an OS request for reduced motion → lite.
 */
export type Graphics = 'full' | 'lite';

const KEY = 'grimoire:graphics';
const listeners = new Set<() => void>();
let current: Graphics | null = null;

function detect(): Graphics {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'full' || saved === 'lite') return saved;
  } catch { /* private mode */ }
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const fewCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return lowMemory || fewCores || reducedMotion ? 'lite' : 'full';
}

function apply(mode: Graphics) {
  current = mode;
  document.documentElement.dataset.graphics = mode;
  listeners.forEach(l => l());
}

export function getGraphics(): Graphics {
  if (typeof window === 'undefined') return 'full';
  if (current === null) apply(detect());
  return current!;
}

export function setGraphics(mode: Graphics) {
  try { localStorage.setItem(KEY, mode); } catch { /* private mode */ }
  apply(mode);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function useGraphics(): Graphics {
  return useSyncExternalStore(subscribe, getGraphics, () => 'full');
}
