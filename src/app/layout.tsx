import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Page Summary App',
  description: 'Summarize content from multiple URLs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Page Summary</h1>
          {children}
        </main>
      </body>
    </html>
  );
} 