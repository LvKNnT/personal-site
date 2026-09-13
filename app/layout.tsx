import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

const themeScript = `
  (() => {
    try {
      const savedTheme = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = savedTheme ?? (prefersDark ? 'dark' : 'light');
    } catch {
      document.documentElement.dataset.theme = 'light';
    }
  })();
`;

export const metadata: Metadata = {
  title: { default: 'Lâm Vĩnh Khang', template: '%s · LvKNnT' },
  description: 'Personal profile, selected work, and writing.',
  icons: {
    icon: [{ url: '/favicon.svg?v=orange-1', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg?v=orange-1',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={geist.variable}>
        <SiteHeader />
        {children}
        <footer className="site-footer">© 2026 LvKNnT</footer>
      </body>
    </html>
  );
}
