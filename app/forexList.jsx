'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './components/loader';
import ErrorMessage from './components/errorMessage';

export default function ForexList() {
  const router = useRouter();
  const [pairs, setPairs] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState({});
  const [symbolNames, setSymbolNames] = useState({});

  const formatUnixTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const key = '3IBcNbfUTZQk7y9JgkUnP5dz0HWdOnK3R';

  const fetchSymbolNames = async () => {
    try {
      const url = `https://fcsapi.com/api-v3/forex/list?access_key=${key}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status || !data.response) throw new Error('Failed to fetch symbol names');

      const map = {};
      data.response.forEach((item) => {
        const symbol = item.symbol;
        const name = item.name;
        const [baseCode, quoteCode] = symbol.split('/');
        const words = name.trim().split(' ');
        const mid = Math.floor(words.length / 2);
        const baseName = words.slice(0, mid).join(' ');
        const quoteName = words.slice(mid).join(' ');
        map[symbol] = `${baseName} vs ${quoteName}`;
      });

      setSymbolNames(map);
    } catch (err) {
      setError('Failed to retrieve symbol information. Please try again later.');
    }
  };

  const fetchProfileData = async (symbols) => {
    try {
      const url = `https://fcsapi.com/api-v3/forex/profile?symbol=${symbols.join(',')}&access_key=${key}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status || !data.response) throw new Error('Failed to fetch profile data');

      const profileMap = {};
      data.response.forEach((item) => {
        profileMap[item.short_name] = item;
      });

      setProfiles(profileMap);
    } catch (err) {
      setError('Profile data failed to load. Please refresh the page.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const symbols = [
        // Major Pairs
        'EUR/USD',
        'USD/JPY',
        'GBP/USD',
        'USD/CHF',
        'USD/CAD',
        'AUD/USD',
        'NZD/USD',

        // Cross Pairs (Minor)
        'EUR/GBP',
        'EUR/JPY',
        'EUR/CHF',
        'EUR/AUD',
        'GBP/JPY',
        'GBP/CHF',
        'AUD/JPY',
        'AUD/NZD',
        'CAD/JPY',
        'CHF/JPY',

        // Commodities
        'XAU/USD', // Gold
        'XAG/USD', // Silver
        'XPT/USD', // Platinum
        'XPD/USD', // Palladium
        'WTI/USD', // Crude Oil WTI
        'BRENT/USD', // Brent Oil

        // Exotics (yang sering tersedia di broker besar)
        'USD/TRY',  // Turkish Lira
        'USD/SEK',  // Swedish Krona
        'USD/NOK',  // Norwegian Krone
        'USD/ZAR',  // South African Rand
        'USD/MXN',  // Mexican Peso
        'USD/HKD',  // Hong Kong Dollar
      ];


      const url = `https://fcsapi.com/api-v3/forex/latest?symbol=${symbols.join(',')}&access_key=${key}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.status || !data.response) throw new Error('Failed to fetch latest forex data');

      setPairs(data.response);

      const uniqueSymbols = [...new Set(symbols.flatMap((s) => s.split('/')))];
      await fetchProfileData(uniqueSymbols);
    } catch (err) {
      setError('An error occurred while retrieving data. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSymbolNames();
  }, []);

  const filteredPairs = pairs.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.s?.toLowerCase().includes(term) ||
      item.name?.toLowerCase().includes(term) ||
      item.symbol?.toLowerCase().includes(term)
    );
  });

  return (
    <main className="container mx-auto p-8 mt-12 font-sans">

      <div className="sticky top-20 z-10 pb-4">
        <input
          type="text"
          placeholder="Search EUR/USD, Euro, etc..."
          className="w-full px-4 bg-[#0A0A0A] py-2 border-b border-emerald-500 rounded-lg shadow focus:outline-none focus:shadow-emerald-500 focus:shadow-md transition ease-in-out delay-75 duration-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {filteredPairs.map((pair) => {
            const symbol = pair.s || pair.symbol;
            const isUp = parseFloat(pair.ch) > 0;
            const [base, quote] = symbol.split('/');
            const baseIcon = profiles[base]?.icon;
            const quoteIcon = profiles[quote]?.icon;

            return (
              <div
                key={pair.id || symbol}
                className="p-4 rounded-xl shadow-md shadow-emerald-500 hover:shadow-lg hover:scale-100 hover:-translate-y-1 transition ease-in-out delay-75 duration-300 hover:bg-black/35 hover:cursor-pointer"
              >
                <button
                  onClick={() => {
                    const pathSymbol = symbol.toLowerCase().replace('/', '');
                    router.push(`/charts/${pathSymbol}`);
                  }}


                  className="w-full text-left hover:cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {baseIcon && (
                        <img src={baseIcon} className="w-4 h-4 rounded-full" alt={base} />
                      )}
                      {quoteIcon && (
                        <img src={quoteIcon} className="w-4 h-4 rounded-full" alt={quote} />
                      )}
                      <h2 className="text-base md:text-xl font-bold text-gray-200" title={symbol}>
                        {symbol}
                      </h2>
                    </div>
                    <span className={`text-xs md:text-sm font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                      {pair.c} ({pair.cp})
                    </span>
                  </div>
                </button>
                <p className="text-gray-300 font-medium text-sm">{symbolNames[symbol]}</p>
                <div className="mt-3 space-y-1 text-sm text-gray-300">
                  <p>Open: {pair.o}</p>
                  <p>High: {pair.h}</p>
                  <p>Low: {pair.l}</p>
                  <p>
                    Change:{' '}
                    <span className={isUp ? 'text-green-600' : 'text-red-600'}>
                      {pair.ch}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Last updated: {formatUnixTime(pair.t)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
