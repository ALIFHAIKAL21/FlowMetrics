'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-2 left-4 right-4 z-50 bg-transparent backdrop-blur-md text-white rounded-2xl shadow-md shadow-emerald-500/35 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">FlowMetrics</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li>
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/forexlist" className="hover:text-emerald-400 transition">
              Forex
            </Link>
          </li>
          <li>
            <Link href="/cryptolist" className="hover:text-emerald-400 transition">
              Crypto
            </Link>
          </li>
          <li>
            <Link href="/developer" className="hover:text-emerald-400 transition">
              Developer
            </Link>
          </li>
        </ul>

        {/* Hamburger Button (Mobile + iPad) */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="flex flex-col mt-4 space-y-3 text-sm font-medium md:hidden">
          <li>
            <Link href="/" className="hover:text-emerald-400 transition block">
              Home
            </Link>
          </li>
          <li>
            <Link href="/forexlist" className="hover:text-emerald-400 transition block">
              Forex
            </Link>
          </li>
          <li>
            <Link href="/cryptolist" className="hover:text-emerald-400 transition block">
              Crypto
            </Link>
          </li>
          <li>
            <Link href="/developer" className="hover:text-emerald-400 transition block">
              Developer
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
