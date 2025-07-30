'use client';

import { useState, useEffect, useRef } from 'react';

const timeframes = [
  { label: '1 Minute', value: '1m' },
  { label: '5 Minutes', value: '5m' },
  { label: '15 Minutes', value: '15m' },
  { label: '1 Hour', value: '1h' },
  { label: '4 Hours', value: '4h' },
  { label: '1 Day', value: '1d' },
];

export default function ChartNavbar({ period, setPeriod }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel =
    timeframes.find((tf) => tf.value === period)?.label || 'Select Timeframe';

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-transparent backdrop-blur-md text-white rounded-2xl shadow-md shadow-emerald-500/35 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">FlowMetrics</h1>

        {/* Dropdown Timeframe */}
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-40 px-2 py-1.5 text-slate-200 rounded-md shadow-md shadow-emerald-500/35 border-b border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/35 transition"
          >
            {activeLabel}
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${
                open ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-transparent backdrop-blur-md ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => {
                      setPeriod(tf.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-600/35 transition ${
                      period === tf.value
                        ? 'bg-emerald-500/35 text-gray-100 font-medium'
                        : 'text-gray-100'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
