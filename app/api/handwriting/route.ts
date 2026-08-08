import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_HW_URL =
  'https://www.google.com/inputtools/request?ime=handwriting&app=gws&cs=1&hl=en';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(GOOGLE_HW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Spoof a browser origin so Google accepts the request
        'Origin': 'https://www.google.com',
        'Referer': 'https://www.google.com/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google API responded with ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[handwriting-proxy]', err);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
