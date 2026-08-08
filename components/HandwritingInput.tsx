'use client';
import { useRef, useEffect, useCallback, useState } from 'react';

interface HandwritingInputProps {
  onTextChange: (text: string) => void;
  disabled?: boolean;
}

interface Point { x: number; y: number; t: number; }
interface Stroke { points: Point[]; }

// The full accumulated text the user has written so far
// (we keep a simple append model — no line tracking needed)

// ── Canvas: draws ruled lines + live ink only (no text) ───────────────
function drawRules(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(160,160,175,0.25)';
  ctx.lineWidth = 1;
  for (let y = 28; y < h; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.restore();
}

function clearToBackground(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'transparent';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRules(ctx, canvas.offsetWidth, canvas.offsetHeight);
}

// ─────────────────────────────────────────────────────────────────────
async function recognizeStrokes(
  strokes: Stroke[], canvasW: number, canvasH: number,
): Promise<string> {
  const ink = strokes.map(s => [
    s.points.map(p => Math.round(p.x)),
    s.points.map(p => Math.round(p.y)),
    s.points.map(p => p.t),
  ]);
  const body = {
    device: navigator.userAgent,
    options: 'enable_pre_space',
    requests: [{
      writing_guide: { writing_area_width: canvasW, writing_area_height: canvasH },
      ink,
      language: 'en',
      max_num_results: 1,
    }],
  };
  const res = await fetch('/api/handwriting', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  if (data[0] !== 'SUCCESS') throw new Error('Recognition failed');
  return data[1]?.[0]?.[1]?.[0] ?? '';
}

// ─────────────────────────────────────────────────────────────────────
export default function HandwritingInput({ onTextChange, disabled = false }: HandwritingInputProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const isDown       = useRef(false);
  const strokesRef   = useRef<Stroke[]>([]);
  const activeRef    = useRef<Stroke | null>(null);
  const startTimeRef = useRef(0);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bezier smoothing: track previous point AND previous midpoint
  const prevPt  = useRef<{ x: number; y: number } | null>(null);
  const prevMid = useRef<{ x: number; y: number } | null>(null);

  const IDLE_MS = 900;

  const [recognizing, setRecognizing] = useState(false);
  const [text,        setText]        = useState('');
  // Undo: store previous text snapshots
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const textRef = useRef('');
  textRef.current = text;

  const syncUD = () => {
    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
  };

  // ── Canvas sizing ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      canvas.getContext('2d')!.scale(dpr, dpr);
      clearToBackground(canvas);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Undo / Redo ───────────────────────────────────────────────────
  const pushUndo = useCallback(() => {
    undoStack.current.push(textRef.current);
    redoStack.current = [];
    syncUD();
  }, []);

  const undo = useCallback(() => {
    if (!undoStack.current.length) return;
    redoStack.current.push(textRef.current);
    const prev = undoStack.current.pop()!;
    setText(prev);
    onTextChange(prev);
    strokesRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) clearToBackground(canvas);
    syncUD();
  }, [onTextChange]);

  const redo = useCallback(() => {
    if (!redoStack.current.length) return;
    undoStack.current.push(textRef.current);
    const next = redoStack.current.pop()!;
    setText(next);
    onTextChange(next);
    syncUD();
  }, [onTextChange]);

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [undo, redo]);

  // ── Pointer helpers ───────────────────────────────────────────────
  const xy = (e: React.PointerEvent) => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
  });

  const lw = (e: React.PointerEvent) => {
    // pressure: 0 for mouse down (not 0.5!), 0–1 for pen, ~0.5 for touch
    const p = e.pointerType === 'pen'
      ? e.pressure
      : e.pointerType === 'touch' ? 0.5 : 0.55;
    return 1 + p * p * 4; // 1px light → 5px heavy
  };

  // ── OCR ───────────────────────────────────────────────────────────
  const triggerRecognition = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || strokesRef.current.length === 0) return;
    const strokes = [...strokesRef.current];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    setRecognizing(true);
    recognizeStrokes(strokes, w, h)
      .then(word => {
        if (!word) return;
        pushUndo();
        // Append the new word to whatever was already there
        const next = textRef.current
          ? textRef.current + ' ' + word
          : word;
        setText(next);
        onTextChange(next);
        // Clear only the ink — previously recognized text stays in the DOM overlay
        strokesRef.current = [];
        clearToBackground(canvas);
      })
      .catch(err => console.error('Recognition error:', err))
      .finally(() => setRecognizing(false));
  }, [onTextChange, pushUndo]);

  // ── Pointer handlers ──────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault(); e.stopPropagation();
    canvasRef.current!.setPointerCapture(e.pointerId);
    isDown.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    const pos = xy(e);
    startTimeRef.current = Date.now();
    activeRef.current = { points: [{ ...pos, t: 0 }] };
    prevPt.current  = pos;
    prevMid.current = pos; // initialise midpoint at start

    // Dot for punctuation / taps
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.save();
    ctx.fillStyle = '#1a0f05';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, lw(e) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current || disabled) return;
    e.preventDefault(); e.stopPropagation();

    const cur  = xy(e);
    const prev = prevPt.current!;
    const pm   = prevMid.current!;

    activeRef.current?.points.push({ ...cur, t: Date.now() - startTimeRef.current });

    // Correct midpoint bezier smoothing:
    // moveTo(prevMid) → quadraticCurveTo(prev, currentMid)
    // This produces smooth curves through every sampled point.
    const curMid = { x: (prev.x + cur.x) / 2, y: (prev.y + cur.y) / 2 };

    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.save();
    ctx.strokeStyle = '#1a0f05';
    ctx.lineWidth   = lw(e);
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.beginPath();
    ctx.moveTo(pm.x, pm.y);
    ctx.quadraticCurveTo(prev.x, prev.y, curMid.x, curMid.y);
    ctx.stroke();
    ctx.restore();

    prevPt.current  = cur;
    prevMid.current = curMid;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDown.current) return;
    isDown.current = false;
    e.preventDefault(); e.stopPropagation();

    // Draw final segment to the exact lift point
    const cur  = xy(e);
    const prev = prevPt.current;
    const pm   = prevMid.current;
    if (prev && pm) {
      const ctx = canvasRef.current!.getContext('2d')!;
      ctx.save();
      ctx.strokeStyle = '#1a0f05';
      ctx.lineWidth   = lw(e);
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(pm.x, pm.y);
      ctx.quadraticCurveTo(prev.x, prev.y, cur.x, cur.y);
      ctx.stroke();
      ctx.restore();
    }

    prevPt.current  = null;
    prevMid.current = null;

    if (activeRef.current) {
      strokesRef.current.push(activeRef.current);
      activeRef.current = null;
    }
    timerRef.current = setTimeout(triggerRecognition, IDLE_MS);
  };

  // ── Clear ─────────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    pushUndo();
    strokesRef.current = [];
    setText('');
    onTextChange('');
    const c = canvasRef.current;
    if (c) clearToBackground(c);
  }, [onTextChange, pushUndo]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full" style={{ touchAction: 'none' }}>

      {/* Parchment base — canvas draws rules + live ink on top */}
      <div className="absolute inset-0 rounded-sm" style={{ background: '#edeef0' }} />

      {/* Committed recognized text — rendered as DOM so font is guaranteed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 1 }}>
        {text && (
          <div
            className="absolute font-caveat text-[#1a0f05]"
            style={{
              left: '10px',
              top: '8px',
              right: '10px',
              fontSize: '20px',
              fontStyle: 'italic',
              lineHeight: '32px',  // match the 32px rule spacing
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {text}
          </div>
        )}
      </div>

      {/* Canvas: rules + live ink only */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-sm"
        style={{ touchAction: 'none', cursor: disabled ? 'default' : 'crosshair', zIndex: 2 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      {/* Overlays */}
      {recognizing && (
        <div className="absolute top-2 right-3 pointer-events-none" style={{ zIndex: 3 }}>
          <span className="font-kalam text-[#8b6b4e]/60 text-[10px] italic animate-pulse">translating…</span>
        </div>
      )}

      {!text && !recognizing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none gap-1" style={{ zIndex: 3 }}>
          <span className="font-caveat text-[#8b6b4e]/30 text-[18px]">Write here…</span>
          <span className="font-kalam text-[#8b6b4e]/20 text-[10px] italic">pause to translate</span>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3" style={{ zIndex: 3 }}>
        <button onClick={undo} disabled={!canUndo || disabled}
          className="font-kalam text-[10px] text-[#5c4d33]/60 hover:text-[#1a0f05] disabled:opacity-20 transition-colors"
          style={{ pointerEvents: 'auto', cursor: !canUndo || disabled ? 'default' : 'pointer' }}>
          ↩ undo
        </button>
        <button onClick={redo} disabled={!canRedo || disabled}
          className="font-kalam text-[10px] text-[#5c4d33]/60 hover:text-[#1a0f05] disabled:opacity-20 transition-colors"
          style={{ pointerEvents: 'auto', cursor: !canRedo || disabled ? 'default' : 'pointer' }}>
          ↪ redo
        </button>
        <span className="flex-1" />
        <button onClick={clearAll} disabled={disabled}
          className="font-kalam text-[10px] text-[#a4302a]/50 hover:text-[#a4302a] disabled:opacity-20 transition-colors"
          style={{ pointerEvents: 'auto', cursor: disabled ? 'default' : 'pointer' }}>
          clear
        </button>
      </div>
    </div>
  );
}
