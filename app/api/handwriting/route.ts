import { NextRequest, NextResponse } from 'next/server';

// Proxies guestbook handwriting to Google Input Tools' recognizer.
//
// NOTE: this is an undocumented endpoint with no SLA. It can change or start
// refusing requests without notice, so the client treats it as best-effort
// and tells the writer when the ink could not be read.
const GOOGLE_HW_URL =
  'https://www.google.com/inputtools/request?ime=handwriting&app=gws&cs=1&hl=en';

// ── Abuse limits ───────────────────────────────────────────────────────
// A guestbook line is a few dozen strokes; anything far beyond that is not a
// person writing on the page.
const MAX_BODY_BYTES = 64 * 1024;
const MAX_STROKES = 400;
const MAX_POINTS = 20_000;

// Fixed-window limit per client IP. In-memory, so it is per server instance:
// enough to stop one client hammering the proxy, not a distributed attack.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 40;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  }
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

const isNum = (n: unknown) => typeof n === 'number' && Number.isFinite(n);

// Rebuild the request from validated fields only, so arbitrary payloads are
// never forwarded to Google.
function sanitize(body: unknown): object | null {
  if (typeof body !== 'object' || body === null) return null;
  const reqs = (body as { requests?: unknown }).requests;
  if (!Array.isArray(reqs) || reqs.length !== 1) return null;
  const r = reqs[0] as {
    ink?: unknown;
    writing_guide?: { writing_area_width?: unknown; writing_area_height?: unknown };
  };
  const ink = r.ink;
  if (!Array.isArray(ink) || ink.length === 0 || ink.length > MAX_STROKES) return null;

  let points = 0;
  for (const stroke of ink) {
    if (!Array.isArray(stroke) || stroke.length !== 3) return null;
    const [xs, ys, ts] = stroke as unknown[];
    if (!Array.isArray(xs) || !Array.isArray(ys) || !Array.isArray(ts)) return null;
    if (xs.length !== ys.length || xs.length !== ts.length) return null;
    points += xs.length;
    if (points > MAX_POINTS) return null;
    if (!xs.every(isNum) || !ys.every(isNum) || !ts.every(isNum)) return null;
  }

  const w = Number(r.writing_guide?.writing_area_width);
  const h = Number(r.writing_guide?.writing_area_height);
  if (!(w > 0 && w < 10_000 && h > 0 && h < 10_000)) return null;

  return {
    options: 'enable_pre_space',
    requests: [{
      writing_guide: { writing_area_width: Math.round(w), writing_area_height: Math.round(h) },
      ink,
      language: 'en',
      max_num_results: 1,
    }],
  };
}

export async function POST(req: NextRequest) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let payload: object | null = null;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }
    payload = sanitize(JSON.parse(raw));
  } catch {
    payload = null;
  }
  if (!payload) {
    return NextResponse.json({ error: 'Invalid ink payload' }, { status: 400 });
  }

  try {
    const res = await fetch(GOOGLE_HW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Google's endpoint only answers requests that look like they come
        // from its own pages.
        'Origin': 'https://www.google.com',
        'Referer': 'https://www.google.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Recognizer responded with ${res.status}` },
        { status: 502 },
      );
    }

    return NextResponse.json(await res.json());
  } catch (err) {
    console.error('[handwriting-proxy]', err);
    return NextResponse.json({ error: 'Recognizer unavailable' }, { status: 502 });
  }
}
