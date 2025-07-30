'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '../../globals.css';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function ChartLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}  text-white`}>
   
      <main >{children}</main>
   
    </div>
  );
}
