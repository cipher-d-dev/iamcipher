'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Book from '@/components/Book';
import MobileReader from '@/components/MobileReader';
import MagicCircle from '@/components/MagicCircle';
import Particles from '@/components/Particles';
import MagicalLoader from '@/components/MagicalLoader';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [appState, setAppState] = useState<'closed' | 'opening' | 'reading' | 'closing' | 'summary'>('closed');
  const [muted, setMuted] = useState(false);
  const isMobile = useIsMobile();

  // ── Audio refs ──────────────────────────────────────────────
  const themeRef  = useRef<HTMLAudioElement | null>(null);
  const turnRef   = useRef<HTMLAudioElement | null>(null);
  const clickRef  = useRef<HTMLAudioElement | null>(null);
  const multiRef  = useRef<HTMLAudioElement | null>(null);

  // Initialise audio elements once
  useEffect(() => {
    const theme = new Audio('/fantasythemesong.mp3');
    theme.loop   = true;
    theme.volume = 0.35;
    themeRef.current = theme;

    const turn = new Audio('/turnpage.wav');
    turn.volume = 0.7;
    turnRef.current = turn;

    const click = new Audio('/fantastyclicksound.mp3');
    click.volume = 0.6;
    clickRef.current = click;

    const multi = new Audio('/multiplepages.wav');
    multi.volume = 0.7;
    multiRef.current = multi;

    return () => {
      theme.pause();
      turn.pause();
      click.pause();
      multi.pause();
    };
  }, []);

  // Start theme once loader is done
  useEffect(() => {
    if (!loaded) return;
    themeRef.current?.play().catch(() => {});
  }, [loaded]);

  // Sync mute state
  useEffect(() => {
    [themeRef, turnRef, clickRef, multiRef].forEach(r => {
      if (r.current) r.current.muted = muted;
    });
  }, [muted]);

  // ── Sound helpers (stable refs so children don't re-render) ──
  const playTurn = useCallback(() => {
    const a = turnRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
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

  if (appState === 'summary') {
    return (
      <main className="min-h-screen bg-[#080c09] text-[#e8d9ae] p-8 md:p-16 font-serif selection:bg-[#2eb36f] selection:text-[#080c09] overflow-auto">
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
              <li>
                <a href="https://github.com/cipher-d-dev/quillex.git" target="_blank" rel="noreferrer" className="text-xl text-[#2eb36f] hover:underline font-mono block mb-2">Quillex</a>
                <p className="text-[#a8b5a8] leading-relaxed">An opinionated open-source authentication SDK designed for React.</p>
              </li>
              <li>
                <div className="flex items-center gap-4 mb-2">
                  <a href="https://github.com/cipher-d-dev/clarion.git" target="_blank" rel="noreferrer" className="text-xl text-[#2eb36f] hover:underline font-mono">Clarion</a>
                  <a href="https://clarion-schools.vercel.app" target="_blank" rel="noreferrer" className="text-xs border border-[#2eb36f] text-[#2eb36f] hover:bg-[#2eb36f]/10 px-2 py-0.5 rounded transition-colors">Live Preview</a>
                </div>
                <p className="text-[#a8b5a8] leading-relaxed">AI-powered complaint, report, and issue management platform.</p>
              </li>
              <li>
                <a href="https://github.com/cipher-d-dev/cipher_auth.git" target="_blank" rel="noreferrer" className="text-xl text-[#2eb36f] hover:underline font-mono block mb-2">cipher_auth</a>
                <p className="text-[#a8b5a8] leading-relaxed">Modern authentication infrastructure built on top of Passport for JS/TS.</p>
              </li>
              <li>
                <a href="https://github.com/cipher-d-dev/Aetheris.git" target="_blank" rel="noreferrer" className="text-xl text-[#2eb36f] hover:underline font-mono block mb-2">Aetheris</a>
                <p className="text-[#a8b5a8] leading-relaxed">Encrypted messaging platform using local peer-to-peer mesh network discovery.</p>
              </li>
              <li>
                <div className="flex items-center gap-4 mb-2">
                  <a href="https://github.com/cipher-d-dev/isbmpa.git" target="_blank" rel="noreferrer" className="text-xl text-[#2eb36f] hover:underline font-mono">ISBMPA</a>
                  <a href="https://isbmpa.com" target="_blank" rel="noreferrer" className="text-xs border border-[#2eb36f] text-[#2eb36f] hover:bg-[#2eb36f]/10 px-2 py-0.5 rounded transition-colors">Live Preview</a>
                </div>
                <p className="text-[#a8b5a8] leading-relaxed">Official government liaison website serving institutional media.</p>
              </li>
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
        className="relative w-screen h-screen overflow-hidden bg-[#080c09] flex items-center justify-center select-none font-serif"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease-in' }}
      >
        {/* Background ambient lighting */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,#112b1c_0%,transparent_70%)] pointer-events-none" />

        {/* Mute toggle */}
        <button
          onClick={() => setMuted(m => !m)}
          title={muted ? 'Unmute' : 'Mute'}
          className="absolute bottom-6 right-6 z-50 w-8 h-8 flex items-center justify-center rounded-full border border-[#2eb36f]/20 bg-[#080c09]/70 text-[#2eb36f]/60 hover:text-[#2eb36f] hover:border-[#2eb36f]/50 transition-all duration-200 text-sm"
        >
          {muted ? '🔇' : '🔊'}
        </button>

        {isMobile ? (
          /* ── Mobile: full-screen parchment reader ── */
          <>
            {appState === 'closed' && (
              <div className="relative z-20 flex flex-col items-center justify-center gap-6 px-8 text-center">
                <span className="text-5xl text-[#2eb36f]" style={{ textShadow: '0 0 20px rgba(46,179,111,0.7)' }}>✧</span>
                <h1 className="font-cinzel text-[#f0d089] text-2xl tracking-widest">Favour Ejiofor</h1>
                <p className="font-kalam text-[#a8b5a8] text-base italic">software engineer · systems designer</p>
                <button
                  onClick={() => { playClick(); setAppState('reading'); }}
                  className="mt-4 font-caveat text-[#2eb36f] text-xl border border-[#2eb36f]/40 px-6 py-3 rounded-sm hover:bg-[#2eb36f]/10 transition-colors"
                >
                  open grimoire
                </button>
              </div>
            )}

            {(appState === 'reading' || appState === 'opening' || appState === 'closing') && (
              <MobileReader
                onClose={() => setAppState('closed')}
                onStateChange={(state) => setAppState(state)}
                playTurn={playTurn}
                playClick={playClick}
                playMulti={playMulti}
              />
            )}

            <MagicCircle isActive={appState !== 'closed'} />
            <Particles isActive={appState !== 'closed'} />

            {appState === 'closed' && (
              <button
                onClick={() => { playClick(); setAppState('summary'); }}
                className="absolute top-6 right-6 z-50 text-[#a8b5a8] hover:text-[#f0d089] font-mono text-[12px] tracking-wider transition-all duration-300 opacity-60 hover:opacity-100"
              >
                [ skip intro ]
              </button>
            )}
          </>
        ) : (
          /* ── Desktop: 3-D book ── */
          <>
            <MagicCircle isActive={appState !== 'closed'} />
            <Particles isActive={appState !== 'closed'} />

            <div className="absolute inset-0 z-20">
              <Book
                isActive={appState !== 'closed'}
                onStateChange={(state) => setAppState(state as any)}
                playTurn={playTurn}
                playClick={playClick}
                playMulti={playMulti}
              />
            </div>

            <button
              onClick={() => { playClick(); setAppState('summary'); }}
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
