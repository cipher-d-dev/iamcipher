import React from 'react';
import { Mail, Github, Linkedin, FileText, ArrowRight } from 'lucide-react';
import Typewriter from './Typewriter';

export function CoverFront() {
  return (
    <div className="w-full h-full bg-cover-texture flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-[2px_8px_8px_2px]">
      
      {/* Outer embossing */}
      <div className="absolute inset-3 rounded-[2px_6px_6px_2px] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15),inset_-1px_-1px_3px_rgba(0,0,0,0.8),0_1px_3px_rgba(0,0,0,0.8)] border border-[#1a2b22] pointer-events-none" />
      
      {/* Inner embossing */}
      <div className="absolute inset-5 rounded-[2px_4px_4px_2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] border border-[#0f1c14] pointer-events-none" />
      
      {/* Corner Metal Clasps */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#d4af6a] to-[#7a5e30] rounded-bl-xl rounded-tr-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-b border-l border-black/40">
        <div className="w-3 h-3 mt-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tr from-[#d4af6a] to-[#7a5e30] rounded-tl-xl rounded-br-[8px] shadow-[0_-2px_4px_rgba(0,0,0,0.6),inset_1px_-1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-t border-l border-black/40">
        <div className="w-3 h-3 mb-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      {/* Spine edge thin metal plates */}
      <div className="absolute top-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bottom-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>

      <p className="text-[#a8b5a8] font-noto-jp text-sm tracking-widest mb-6 z-10 opacity-70">
        私は誰だろう？
      </p>

      {/* Embossed Title Box */}
      <div className="relative py-4 px-8 w-[85%] mx-auto rounded shadow-[inset_0_3px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.1)] border border-[#090a09] bg-[#0c120e] flex items-center justify-center mb-6">
        <h1 className="text-3xl lg:text-4xl font-cinzel-dec font-bold text-[#f0d089] text-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center z-10">
          Favour Ejiofor
        </h1>
      </div>
      
      <p className="text-[#849c89] font-kalam text-sm lg:text-base mb-12 z-10 shadow-black drop-shadow-md">
        software engineer · notebook keeper
      </p>
      
      {/* Debossed/Embossed Central Sigil */}
      <div className="w-32 h-32 rounded-full flex items-center justify-center relative mb-12 shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] bg-[#090d0b] border border-[#090a09]">
        <div className="absolute inset-3 rounded-full border-[2px] border-[#2eb36f]/30 shadow-[inset_0_0_10px_rgba(46,179,111,0.1)] animate-[spin_20s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
        <div className="w-20 h-20 bg-[radial-gradient(circle_at_center,#2eb36f,transparent)] opacity-20 blur-[10px] absolute rounded-full" />
        <span className="text-5xl text-[#2eb36f] text-shadow-[0_0_15px_rgba(46,179,111,0.6)] font-cinzel relative z-10 -mt-1">✧</span>
      </div>
      
      <p className="text-[#f0d089] font-caveat text-2xl z-10 mt-2 pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        open grimoire
      </p>
    </div>
  );
}

export function InnerCover({ right = false }: { right?: boolean }) {
  if (right) {
    return (
      <div className="w-full h-full bg-cover-texture flex items-center justify-center relative shadow-[inset_20px_0_20px_rgba(0,0,0,0.8)] border-y border-[#d4c5a0]/10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
        <div className="opacity-[0.03] text-[#8b6b4e] flex flex-col gap-12">
          <span className="text-[10rem]">ᛟ</span>
          <span className="text-[10rem]">ᛉ</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-cover-texture flex items-center justify-center relative shadow-[inset_-20px_0_20px_rgba(0,0,0,0.8)] border-y border-[#d4c5a0]/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
      <div className="opacity-[0.03] text-[#8b6b4e] flex flex-col gap-12">
        <span className="text-[10rem]">ᚲ</span>
        <span className="text-[10rem]">ᚷ</span>
      </div>
    </div>
  );
}

export function CoverBack() {
  return (
    <div className="w-full h-full bg-cover-back rounded-[2px_8px_8px_2px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Outer embossing */}
      <div className="absolute inset-3 rounded-[2px_6px_6px_2px] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15),inset_-1px_-1px_3px_rgba(0,0,0,0.8),0_1px_3px_rgba(0,0,0,0.8)] border border-[#1a2b22] pointer-events-none" />
      
      {/* Inner embossing */}
      <div className="absolute inset-5 rounded-[2px_4px_4px_2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] border border-[#0f1c14] pointer-events-none" />
      
      {/* Corner Metal Clasps */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#d4af6a] to-[#7a5e30] rounded-bl-xl rounded-tr-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-b border-l border-black/40">
        <div className="w-3 h-3 mt-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tr from-[#d4af6a] to-[#7a5e30] rounded-tl-xl rounded-br-[8px] shadow-[0_-2px_4px_rgba(0,0,0,0.6),inset_1px_-1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center border-t border-l border-black/40">
        <div className="w-3 h-3 mb-1 ml-1 rounded-full bg-gradient-to-tl from-[#5c4d33] to-[#e8b969] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-[#4a3d28]" />
      </div>
      {/* Spine edge thin metal plates */}
      <div className="absolute top-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute bottom-4 left-0 w-4 h-10 bg-gradient-to-r from-[#7a5e30] to-[#d4af6a] rounded-r shadow-[2px_0_4px_rgba(0,0,0,0.6),inset_1px_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center border-y border-r border-black/40">
        <div className="w-1.5 h-1.5 rounded-full bg-[#5c4d33] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]" />
      </div>

      <div className="w-20 h-20 rounded-full flex items-center justify-center relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)] bg-[#090d0b] border border-[#090a09]">
        <div className="absolute inset-2 rounded-full border border-[#2eb36f]/10" />
      </div>
    </div>
  );
}

export function TitlePage() {
  return (
    <div className="w-full h-full bg-parchment-right rounded-r-md p-6 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)] border-l-2 border-[#d4c5a0]">
      <span className="absolute top-6 right-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛉ</span>
      <span className="absolute bottom-6 right-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛏ</span>
      
      <div className="h-full border border-[#8b6b4e]/40 rounded p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-cinzel text-[#1a0f05] mb-2 font-semibold tracking-widest">Favour Ejiofor</h2>
        <h3 className="text-xl font-cinzel text-[#a4302a] mb-4 tracking-wide">"Cipher"</h3>
        <div className="w-24 h-[2px] bg-[#8b6b4e]/60 mb-8" />
        <p className="text-[14px] font-semibold text-[#1a0f05] mb-4 font-serif">
          Digital Alchemist & Systems Engineer
        </p>
        <p className="text-[12.5px] italic text-[#3d2b1f] leading-loose max-w-[90%] font-serif">
          Crafting scalable backends, embedding neural intelligence, and enforcing Zero-Trust security.
        </p>
        <div className="mt-12 opacity-40">
           <span className="text-2xl text-[#1a0f05] font-cinzel">✦</span>
        </div>
      </div>
    </div>
  );
}

export function OriginLeft() {
  return (
    <div className="w-full h-full bg-parchment-left rounded-l-md p-10 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] flex flex-col justify-center border-r-2 border-[#d4c5a0]">
      <h2 className="text-2xl font-cinzel font-semibold text-[#1a0f05] mb-6 border-b border-[#8b6b4e]/30 pb-4 inline-block self-start">The Origin Incantation</h2>
      
      <div className="float-right ml-4 mb-2 w-32 h-40 bg-[#f4ebd0] p-2 shadow-md rotate-2 border border-[#d4c5a0] flex flex-col">
        {/* Placeholder for Photo 1 */}
        <div className="w-full flex-1 bg-[#d0c6a8]/40 border border-[#a4302a]/20 flex items-center justify-center relative overflow-hidden group cursor-pointer">
          <div className="text-center p-2 text-[#8b6b4e]">
             <p className="font-kalam text-[10px] leading-tight group-hover:hidden">Upload your photo to <br/><span className="font-mono bg-[#d4c5a0]/40 px-1">/public/photo1.jpg</span></p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/photo1.jpg" alt="Profile 1" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" onError={(e) => { e.currentTarget.style.opacity = '0'; e.currentTarget.parentElement?.classList.remove('group'); }} onLoad={(e) => { e.currentTarget.style.opacity = '1'; }} />
        </div>
        <p className="font-caveat text-center text-[#5c4d33] text-[13px] mt-1 -mb-1">Me</p>
      </div>

      <div className="text-[#3d2b1f] space-y-4 text-[12.5px] leading-[1.5] font-serif">
        <p>
          <span className="font-cinzel-dec text-4xl float-left leading-[0.8] pt-1 pr-2 text-[#a4302a]">A</span>
          t age 12, inspired by Kenzi’s effortless tech brilliance on <span className="italic">Game Shakers</span>, the obsession began. First came the logical playgrounds of Scratch, which quickly sparked a jump into raw Python scripts to see how real software came to life.
        </p>
        <p>
          As basic scripts turned into visual projects, web development opened the door to building interfaces and handling real-world data flow.
        </p>
        <p>
          But as complexity grew, so did the fascination with what went on under the hood—moving past basic code to design resilient, beautifully structured, and properly architected systems.
        </p>
      </div>
    </div>
  );
}

export function OriginTerminal({ active }: { active: boolean }) {
  const logText = `> Executing initiation sequence...
> Loading chronos_logs.dat...
> [USER] identified: Cipher
> Class: Systems Engineer & Digital Alchemist
> Level: Senior
> Primary Elements: TypeScript, Python, Go, Node.js
> Specialization: Zero-Trust Security, Neural Intelligence
> Status: Core systems online.
> Ready for deployment.`;

  return (
    <div className="w-full h-full bg-parchment-right rounded-r-md p-10 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] border-l-2 border-[#d4c5a0]">
       <div className="bg-[#161210] p-6 rounded-sm border border-[#d4af6a]/25 h-[80%] my-4 shadow-xl flex flex-col relative overflow-hidden -rotate-1">
         {/* Scanline overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
         
         <div className="flex gap-2 mb-4 bg-[#0d0b09] -mt-6 -mx-6 p-3 border-b border-[#3d2b1f] relative z-10">
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
         </div>
         <div className="flex-1 overflow-y-auto text-[10.8px] leading-[1.65] relative z-10 font-mono" style=\{\{ isolation: 'isolate' \}\}>
           <Typewriter text={logText} active={active} delay={800} />
         </div>
       </div>
    </div>
  );
}

export function ExperienceLeft() {
  return (
    <div className="w-full h-full bg-parchment-left rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] flex flex-col border-r-2 border-[#d4c5a0]">
      <div className="w-16 h-16 rounded-full border-2 border-[#a4302a] flex items-center justify-center mb-6 shrink-0 relative">
        <div className="absolute inset-1 rounded-full border border-[#d4af6a]/50 border-dashed animate-[spin_20s_linear_infinite]" />
        <span className="font-cinzel text-xl text-[#1a0f05]">Exp</span>
      </div>

      <div className="text-[#3d2b1f] space-y-4 text-[13.5px] leading-[1.62] font-serif pr-2">
        <h2 className="text-2xl font-cinzel font-semibold text-[#1a0f05] mb-2 border-b border-[#a4302a] pb-1">Journeys & Quests</h2>
        <p>
          The path of a developer is paved with trials. Herein lies the record of my past campaigns, from small skirmishes to grand sieges on legacy codebases.
        </p>
        
        <div className="mt-6 space-y-5">
          <div className="border-l-2 border-[#a4302a]/40 pl-3 relative">
            <div className="absolute w-2 h-2 rounded-full bg-[#a4302a] -left-[5px] top-1.5" />
            <h3 className="font-bold text-[#1a0f05]">Senior Fullstack Engineer</h3>
            <p className="text-[#a4302a] text-xs font-mono mb-1">2025 - Present | ISBMPA (isbmpa.com)</p>
            <p className="text-sm">Managed web infrastructure, domain configurations, and media gallery hosting using Appwrite while optimizing data fetching limits and backend performance.</p>
          </div>

          <div className="border-l-2 border-[#5c4d33]/40 pl-3 relative">
            <div className="absolute w-2 h-2 rounded-full bg-[#5c4d33] -left-[5px] top-1.5" />
            <h3 className="font-bold text-[#1a0f05]">Entry Deep Learning Trainee</h3>
            <p className="text-[#a4302a] text-xs font-mono mb-1">2026 | NVIDIA x UNILAG</p>
            <p className="text-sm">Trained in deep learning fundamentals and neural network architectures through hands-on technical workshops and model optimization exercises.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceRight() {
  return (
    <div className="w-full h-full bg-parchment-right rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] flex flex-col border-l-2 border-[#d4c5a0]">
      <div className="w-full h-8 border-b border-[#a4302a] mb-6 opacity-0" />
      
      <div className="text-[#3d2b1f] space-y-5 text-[13.5px] leading-[1.62] font-serif pr-2 mt-2">
        <div className="border-l-2 border-[#5c4d33]/40 pl-3 relative">
            <div className="absolute w-2 h-2 rounded-full bg-[#5c4d33] -left-[5px] top-1.5" />
            <h3 className="font-bold text-[#1a0f05]">CTF Winner</h3>
            <p className="text-[#a4302a] text-xs font-mono mb-1">2026 | Go2Cyber</p>
            <p className="text-sm">Secured first place in a competitive capture-the-flag tournament by exploiting system vulnerabilities and executing real-time threat analysis under timed conditions.</p>
        </div>

        <div className="border-l-2 border-[#5c4d33]/40 pl-3 relative">
            <div className="absolute w-2 h-2 rounded-full border border-[#5c4d33] bg-transparent -left-[5px] top-1.5" />
            <h3 className="font-bold text-[#1a0f05]">Software Engineering Intern</h3>
            <p className="text-[#a4302a] text-xs font-mono mb-1">2024 | HNG</p>
            <p className="text-sm">Collaborated with cross-functional teams to build, test, and ship full-stack web features in a fast-paced agile development environment.</p>
        </div>
        
        <p className="italic text-[#5c4d33] pt-4 border-t border-[#d4c5a0] mt-6">
          &quot;Experience is not merely time spent, but the wisdom distilled from countless compiled errors.&quot;
        </p>
      </div>
    </div>
  );
}

export function ToolsLeft() {
  return (
    <div className="w-full h-full bg-parchment-left rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] flex flex-col border-r-2 border-[#d4c5a0]">
      <h2 className="text-2xl font-cinzel font-semibold text-[#1a0f05] mb-6 border-b border-[#a4302a] pb-2 inline-block self-start">Core & Frontend Runes</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6" style=\{\{ isolation: 'isolate' \}\}>
        <div className="space-y-4 text-[13px] font-serif">
          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold font-cinzel text-[15px] text-[#1a0f05] mb-2 flex items-center gap-2">
              <span className="text-[#a4302a] text-lg">✦</span> Core Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="TypeScript" title="TypeScript" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="JavaScript" title="JavaScript" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Python" title="Python" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Go" title="Go" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Java" title="Java" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Kotlin" title="Kotlin" />
            </div>
            <p className="text-[#5c4d33] leading-relaxed mt-2 text-xs">Primary incantations: TypeScript, JavaScript, Python. Systems: Go, Java, Kotlin.</p>
          </div>

          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold font-cinzel text-[15px] text-[#1a0f05] mb-2 flex items-center gap-2">
              <span className="text-[#a4302a] text-lg">⚛</span> Web & Mobile Frontend
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="React" title="React" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Vite" title="Vite" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Tailwind" title="Tailwind CSS" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/androidstudio/androidstudio-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Android Studio" title="Android Studio" />
            </div>
            <p className="text-[#5c4d33] leading-relaxed mt-2 text-xs">Visual manifestation: React, React Native, Vite, Tailwind CSS, Android Studio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToolsRight() {
  return (
    <div className="w-full h-full bg-parchment-right rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] flex flex-col border-l-2 border-[#d4c5a0]">
      <div className="w-full h-8 border-b border-[#a4302a] mb-6 opacity-0" />
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6" style=\{\{ isolation: 'isolate' \}\}>
        <h2 className="text-2xl font-cinzel font-semibold text-[#1a0f05] mb-2 border-b border-[#a4302a] pb-2 inline-block self-start">Backend & Systems</h2>
        
        <div className="space-y-4 text-[13px] font-serif mt-4">
          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold font-cinzel text-[15px] text-[#1a0f05] mb-2 flex items-center gap-2">
              <span className="text-[#a4302a] text-lg">⚡</span> Backend Architecture
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Node" title="Node.js" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Express" title="Express.js" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/appwrite/appwrite-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Appwrite" title="Appwrite" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Firebase" title="Firebase" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Supabase" title="Supabase" />
            </div>
            <p className="text-[#5c4d33] leading-relaxed text-xs">Distributed Systems, Zero-Trust Architecture, REST APIs, Microservices, P2P / Mesh Networking.</p>
          </div>

          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold font-cinzel text-[15px] text-[#1a0f05] mb-2 flex items-center gap-2">
              <span className="text-[#a4302a] text-lg">🗄</span> Data Infrastructure
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="PostgreSQL" title="PostgreSQL" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="MySQL" title="MySQL" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Redis" title="Redis" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Prisma" title="Prisma" />
            </div>
            <p className="text-[#5c4d33] leading-relaxed text-xs">Relational DBs, ORMs, and AI Data Layers (pgvector, Qdrant).</p>
          </div>

          <div className="group relative border border-[#c9b783] bg-[#f4ebd0]/50 p-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold font-cinzel text-[15px] text-[#1a0f05] mb-2 flex items-center gap-2">
              <span className="text-[#a4302a] text-lg">🛡</span> DevOps & Security
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Docker" title="Docker" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="GitHub Actions" title="GitHub Actions" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" className="w-6 h-6 grayscale-[30%] sepia-[50%] opacity-80 mix-blend-multiply" alt="Linux" title="Linux" />
            </div>
            <p className="text-[#5c4d33] leading-relaxed text-xs">CI/CD, Cryptographic libraries, Token Rotation/mTLS, Pentesting & Local LLMs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsLeft() {
  return (
    <div className="w-full h-full bg-parchment-left rounded-l-md p-10 shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] flex flex-col border-r-2 border-[#d4c5a0]">
      <h2 className="text-2xl font-cinzel font-semibold text-[#1a0f05] mb-6 border-b border-[#a4302a] pb-2 inline-block self-start">Arcane Constructs (I)</h2>
      
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6 pb-8" style=\{\{ isolation: 'isolate' \}\}>
        <div className="group relative">
           <div className="flex items-center justify-between mb-1">
             <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] flex items-center gap-2">
               Quillex
             </h3>
             <span className="font-caveat text-[#a4302a] text-sm rotate-[3deg]">open-source →</span>
           </div>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Creator & Lead Developer · TS / React / Express / Prisma / PostgreSQL</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              An opinionated open-source authentication SDK designed for React, providing drop-in UI components, custom hooks, and a pre-configured backend. Eliminates auth setup overhead for developers.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/quillex.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">Clarion</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Fullstack & AI Engineer · TS / React / AI Pipelines / Express / PostgreSQL</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              An AI-powered complaint, report, and issue management platform for tertiary institutions. Automates ticket classification, intelligent routing, and real-time tracking with administrative analytics.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/clarion.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
             <a href="https://clarion-schools.vercel.app" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ Live</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">cipher_auth</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Backend & Security Engineer · JS / TS / Node.js / Passport.js</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              Modern authentication infrastructure built on top of Passport for JS/TS applications. Engineered to be secure by default and customizable by design.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/cipher_auth.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">Aetheris</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Systems & Security Developer · TS / Crypto / P2P Mesh Protocols</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              An encrypted messaging platform enabling secure data transfers over local peer-to-peer mesh network discovery without requiring internet connectivity. Features E2E encryption.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/Aetheris.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">ISBMPA</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2025 – Present · Senior Fullstack Engineer · TS / React / Appwrite</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              Official government liaison website serving institutional media and information. Architected media gallery hosting, configured custom domain routing, and optimized backend limits.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/isbmpa.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
             <a href="https://isbmpa.com" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ Live</a>
           </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsRight() {
  return (
    <div className="w-full h-full bg-parchment-right rounded-r-md p-10 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] flex flex-col border-l-2 border-[#d4c5a0]">
      <h2 className="text-2xl font-cinzel font-semibold text-[#1a0f05] mb-6 border-b border-[#a4302a] pb-2 inline-block self-start">Arcane Constructs (II)</h2>
      
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6 pb-8" style=\{\{ isolation: 'isolate' \}\}>
        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">Weft</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Android Developer · Kotlin / Android SDK / System Architecture</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              A functional Android home screen launcher demonstrating a live design token architecture. Designed to showcase dynamic UI state management and custom system-level customization.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/weft.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">Hopper</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Systems Developer · C# / C++ / Windows API</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              A lightweight Windows automation tool built for keyboard-driven productivity workflows, streamlining system navigation and quick execution tasks for power users.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/hopper.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">fslens</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2026 · Frontend Engineer · TS / React / Next.js / Tailwind CSS</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              A cinematic portfolio website developed for a professional videographer, featuring high-performance media delivery, responsive galleries, and dynamic visual layouts.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/fslens.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
             <a href="https://fslens.vercel.app" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ Live</a>
           </div>
        </div>

        <div className="group relative">
           <h3 className="font-semibold font-cinzel text-[17px] text-[#1a0f05] mb-1">Traverse Programming</h3>
           <p className="text-[#5c4d33] font-mono text-[9px] tracking-[0.03em] mb-2">2025 · Desktop Developer · VB.NET / Windows Forms / Algorithmic Comp.</p>
           <p className="text-[#1a0f05] text-[13.5px] leading-[1.62] mb-2 font-serif">
              A closed-traverse computation program for Surveying (SVY 323). Computes forward/back bearings, Bowditch adjustments, final coordinates, linear accuracy, and enclosed areas.
           </p>
           <div className="flex gap-4">
             <a href="https://github.com/cipher-d-dev/Tranverse-Programming-Surverying.git" target="_blank" rel="noreferrer" className="inline-block font-kalam text-[#2f5d8a] hover:text-[#1a0f05] border-b border-dashed border-[#2f5d8a] text-[12.5px] transition-colors relative z-10">→ GitHub</a>
           </div>
        </div>
      </div>
    </div>
  );
}

export function FocusTerminal({ active }: { active: boolean }) {
  const focusText = `$ status --current
> focus: Mesh Networks & Cryptography
> learning: Vector DBs & LLM Runners
> open to: Senior / System Architect roles
> status: compiling runes...`;

  return (
    <div className="w-full h-full bg-parchment-left rounded-l-md p-10 relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.15)] border-r-2 border-[#d4c5a0]">
       <div className="bg-[#161210] p-6 rounded-sm border border-[#d4af6a]/25 h-[80%] my-4 shadow-xl flex flex-col relative overflow-hidden -rotate-1">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
         <div className="flex gap-2 mb-4 bg-[#0d0b09] -mt-6 -mx-6 p-3 border-b border-[#3d2b1f] relative z-10">
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
           <div className="w-2 h-2 rounded-full bg-[#413a2e]" />
         </div>
         <div className="flex-1 overflow-y-auto text-[10.8px] leading-[1.65] relative z-10 font-mono" style=\{\{ isolation: 'isolate' \}\}>
           <Typewriter text={focusText} active={active} delay={400} />
         </div>
       </div>
    </div>
  );
}

export function ContactRight() {
  return (
    <div className="w-full h-full bg-parchment-right rounded-r-md p-10 relative shadow-[inset_-10px_0_20px_rgba(0,0,0,0.15)] flex flex-col justify-center border-l-2 border-[#d4c5a0]" style=\{\{ isolation: 'isolate' \}\}>
      <span className="absolute top-6 right-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛃ</span>
      <span className="absolute bottom-6 left-6 text-[#8b6b4e] text-2xl opacity-40 font-cinzel">ᛗ</span>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[17px] font-cinzel font-semibold text-[#1a0f05] mb-2 border-b border-[#a4302a] pb-2 inline-block">Contact</h2>
          <p className="text-[#5c4d33] text-[11.5px] font-serif">
            Only what I actually check.
          </p>
        </div>
        
        <div className="w-24 h-32 bg-[#f4ebd0] p-1.5 shadow-sm -rotate-3 border border-[#d4c5a0] flex flex-col mt-2 mr-4">
          <div className="w-full flex-1 bg-[#d0c6a8]/40 border border-[#a4302a]/20 flex items-center justify-center relative overflow-hidden group cursor-pointer">
            <div className="text-center p-1 text-[#8b6b4e]">
               <p className="font-kalam text-[8px] leading-tight group-hover:hidden">Upload to <br/><span className="font-mono bg-[#d4c5a0]/40 px-1">/public/photo2.jpg</span></p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photo2.jpg" alt="Profile 2" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300" onError={(e) => { e.currentTarget.style.opacity = '0'; e.currentTarget.parentElement?.classList.remove('group'); }} onLoad={(e) => { e.currentTarget.style.opacity = '1'; }} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[90%] space-y-0">
        <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#c9b783] font-mono text-[11.5px]">
          <span className="text-[#5c4d33] min-w-[68px]">email</span>
          <a href="mailto:faveejiofor2009@gmail.com" className="text-[#1a0f05] hover:text-[#2f5d8a] transition-colors relative z-10">faveejiofor2009@gmail.com</a>
        </div>
        <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#c9b783] font-mono text-[11.5px]">
          <span className="text-[#5c4d33] min-w-[68px]">github</span>
          <a href="https://github.com/cipher-d-dev" target="_blank" rel="noreferrer" className="text-[#1a0f05] hover:text-[#2f5d8a] transition-colors relative z-10">github.com/cipher-d-dev</a>
        </div>
        <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#c9b783] font-mono text-[11.5px]">
          <span className="text-[#5c4d33] min-w-[68px]">linkedin</span>
          <a href="https://www.linkedin.com/in/fave-ejiofor-a05bab260" target="_blank" rel="noreferrer" className="text-[#1a0f05] hover:text-[#2f5d8a] transition-colors relative z-10">linkedin.com/in/fave-ejiofor-a05bab260</a>
        </div>
        <div className="flex items-center gap-3 py-3 border-b border-dashed border-[#c9b783] font-mono text-[11.5px]">
          <span className="text-[#5c4d33] min-w-[68px]">resume</span>
          <a href="/resume.pdf" download="resume.pdf" target="_blank" rel="noreferrer" className="text-[#1a0f05] hover:text-[#2f5d8a] transition-colors relative z-10">/resume.pdf</a>
        </div>
      </div>
      
      <div className="mt-8 text-center w-full">
         <span className="font-caveat text-[19px] text-[#5c4d33]">— fin —</span>
      </div>
    </div>
  );
}
