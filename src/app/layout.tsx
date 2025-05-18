import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../components/ui/styles.css';
import { AppShell } from '../components/layout/AppShell';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Niche Platform',
  description: 'A specialized platform for niche communities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>
          <Providers>{children}</Providers>
        </AppShell>
      </body>
    </html>
  );
}
