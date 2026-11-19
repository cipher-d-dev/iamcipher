'use client';
import { useEffect, useRef, useState } from 'react';
import GrimoireModal from './GrimoireModal';

// A tiny capture-the-flag for curious visitors.
//
// The console greets anyone who opens devtools with a base64 riddle. Typing
// the decoded word anywhere on the page (outside text fields) breaks the
// seal and reveals the flag.
const WORD = 'zerotrust';
const RIDDLE = typeof btoa === 'function' ? btoa(WORD) : 'emVyb3RydXN0';
const FLAG = 'flag{curi0sity_1s_th3_b3st_cr3d3ntial}';

let greeted = false;

export default function SecretSeal({ onReveal }: { onReveal?: () => void }) {
  const [open, setOpen] = useState(false);
  const buffer = useRef('');

  useEffect(() => {
    if (!greeted) {
      greeted = true;
      console.log(
        '%c✦ A seeker opens the console.',
        'font: 600 16px Georgia, serif; color: #d4af6a;',
      );
      console.log(
        `%cThis grimoire keeps one sealed page.\nDecode the word and speak it to the book (just type it, anywhere):\n\n    ${RIDDLE}\n`,
        'font: 13px ui-monospace, monospace; color: #8fd694; line-height: 1.6;',
      );
    }

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-WORD.length);
      if (buffer.current === WORD) {
        buffer.current = '';
        onReveal?.();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onReveal]);

  return (
    <GrimoireModal
      open={open}
      variant="alert"
      rune="ᛉ"
      title="The seal breaks"
      message={`${FLAG}\n\nMention this flag when you reach out. Curiosity is the best credential.`}
      confirmLabel="Close the seal"
      onConfirm={() => setOpen(false)}
    />
  );
}
