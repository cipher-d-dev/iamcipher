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
  title: {
    default: 'Favour Ejiofor — Software Engineer',
    template: '%s | Favour Ejiofor',
  },
  description:
    'Portfolio of Favour Ejiofor (Cipher) — Systems Engineer & Digital Alchemist specialising in TypeScript, Node.js, Zero-Trust security, and neural intelligence.',
  keywords: [
    'Favour Ejiofor',
    'Cipher',
    'Software Engineer',
    'Systems Engineer',
    'Fullstack Developer',
    'TypeScript',
    'Node.js',
    'React',
    'Zero-Trust Security',
    'Portfolio',
  ],
  authors: [{ name: 'Favour Ejiofor', url: 'https://github.com/cipher-d-dev' }],
  creator: 'Favour Ejiofor',
  metadataBase: new URL('https://favourejiofor.dev'),
  openGraph: {
    type: 'website',
    title: 'Favour Ejiofor — Software Engineer',
    description:
      'Systems Engineer & Digital Alchemist. Scalable backends, neural intelligence, Zero-Trust security.',
    siteName: 'Favour Ejiofor',
    images: [{ url: '/photo1.jpg', width: 1200, height: 630, alt: 'Favour Ejiofor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Favour Ejiofor — Software Engineer',
    description:
      'Systems Engineer & Digital Alchemist. Scalable backends, neural intelligence, Zero-Trust security.',
    images: ['/photo1.jpg'],
    creator: '@cipher_d_dev',
  },
  icons: {
    icon: '/star.png',
    shortcut: '/star.png',
    apple: '/star.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
