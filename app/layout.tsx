import type {Metadata} from 'next';
import { 
  Kalam, 
  Caveat, 
  Source_Serif_4, 
  JetBrains_Mono, 
  Cinzel_Decorative, 
  Cinzel, 
  Noto_Serif_JP 
} from 'next/font/google';
import './globals.css';

const kalam = Kalam({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-kalam' });
const caveat = Caveat({ weight: ['600', '700'], subsets: ['latin'], variable: '--font-caveat' });
const sourceSerif = Source_Serif_4({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-source-serif' });
const jetbrains = JetBrains_Mono({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-jetbrains' });
const cinzelDec = Cinzel_Decorative({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-cinzel-dec' });
const cinzel = Cinzel({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: 'Grimoire Portfolio',
  description: 'A magical spellbook portfolio site.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${kalam.variable} ${caveat.variable} ${sourceSerif.variable} ${jetbrains.variable} ${cinzelDec.variable} ${cinzel.variable}`}>
      <body suppressHydrationWarning className="bg-[#0c0512] text-gray-200 font-source-serif">
        {children}
      </body>
    </html>
  );
}
