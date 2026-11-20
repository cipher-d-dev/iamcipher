'use client';
/**
 * Curling page turns.
 *
 * Browsers can't bend a DOM element, so while a leaf turns we hide its live
 * faces and draw it as a chain of thin vertical strips, each hinged to the
 * last, painted with snapshots of the two faces. Giving each hinge a small
 * extra rotation rolls the paper into a curve:
 *   - the free edge lags behind the spine as the page travels,
 *   - the bend is strongest mid-turn and vanishes as the page lands,
 *   - each strip is lit by its own angle, so the curve reads as rounded.
 *
 * Snapshots are taken with html-to-image in idle time. If a face has no
 * snapshot yet the book simply uses the rigid flip for that turn.
 */
import { toCanvas, getFontEmbedCSS } from 'html-to-image';

const PAGE_W = 400;
const PAGE_H = 600;
const STRIPS = 18;
const STRIP_W = PAGE_W / STRIPS;
/** Total bend (degrees) at mid-turn, spread across the hinges */
const MAX_BEND = 78;
/** The page's resting angle on the left (leaves rest at -175°, not -180°) */
const REST = 175;

const TRANSPARENT_PX = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

// ── Snapshot cache ─────────────────────────────────────────────────────
export class SnapshotCache {
  private urls = new Map<string, string>();
  private queue: { key: string; el: HTMLElement }[] = [];
  private busy = false;
  private fontCSS: Promise<string> | null = null;
  private disposed = false;
  private holdUntil = 0;

  get(key: string) { return this.urls.get(key) ?? null; }

  /** Capturing is heavy main-thread work: never do it while a page moves. */
  hold(ms: number) {
    this.holdUntil = Math.max(this.holdUntil, performance.now() + ms);
  }

  /** Queue faces to (re)capture; earlier entries are captured first. */
  request(items: { key: string; el: HTMLElement | null }[], front = false) {
    const fresh = items.filter((i): i is { key: string; el: HTMLElement } => !!i.el);
    const keys = new Set(fresh.map(i => i.key));
    this.queue = this.queue.filter(q => !keys.has(q.key));
    this.queue = front ? [...fresh, ...this.queue] : [...this.queue, ...fresh];
    this.pump();
  }

  dispose() {
    this.disposed = true;
    this.queue = [];
    this.urls.forEach(u => URL.revokeObjectURL(u));
    this.urls.clear();
  }

  private idle(cb: () => void) {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 400 });
    else setTimeout(cb, 30);
  }

  private pump() {
    if (this.busy || this.disposed || !this.queue.length) return;
    const wait = this.holdUntil - performance.now();
    if (wait > 0) { setTimeout(() => this.pump(), wait + 50); return; }
    this.busy = true;
    this.idle(async () => {
      if (performance.now() < this.holdUntil) { this.busy = false; this.pump(); return; }
      const job = this.queue.shift();
      try {
        if (job && !this.disposed) await this.capture(job.key, job.el);
      } catch (err) {
        // A failed capture just means this face turns rigidly
        console.debug('[page-curl] snapshot failed', job?.key, err);
      } finally {
        this.busy = false;
        this.pump();
      }
    });
  }

  private async capture(key: string, el: HTMLElement) {
    if (!this.fontCSS) this.fontCSS = getFontEmbedCSS(el).catch(() => '');
    const fontEmbedCSS = await this.fontCSS;
    const canvas = await toCanvas(el, {
      width: PAGE_W,
      height: PAGE_H,
      pixelRatio: Math.min(2, window.devicePixelRatio || 1) * 1.25,
      fontEmbedCSS,
      cacheBust: false,
      imagePlaceholder: TRANSPARENT_PX,
      // The face's own 3D transform / hidden state must not reach the image
      style: { transform: 'none', visibility: 'visible', pointerEvents: 'none' },
      // Leave out the live shading layers and the corner buttons
      filter: (n) => {
        if (!(n instanceof HTMLElement)) return true;
        return !('leafShade' in n.dataset) && !('leafCast' in n.dataset) && !n.classList.contains('page-corner');
      },
    });
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.9));
    if (!blob || this.disposed) return;
    const prev = this.urls.get(key);
    this.urls.set(key, URL.createObjectURL(blob));
    if (prev) URL.revokeObjectURL(prev);
  }
}

// ── Strip renderer ─────────────────────────────────────────────────────
interface Strip { hinge: HTMLDivElement; front: HTMLDivElement; back: HTMLDivElement; frontShade: HTMLDivElement; backShade: HTMLDivElement }

export class CurlRenderer {
  readonly root: HTMLDivElement;
  private strips: Strip[] = [];
  busy = false;
  private forward = true;

  constructor(parent: HTMLElement) {
    const root = document.createElement('div');
    root.setAttribute('aria-hidden', 'true');
    Object.assign(root.style, {
      position: 'absolute', left: '0', top: '0', width: `${PAGE_W}px`, height: `${PAGE_H}px`,
      transformStyle: 'preserve-3d', pointerEvents: 'none', display: 'none',
    });
    this.root = root;

    let parentEl: HTMLElement = root;
    for (let k = 0; k < STRIPS; k++) {
      const hinge = document.createElement('div');
      Object.assign(hinge.style, {
        position: 'absolute', left: k === 0 ? '0' : `${STRIP_W}px`, top: '0',
        width: `${STRIP_W}px`, height: `${PAGE_H}px`,
        transformStyle: 'preserve-3d', transformOrigin: '0 50%',
      });
      // Faces are a hair wider than the strip so hinges never show seams
      const mkFace = (back: boolean) => {
        const f = document.createElement('div');
        Object.assign(f.style, {
          position: 'absolute', top: '0', left: '-0.4px', width: `${STRIP_W + 0.8}px`, height: '100%',
          backfaceVisibility: 'hidden', backgroundRepeat: 'no-repeat',
          backgroundSize: `${PAGE_W}px ${PAGE_H}px`,
          backgroundPosition: back ? `${-(PAGE_W - (k + 1) * STRIP_W) - 0.4}px 0` : `${-k * STRIP_W + 0.4}px 0`,
          transform: back ? 'rotateY(180deg)' : 'none',
        });
        const shade = document.createElement('div');
        Object.assign(shade.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
        f.appendChild(shade);
        return { f, shade };
      };
      const fr = mkFace(false), bk = mkFace(true);
      hinge.append(fr.f, bk.f);
      parentEl.appendChild(hinge);
      parentEl = hinge;
      this.strips.push({ hinge, front: fr.f, back: bk.f, frontShade: fr.shade, backShade: bk.shade });
    }
    parent.appendChild(root);
  }

  /** Paint the strips with a leaf's faces and show them in its place. */
  begin(frontUrl: string, backUrl: string, z: number, forward: boolean) {
    this.busy = true;
    this.forward = forward;
    for (const s of this.strips) {
      s.front.style.backgroundImage = `url("${frontUrl}")`;
      s.back.style.backgroundImage = `url("${backUrl}")`;
    }
    this.root.style.transform = `translateZ(${z}px)`;
    this.root.style.display = 'block';
  }

  end() {
    this.root.style.display = 'none';
    this.busy = false;
  }

  /**
   * Draw the leaf at turn angle `a` (0 = lying on the right, REST = lying on
   * the left). `a` may overshoot a little at the end for the settle wobble.
   */
  render(a: number, z: number) {
    const t = a / REST;                          // 0 → 1 across the turn
    const bend = MAX_BEND * Math.sin(Math.PI * t); // goes slightly negative on overshoot → wobble
    // The free edge trails the motion: turning forward the outer strips stay
    // behind (less rotated); turning back they trail the other way.
    const dir = this.forward ? 1 : -1;
    // The spine leads by half the bend so the page's middle tracks `a`.
    const lead = Math.min(179, Math.max(0, a + dir * bend * 0.5));
    this.root.style.transform = `translateZ(${z}px)`;

    // Bend grows toward the free edge: paper curls most where it isn't held
    const weightSum = (STRIPS - 1) * STRIPS / 2;
    let abs = lead;
    for (let k = 0; k < STRIPS; k++) {
      const s = this.strips[k];
      const step = k === 0 ? lead : -dir * bend * (k / weightSum);
      if (k > 0) abs += step;
      s.hinge.style.transform = k === 0
        ? `rotateY(${-lead}deg)`
        : `rotateY(${-step}deg)`;
      this.light(s, abs);
    }
  }

  /** Light a strip by its absolute angle: candle from the upper left. */
  private light(s: Strip, abs: number) {
    const rad = (d: number) => (d * Math.PI) / 180;
    if (abs < 90) {
      // Front face visible: darkens as it stands up, catches a sheen ~30°
      const dark = Math.max(0, Math.min(0.55, 0.5 * Math.abs(Math.sin(rad(abs))) ** 1.4));
      const sheen = Math.max(0, Math.cos(rad(abs - 32))) ** 24 * 0.28;
      s.frontShade.style.background = `linear-gradient(rgba(255,244,214,${sheen.toFixed(3)}), rgba(255,244,214,${sheen.toFixed(3)})), rgba(20,10,0,${dark.toFixed(3)})`;
    } else {
      const facing = 180 - abs;
      const dark = Math.max(0, Math.min(0.5, 0.45 * Math.abs(Math.sin(rad(facing))) ** 1.4));
      const sheen = Math.max(0, Math.cos(rad(facing - 28))) ** 24 * 0.22;
      s.backShade.style.background = `linear-gradient(rgba(255,244,214,${sheen.toFixed(3)}), rgba(255,244,214,${sheen.toFixed(3)})), rgba(20,10,0,${dark.toFixed(3)})`;
    }
  }

  destroy() { this.root.remove(); }
}

/**
 * Ease for a curled turn: a slow lift, a quick sweep, then the paper lands
 * slightly past its rest and settles back with a small, damped wobble.
 */
export function curlEase(t: number): number {
  const LAND = 0.84;
  if (t < LAND) {
    const u = t / LAND;
    return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; // cubic in-out
  }
  const u = (t - LAND) / (1 - LAND);
  return 1 + 0.035 * Math.sin(u * Math.PI * 2) * (1 - u);
}
