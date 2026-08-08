'use client';
import { createContext, useContext, useState, useCallback, useRef } from 'react';

// ── Cursor state enum ────────────────────────────────────────────────
// idle       — wand floating, default
// lock       — hovering closed book cover: wand locks into magic circle, rotates
// reading    — book is open: wand becomes quill pen
// brush      — hovering handwriting canvas: quill becomes paintbrush
// point      — hovering buttons/links: wand tip becomes a stylized pointer
// rune       — hovering nav catalogue tabs: wand glows with a rune sigil
export type CursorState = 'idle' | 'lock' | 'reading' | 'brush' | 'point' | 'rune';

interface CursorCtx {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  pushCursor: (state: CursorState) => void;
  popCursor: () => void;
}

const CursorContext = createContext<CursorCtx>({
  cursorState: 'idle',
  setCursorState: () => {},
  pushCursor: () => {},
  popCursor: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>('idle');
  const stackRef = useRef<CursorState[]>([]);

  const pushCursor = useCallback((state: CursorState) => {
    stackRef.current.push(cursorState);
    setCursorState(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorState]);

  const popCursor = useCallback(() => {
    const prev = stackRef.current.pop() ?? 'idle';
    setCursorState(prev);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState, pushCursor, popCursor }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
