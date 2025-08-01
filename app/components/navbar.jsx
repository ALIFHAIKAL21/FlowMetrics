'use client';

import { useState } from 'react';
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
            <a href="/" className="hover:text-emerald-400 transition">
              Home
            </a>
          </li>
          <li>
            <a href="/forexlist" className="hover:text-emerald-400 transition">
              Forex
            </a>
          </li>

          <li>
            <a href="/cryptolist" className="hover:text-emerald-400 transition">
              Crypto
            </a>
          </li>
          <li>
            <a href="/developer" className="hover:text-emerald-400 transition">
              Developer
            </a>
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
            <a href="/" className="hover:text-emerald-400 transition block">
              Home
            </a>
          </li>
          <li>
            <a href="/forexlist" className="hover:text-emerald-400 transition block">
              Forex
            </a>
          </li>
          <li>
            <a href="/cryptolist" className="hover:text-emerald-400 transition block">
              Crypto
            </a>
          </li>
          <li>
            <a href="/developer" className="hover:text-emerald-400 transition block">
              Developer
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
