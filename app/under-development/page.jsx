'use client';

import { Wrench } from 'lucide-react';
import Link from 'next/link';

export default function UnderDevelopmentPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-6 text-center">
      {/* Icon */}
      <div className="p-6 rounded-full bg-emerald-500/20 border border-emerald-500 mb-6">
        <Wrench size={48} className="text-emerald-400" />
      </div>

      {/* Text */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Page Under Development</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        This feature is currently being built. Please check back later for updates.
      </p>

      {/* Back Button */}
      <Link
        href="/"
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-sm md:text-base font-medium transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
