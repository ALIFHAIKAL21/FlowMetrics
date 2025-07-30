'use client';

import { createChart } from 'lightweight-charts';
import { useRef, useState, useEffect } from 'react';
import { fetchWithFCSKey } from '../../utils/fcsApiClient';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';

const PERIOD_OPTIONS = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];

export default function ForexChartClient({ symbol }) {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('1d');
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Fetch history
  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchWithFCSKey(
          (key) =>
            `https://fcsapi.com/api-v3/forex/history?symbol=${symbol}&period=${period}&access_key=${key}`
        );

        const parsed = Object.values(json.response).map((item) => ({
          time: item.t,
          value: parseFloat(item.c),
        }));

        setData(parsed);
      } catch (err) {
        setError('Failed to load chart data. Please try again later.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, period]);

  // Fetch latest
  useEffect(() => {
    let interval;
    const fetchLatest = async () => {
      try {
        const json = await fetchWithFCSKey(
          (key) =>
            `https://fcsapi.com/api-v3/forex/latest?symbol=${symbol}&access_key=${key}`
        );
        const latestData = json.response?.[0];
        setLatest(latestData || null);
      } catch {
        setLatest(null);
      }
    };

    fetchLatest();
    interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Render chart
   useEffect(() => {
  const container = chartContainerRef.current;
  if (!container || !data.length) return;

  let chart;
  let series;
  let observer;

  try {
    // Bersihkan chart lama dengan aman
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Buat chart baru
    chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: '#0A0A0A' },
        textColor: '#CBD5E0',
      },
      grid: {
        vertLines: { color: '#2d3748' },
        horzLines: { color: '#2d3748' },
      },
      rightPriceScale: { borderColor: '#2d3748' },
      timeScale: {
        borderColor: '#2d3748',
        timeVisible: true,
      },
    });

    series = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 2,
    });

    series.setData(data);

    chartRef.current = chart;
    seriesRef.current = series;

    // Setup observer resize
    observer = new ResizeObserver(() => {
      chart.resize(container.clientWidth, container.clientHeight);
    });

    observer.observe(container);
    resizeObserverRef.current = observer;
  } catch (err) {
    console.error('Chart rendering error:', err);
  }

  return () => {
    try {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    } catch (cleanupError) {
      console.warn('Cleanup error:', cleanupError);
    }
  };
}, [data]);



  const formatTime = (unix) => new Date(unix * 1000).toLocaleString();

  const renderPriceInfo = () => {
    if (!latest) return null;
    const isUp = parseFloat(latest.ch) >= 0;
    const arrow = isUp ? '▲' : '▼';
    const color = isUp ? 'text-green-400' : 'text-red-400';

    return (
      <div className="absolute top-4 left-4 z-10 shadow-md text-sm p-3 rounded-lg border border-slate-700 text-white space-y-1 bg-slate-900/80 backdrop-blur">
        <div className="font-semibold">{latest.s}</div>
        <div className={`text-xl font-bold ${color}`}>
          {arrow} {latest.c}
        </div>
        <div className={`${color}`}>
          {latest.ch} ({latest.cp})
        </div>
        <div className="text-xs text-slate-400">
          Last updated: {formatTime(latest.t)}
        </div>
      </div>
    );
  };

  const renderPeriodSelector = () => (
    <div className="absolute top-4 right-4 z-10">
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="bg-slate-800 text-slate-200 border border-slate-600 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {PERIOD_OPTIONS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="relative min-h-screen ">
      {loading ? (
        <Loader text="Loading chart..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : data.length === 0 ? (
        <p className="text-slate-400 font-medium text-center mt-8">
          No chart data available.
        </p>
      ) : (
        <>
          {renderPriceInfo()}
          {renderPeriodSelector()}
          <div
            ref={chartContainerRef}
            className="w-full h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]"
          />
        </>
      )}
    </div>
  );
}
