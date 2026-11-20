'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Book from '@/components/Book';
import MobileReader from '@/components/MobileReader';
import MobileCover from '@/components/MobileCover';
import MagicCircle from '@/components/MagicCircle';
import Particles from '@/components/Particles';
import DustMotes from '@/components/DustMotes';
import MagicalLoader from '@/components/MagicalLoader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { PROJECTS } from '@/components/PageContents';
import SecretSeal from '@/components/SecretSeal';
import { useGraphics, setGraphics } from '@/lib/graphics';

const MUTE_KEY = 'grimoire:muted';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [appState, setAppState] = useState<'closed' | 'opening' | 'reading' | 'closing' | 'summary'>('closed');
  const [muted, setMuted] = useState(false);
  // Restore the visitor's mute choice after hydration (server can't know it)
  useEffect(() => {
    try { if (localStorage.getItem(MUTE_KEY) === '1') setMuted(true); } catch { /* private mode */ }
  }, []);
  const reduceMotion = useReducedMotion();
  const graphics = useGraphics();
  // Decorative motion and light: only in full graphics, never for reduced motion
  const fancy = graphics === 'full' && !reduceMotion;
  const [sigilCharging, setSigilCharging] = useState(false);
  const isMobile = useIsMobile();
  // Phone: where the cover's first page sits, so the reader can grow out of
  // it and shrink back into it; and whether the cover should swing shut
  const coverRectRef = useRef<DOMRect | null>(null);
  const [coverStartsOpen, setCoverStartsOpen] = useState(false);

  // Phones: a shared link like /#projects opens the reader straight away
  useEffect(() => {
    if (!loaded || !isMobile || appState !== 'closed') return;
    const id = window.location.hash.slice(1);
    if (['origin', 'experience', 'tools', 'projects', 'contact', 'guestbook'].includes(id)) setAppState('reading');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, isMobile]);

  // Fire a 200ms sigil charge pulse on each page turn
  const handlePageTurn = useCallback(() => {
    setSigilCharging(true);
    setTimeout(() => setSigilCharging(false), 200);
  }, []);

  // ── Audio refs ──────────────────────────────────────────────
  const themeRef  = useRef<HTMLAudioElement | null>(null);
  const turnRef   = useRef<HTMLAudioElement | null>(null);
  const clickRef  = useRef<HTMLAudioElement | null>(null);
  const multiRef  = useRef<HTMLAudioElement | null>(null);
  // Rustle ambience — looping parchment bed, active only while reading
  // Synthesised parchment rustle, /public/rustle.mp3
  const rustleRef = useRef<HTMLAudioElement | null>(null);
  // Quill scratch — sparse SFX for Typewriter reveals
  // Synthesised quill scratch, /public/quill.mp3
  const quillRef  = useRef<HTMLAudioElement | null>(null);

  // ── Candlelight flicker ref ──────────────────────────────────
  const candleRef = useRef<HTMLDivElement>(null);
  // Warm light falling *onto* the book (soft-light blend above it)
  const candleLightRef = useRef<HTMLDivElement>(null);

  // Irregular flicker — chained tweens with randomised duration/opacity
  // so it reads as actual flame movement, not a breathing UI element
  useEffect(() => {
    const el = candleRef.current;
    const light = candleLightRef.current;
    if (!el || !fancy) return;

    let killed = false;
    const flicker = () => {
      if (killed) return;
      // Each step picks a random target opacity and a random duration
      // weighted toward short bursts with occasional longer holds
      const targetOpacity = 0.14 + Math.random() * 0.1;  // 0.14 – 0.24
      const duration = 0.08 + Math.random() * 0.55;       // 80ms – 630ms
      gsap.to(el, {
        opacity: targetOpacity,
        duration,
        ease: 'none',
        onComplete: flicker,
      });
      // The light on the pages breathes with the same flame
      if (light) gsap.to(light, { opacity: 0.6 + (targetOpacity - 0.14) * 3.5, duration, ease: 'none' });
    };

    // Kick off with a small initial delay so it doesn't snap on mount
    const t = setTimeout(flicker, 200);
    return () => {
      killed = true;
      clearTimeout(t);
      gsap.killTweensOf(el);
      if (light) gsap.killTweensOf(light);
    };
  }, [fancy]);

  // Initialise audio elements once
  useEffect(() => {
    const theme = new Audio('/fantasythemesong.mp3');
    theme.loop   = true;
    // 2.5 MB — don't download it until the visitor actually opens the book
    theme.preload = 'none';
    theme.volume = 0.35;
    themeRef.current = theme;

    const turn = new Audio('/turnpage.mp3');
    turn.volume = 0.7;
    turnRef.current = turn;

    const click = new Audio('/fantastyclicksound.mp3');
    click.volume = 0.6;
    clickRef.current = click;

    const multi = new Audio('/multiplepages.mp3');
    multi.volume = 0.7;
    multiRef.current = multi;

    // Rustle ambience — looping, very low volume, fades in/out with reading state
    const rustle = new Audio('/rustle.mp3');
    rustle.loop   = true;
    rustle.volume = 0;   // starts silent; ramped up when reading begins
    rustleRef.current = rustle;

    // Quill scratch — very short SFX, played throttled during Typewriter
    const quill = new Audio('/quill.mp3');
    quill.volume = 0.35;
    quillRef.current = quill;

    return () => {
      theme.pause();
      turn.pause();
      click.pause();
      multi.pause();
      rustle.pause();
      quill.pause();
    };
  }, []);

  // Start theme on first user gesture after loading — autoplay policy blocks it otherwise
  const themePlayed = useRef(false);
  const startTheme = useCallback(() => {
    if (themePlayed.current || !themeRef.current) return;
    themePlayed.current = true;
    // If the browser blocks it (no user gesture yet, e.g. a deep link opened
    // the book), allow the next real click to try again.
    themeRef.current.play().catch(() => { themePlayed.current = false; });
  }, []);

  // Sync mute state (and remember it for next visit)
  useEffect(() => {
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch { /* private mode */ }
    [themeRef, turnRef, clickRef, multiRef, rustleRef, quillRef].forEach(r => {
      if (r.current) r.current.muted = muted;
    });
  }, [muted]);

  // ── Sound helpers (stable refs so children don't re-render) ──

  // Weighted page turn — pitch-shifts the single turnpage.mp3 via playbackRate:
  //   leafIndex 0        = cover (heavy leather thud)   → rate 0.72
  //   leafIndex 1–2      = flyleaves (medium swish)     → rate 0.88
  //   leafIndex 3+       = interior pages (crisp paper) → rate 1.08
  const playTurnWeighted = useCallback((leafIndex: number) => {
    const a = turnRef.current;
    if (!a) return;
    if      (leafIndex === 0)      a.playbackRate = 0.72;
    else if (leafIndex <= 2)       a.playbackRate = 0.88;
    else                           a.playbackRate = 1.08;
    a.currentTime = 0;
    a.play().catch(() => {});
    // Duck rustle briefly during the turn
    const rustle = rustleRef.current;
    if (rustle && rustle.volume > 0) {
      const prev = rustle.volume;
      rustle.volume = Math.max(0, prev * 0.3);
      setTimeout(() => { if (rustleRef.current) rustleRef.current.volume = prev; }, 900);
    }
  }, []);

  const playClick = useCallback(() => {
    const a = clickRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  }, []);

  const playMulti = useCallback(() => {
    const a = multiRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  }, []);

  // Quill scratch — throttled by Typewriter, passed as prop
  const playQuill = useCallback(() => {
    const a = quillRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  }, []);

  // Rustle ambience — fade in when reading, fade out otherwise
  const rustleFadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRustle = useCallback((targetVol: number) => {
    const rustle = rustleRef.current;
    if (!rustle) return;
    if (rustleFadeRef.current) clearInterval(rustleFadeRef.current);
    // Start playing if going up from 0
    if (targetVol > 0 && rustle.paused) {
      rustle.play().catch(() => {});
    }
    const step = (targetVol - rustle.volume) / 30;
    rustleFadeRef.current = setInterval(() => {
      if (!rustleRef.current) return;
      const next = rustleRef.current.volume + step;
      if ((step > 0 && next >= targetVol) || (step < 0 && next <= targetVol)) {
        rustleRef.current.volume = Math.max(0, targetVol);
        if (targetVol === 0) rustleRef.current.pause();
        clearInterval(rustleFadeRef.current!);
      } else {
        rustleRef.current.volume = Math.max(0, next);
      }
    }, 50);
  }, []);

  // Fade rustle in/out with reading state
  useEffect(() => {
    if (appState === 'reading') {
      fadeRustle(0.12);
    } else {
      fadeRustle(0);
    }
  }, [appState, fadeRustle]);

  if (appState === 'summary') {
    return (
      <main key="summary" className="min-h-screen bg-[#080c09] text-[#e8d9ae] p-8 md:p-16 font-serif selection:bg-[#2eb36f] selection:text-[#080c09] overflow-auto">
        <button onClick={() => setAppState('closed')} className="mb-12 text-[#2eb36f] hover:text-[#f0d089] transition-colors font-mono text-sm border-b border-transparent hover:border-[#f0d089]">
          ← Return to the Grimoire
        </button>
        <div className="max-w-2xl mx-auto space-y-12">
          <header>
            <h1 className="text-4xl md:text-5xl font-cinzel text-[#f0d089] mb-4">Favour Ejiofor (Cipher)</h1>
            <p className="text-lg text-[#a8b5a8] italic">Digital Alchemist & Systems Engineer</p>
          </header>

          <section>
            <h2 className="text-2xl font-cinzel border-b border-[#2eb36f]/30 pb-2 mb-6 text-[#f0d089]">Experience</h2>
            <ul className="space-y-6">
              <li>
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl text-[#2eb36f] font-mono">Senior Fullstack Engineer</h3>
                  <span className="text-[#a8b5a8] text-sm">2025 - Present | ISBMPA</span>
                </div>
                <p className="text-[#a8b5a8] leading-relaxed">Managed web infrastructure, domain configurations, and media gallery hosting using Appwrite while optimizing data fetching limits and backend performance.</p>
              </li>
              <li>
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl text-[#2eb36f] font-mono">Entry Deep Learning Trainee</h3>
                  <span className="text-[#a8b5a8] text-sm">2026 | NVIDIA x UNILAG</span>
                </div>
                <p className="text-[#a8b5a8] leading-relaxed">Trained in deep learning fundamentals and neural network architectures through hands-on technical workshops and model optimization exercises.</p>
              </li>
              <li>
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl text-[#2eb36f] font-mono">CTF Winner</h3>
                  <span className="text-[#a8b5a8] text-sm">2026 | Go2Cyber</span>
                </div>
                <p className="text-[#a8b5a8] leading-relaxed">Secured first place in a competitive capture-the-flag tournament by exploiting system vulnerabilities and executing real-time threat analysis under timed conditions.</p>
              </li>
              <li>
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl text-[#2eb36f] font-mono">Software Engineering Intern</h3>
                  <span className="text-[#a8b5a8] text-sm">2024 | HNG</span>
                </div>
                <p className="text-[#a8b5a8] leading-relaxed">Collaborated with cross-functional teams to build, test, and ship full-stack web features in a fast-paced agile development environment.</p>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-cinzel border-b border-[#2eb36f]/30 pb-2 mb-6 text-[#f0d089]">Tools & Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl text-[#2eb36f] font-mono mb-4">Frontend</h3>
                <ul className="space-y-3 text-[#a8b5a8]">
                  <li className="flex items-center gap-2"><span className="text-[#f0d089] w-6">⚛</span> React, React Native, Vite</li>
                  <li className="flex items-center gap-2"><span className="text-[#f0d089] w-6">✧</span> Tailwind CSS</li>
                  <li className="flex items-center gap-2"><span className="text-[#f0d089] w-6">◨</span> Android Studio</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl text-[#2eb36f] font-mono mb-4">Backend</h3>
                <ul className="space-y-3 text-[#a8b5a8]">
                  <li className="flex items-center gap-2"><span className="text-[#f0d089] w-6">⚡</span> Node.js, Express, TS</li>
                  <li className="flex items-center gap-2"><span className="text-[#f0d089] w-6">🗄</span> PostgreSQL, Appwrite, Redis</li>
                  <li className="flex items-center gap-2"><span className="text-[#f0d089] w-6">☁</span> Docker, Linux, CI/CD</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-cinzel border-b border-[#2eb36f]/30 pb-2 mb-6 text-[#f0d089]">Projects</h2>
            <ul className="space-y-8">
              {PROJECTS.map((proj) => (
                <li key={proj.name}>
                  <div className="flex items-center gap-4 mb-1 flex-wrap">
                    <a href={proj.github} target="_blank" rel="noreferrer" className="text-xl text-[#2eb36f] hover:underline font-mono">{proj.name}</a>
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noreferrer" className="text-xs border border-[#2eb36f] text-[#2eb36f] hover:bg-[#2eb36f]/10 px-2 py-0.5 rounded transition-colors">Live</a>
                    )}
                  </div>
                  <p className="text-[#5c7a63] text-xs font-mono mb-2">{proj.year} · {proj.stack}</p>
                  <p className="text-[#a8b5a8] leading-relaxed">{proj.blurb}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-cinzel border-b border-[#2eb36f]/30 pb-2 mb-6 text-[#f0d089]">Contact</h2>
            <div className="flex flex-col gap-4 font-mono text-[15px]">
              <a href="mailto:faveejiofor2009@gmail.com" className="hover:text-[#2eb36f] transition-colors flex items-center gap-4">
                <span className="text-[#5c4d33] w-20">email</span> faveejiofor2009@gmail.com
              </a>
              <a href="https://github.com/cipher-d-dev" target="_blank" rel="noreferrer" className="hover:text-[#2eb36f] transition-colors flex items-center gap-4">
                <span className="text-[#5c4d33] w-20">github</span> github.com/cipher-d-dev
              </a>
              <a href="https://www.linkedin.com/in/fave-ejiofor-a05bab260" target="_blank" rel="noreferrer" className="hover:text-[#2eb36f] transition-colors flex items-center gap-4">
                <span className="text-[#5c4d33] w-20">linkedin</span> linkedin.com/in/fave-ejiofor-a05bab260
              </a>
              <a href="/resume.pdf" download="resume.pdf" target="_blank" rel="noreferrer" className="hover:text-[#2eb36f] transition-colors flex items-center gap-4 mt-2">
                <span className="text-[#5c4d33] w-20">resume</span> /resume.pdf
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <>
      {!loaded && <MagicalLoader onDone={() => setLoaded(true)} />}
      <main
        key="book"
        className="relative w-screen h-screen overflow-hidden bg-[#080c09] flex items-center justify-center select-none font-serif"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease-in' }}
      >
        {/* Background ambient lighting */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,#112b1c_0%,transparent_70%)] pointer-events-none" />

        {/* Candlelight flicker — warm amber radial bloom, irregular GSAP opacity */}
        <div
          ref={candleRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.18,
            background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,174,80,0.22) 0%, rgba(255,140,40,0.08) 45%, transparent 75%)',
          }}
        />

        {/* Graphics quality switch (desktop; the phone reader is already light) */}
        {!isMobile && (
          <button
            type="button"
            onClick={() => setGraphics(graphics === 'full' ? 'lite' : 'full')}
            title={graphics === 'full' ? 'Switch to lite graphics (faster)' : 'Switch to full graphics'}
            aria-label={graphics === 'full' ? 'Graphics: full. Switch to lite' : 'Graphics: lite. Switch to full'}
            className="absolute bottom-6 right-16 z-50 h-8 px-3 flex items-center gap-1.5 rounded-full border border-[#2eb36f]/20 bg-[#080c09]/70 text-[#2eb36f]/60 hover:text-[#2eb36f] hover:border-[#2eb36f]/50 transition-all duration-200 font-mono text-[11px] tracking-wider"
          >
            <span aria-hidden>{graphics === 'full' ? '✦' : '◇'}</span>
            {graphics === 'full' ? 'full' : 'lite'}
          </button>
        )}

        {/* Mute toggle */}
        <button
          onClick={() => setMuted(m => !m)}
          title={muted ? 'Unmute' : 'Mute'}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          aria-pressed={muted}
          className={`absolute ${isMobile && appState !== 'closed' ? 'top-[6px] right-16' : 'bottom-6 right-6'} z-50 w-8 h-8 flex items-center justify-center rounded-full border border-[#2eb36f]/20 bg-[#080c09]/70 text-[#2eb36f]/60 hover:text-[#2eb36f] hover:border-[#2eb36f]/50 transition-all duration-200 text-sm`}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <SecretSeal onReveal={playMulti} />

        {isMobile ? (
          /* ── Mobile: full-screen parchment reader ── */
          <>
            {(appState === 'closed' || appState === 'closing') && (
              <MobileCover
                onTap={() => { startTheme(); playClick(); }}
                onOpen={(rect) => { coverRectRef.current = rect; setAppState('reading'); }}
                startOpen={coverStartsOpen}
                holdOpen={appState === 'closing'}
                onSettled={() => setCoverStartsOpen(false)}
              />
            )}

            {(appState === 'reading' || appState === 'opening' || appState === 'closing') && (
              <MobileReader
                fromRect={coverRectRef.current}
                onClose={() => setAppState('closed')}
                onStateChange={(state) => {
                  // Closing: put the open cover in place underneath first
                  if (state === 'closing') setCoverStartsOpen(true);
                  setAppState(state);
                }}
                playTurn={() => playTurnWeighted(3)}
                playClick={playClick}
                playMulti={playMulti}
              />
            )}

            {fancy && <>
              <MagicCircle isActive={appState !== 'closed'} charging={sigilCharging} />
              <Particles isActive={appState !== 'closed'} />
              <DustMotes isActive={appState === 'reading'} />
            </>}

            {appState === 'closed' && (
              <button
                onClick={() => { startTheme(); playClick(); setAppState('summary'); }}
                className="absolute top-6 right-6 z-50 text-[#a8b5a8] hover:text-[#f0d089] font-mono text-[12px] tracking-wider transition-all duration-300 opacity-60 hover:opacity-100"
              >
                [ skip intro ]
              </button>
            )}
          </>
        ) : (
          /* ── Desktop: 3-D book ── */
          <>
            {fancy && <>
              <MagicCircle isActive={appState !== 'closed'} charging={sigilCharging} />
              <Particles isActive={appState !== 'closed'} />
              <DustMotes isActive={appState === 'reading'} />
            </>}

            {/* Candlelight falling across the open book from the upper left */}
            {fancy && <div
              aria-hidden
              className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-700"
              style={{ opacity: appState === 'reading' ? 1 : 0, mixBlendMode: 'soft-light' }}
            >
              <div
                ref={candleLightRef}
                className="absolute inset-0"
                style={{
                  opacity: 0.7,
                  background: 'radial-gradient(ellipse 55% 60% at 34% 30%, rgba(255,196,120,.85) 0%, rgba(255,170,90,.35) 40%, rgba(0,0,0,.35) 100%)',
                }}
              />
            </div>}

            <div className="absolute inset-0 z-20">
              <Book
                ready={loaded}
                onStateChange={setAppState}
                playTurnWeighted={playTurnWeighted}
                playClick={playClick}
                playMulti={playMulti}
                playQuill={playQuill}
                startTheme={startTheme}
                onPageTurn={handlePageTurn}
              />
            </div>

            <button
              onClick={() => { startTheme(); playClick(); setAppState('summary'); }}
              className={`absolute top-6 right-8 z-50 text-[#a8b5a8] hover:text-[#f0d089] font-mono text-[13px] tracking-wider transition-all duration-300
              ${appState === 'closed' ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              [ skip intro ]
            </button>
          </>
        )}
      </main>
    </>
  );
}
