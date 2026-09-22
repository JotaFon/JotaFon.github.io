import type { Metadata } from 'next';
import { pt } from '@/lib/locales/pt';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.css';

export const metadata: Metadata = {
  title: pt.meta.title,
  description: pt.meta.description,
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return <html lang="pt-BR"><body>{children}</body></html>;
}
