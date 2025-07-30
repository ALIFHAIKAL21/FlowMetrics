'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Footer from './components/footer';
import Navbar from './components/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isChartPage = pathname.startsWith('/charts');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-white`}
      >
        {isChartPage ? (
          <>{children}</>
        ) : (
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        )}
      </body>
    </html>
  );
}
