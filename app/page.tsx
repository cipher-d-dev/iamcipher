'use client';
import { useState } from 'react';
import Book from '@/components/Book';
import MagicCircle from '@/components/MagicCircle';
import Particles from '@/components/Particles';
import MagicalLoader from '@/components/MagicalLoader';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [appState, setAppState] = useState<'closed' | 'opening' | 'reading' | 'closing' | 'summary'>('closed');

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
        
        <MagicCircle isActive={appState !== 'closed'} />
        <Particles isActive={appState !== 'closed'} />
        
        <div className="absolute inset-0 z-20">
          <Book isActive={appState !== 'closed'} onStateChange={(state) => setAppState(state as any)} />
        </div>

        <button 
          onClick={() => setAppState('summary')}
          className={`absolute top-6 right-8 z-50 text-[#a8b5a8] hover:text-[#f0d089] font-mono text-[13px] tracking-wider transition-all duration-300
          ${appState === 'closed' ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          [ skip intro ]
        </button>
      </main>
    </>
  );
}
