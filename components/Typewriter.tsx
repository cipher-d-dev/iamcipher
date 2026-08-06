'use client';
import { useState, useEffect } from 'react';

export default function Typewriter({ text, active, delay = 0 }: { text: string, active: boolean, delay?: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayed('');
      return;
    }
    let timeout: NodeJS.Timeout;
    timeout = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 30);
      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [active, text, delay]);

  return (
    <span className="font-mono text-[#8fd694] whitespace-pre-wrap leading-relaxed">
      {displayed}
      {active && <span className="inline-block w-[6px] h-[11px] bg-[#8fd694] align-[-1px] animate-[pulse_1s_steps(1)_infinite] ml-[1px]"></span>}
    </span>
  );
}
