'use client';

import { Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-6 text-center">
      {/* Icon */}
      <div className="p-6 rounded-full bg-emerald-500/20 border border-emerald-500 mb-6">
        <AlertTriangle size={48} className="text-emerald-400" />
      </div>

      {/* Text */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Back to Home */}
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm md:text-base font-medium transition"
      >
        <Home size={18} /> Back to Home
      </Link>
    </main>
  );
}
