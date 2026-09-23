import type { Metadata } from 'next';
import { pt } from '@/lib/locales/pt';
import '@fontsource-variable/manrope';
import '@fontsource/lilita-one/latin-400.css';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';

export const metadata: Metadata = {
  title: pt.meta.title,
  description: pt.meta.description,
  icons: { icon: '/favicon.png', shortcut: '/favicon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return <html lang="pt-BR"><body><noscript><style>{`.page-loader { display: none !important; } .portfolio-root { opacity: 1 !important; }`}</style></noscript>{children}</body></html>;
}
