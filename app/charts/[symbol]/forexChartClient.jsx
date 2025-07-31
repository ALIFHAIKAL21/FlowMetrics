'use client';

import { createChart } from 'lightweight-charts';
import { useRef, useState, useEffect } from 'react';
import { fetchWithFCSKey } from '../../utils/fcsApiClient';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import { CandlestickChart, LineChart } from "lucide-react";

const PERIOD_OPTIONS = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
const PIVOT_METHODS = ['classic', 'fibonacci', 'camarilla', 'woodie', 'demark'];

export default function ForexChartClient({ symbol }) {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('1d');
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  const [pivotData, setPivotData] = useState(null);
  const [pivotMethod, setPivotMethod] = useState('classic');
  const [showPivot, setShowPivot] = useState(true);

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const pivotLinesRef = useRef([]);
  const resizeObserverRef = useRef(null);

  const normalizeTimestamp = (t) => {
    let ts = parseInt(t, 10);
    if (ts > 9999999999) ts = Math.floor(ts / 1000);
    return ts;
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Fetch data chart
  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = (key) =>
          `https://fcsapi.com/api-v3/forex/history?symbol=${symbol}&period=${period}&access_key=${key}`;

        const json = await fetchWithFCSKey(endpoint);

        const parsed =
          chartType === 'candlestick'
            ? Object.values(json.response).map((item) => ({
                time: normalizeTimestamp(item.t),
                open: parseFloat(item.o),
                high: parseFloat(item.h),
                low: parseFloat(item.l),
                close: parseFloat(item.c),
              }))
            : Object.values(json.response).map((item) => ({
                time: normalizeTimestamp(item.t),
                value: parseFloat(item.c),
              }));

        setData(parsed);
      } catch {
        setError('Failed to load chart data. Please try again later.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, period, chartType]);

  // Fetch latest price
  useEffect(() => {
    let interval;
    const fetchLatest = async () => {
      try {
        const json = await fetchWithFCSKey(
          (key) =>
            `https://fcsapi.com/api-v3/forex/latest?symbol=${symbol}&access_key=${key}`
        );
        setLatest(json.response?.[0] || null);
      } catch {
        setLatest(null);
      }
    };

    fetchLatest();
    interval = setInterval(fetchLatest, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Fetch pivot
  useEffect(() => {
    if (!symbol) return;
    const fetchPivot = async () => {
      try {
        const endpoint = (key) =>
          `https://fcsapi.com/api-v3/forex/pivot_points?symbol=${symbol}&period=1d&access_key=${key}`;
        const json = await fetchWithFCSKey(endpoint);
        setPivotData(json.response.pivot_point);
      } catch (err) {
        console.error("Pivot fetch error", err);
      }
    };
    fetchPivot();
  }, [symbol]);

  // Draw chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !data.length) return;

    // Bersihkan container & observer sebelumnya
    if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    container.innerHTML = '';
    chartRef.current = null;
    pivotLinesRef.current = [];

    const chart = createChart(container, {
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
        timeVisible: !(period === '1d' || period === '1w'),
      },
    });

    const series =
      chartType === 'candlestick'
        ? chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
          })
        : chart.addLineSeries({
            color: '#10b981',
            lineWidth: 2,
          });

    series.setData(data);

    chartRef.current = chart;
    seriesRef.current = series;

    // Draw pivot jika valid
    if (pivotData && pivotData[pivotMethod] && showPivot) {
      drawPivotLines(chart, pivotData[pivotMethod]);
    }

    const observer = new ResizeObserver(() => {
      chart.resize(container.clientWidth, container.clientHeight);
    });
    observer.observe(container);
    resizeObserverRef.current = observer;

    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      container.innerHTML = '';
      chartRef.current = null;
    };
  }, [data, chartType, pivotData, pivotMethod, showPivot]);

  // Tambah zone transparan antara 2 level
  const addZone = (chart, from, to, color) => {
    const fromNum = parseFloat(from);
    const toNum = parseFloat(to);
    if (isNaN(fromNum) || isNaN(toNum)) return;

    const areaSeries = chart.addAreaSeries({
      topColor: color + '22',
      bottomColor: color + '00',
      lineColor: color,
      lineWidth: 0,
    });
    const zoneData = data.map((d) => ({
      time: d.time,
      value: toNum,
    }));
    areaSeries.setData(zoneData);
    pivotLinesRef.current.push(areaSeries);
  };

  // Draw pivot lines
  const drawPivotLines = (chart, levels) => {
    pivotLinesRef.current.forEach((line) => line.remove());
    pivotLinesRef.current = [];

    if (!levels || Object.keys(levels).length === 0 || !data.length) return;

    const colors = {
      PP: '#FFD700',
      R: '#FF4B4B',
      S: '#3B82F6',
    };

    const addLine = (price, label, color) => {
      const numericPrice = parseFloat(price);
      if (price === undefined || price === null || isNaN(numericPrice)) return;

      const lineSeries = chart.addLineSeries({
        color,
        lineWidth: 1,
        priceLineVisible: false,
      });
      lineSeries.setData(data.map((d) => ({ time: d.time, value: numericPrice })));

      // Label di price axis
      lineSeries.createPriceLine({
        price: numericPrice,
        color,
        lineWidth: 1,
        lineStyle: 2, // dashed
        axisLabelVisible: true,
        title: label || '',
      });

      pivotLinesRef.current.push(lineSeries);
    };

    // Tambah PP
    addLine(levels.pp, 'PP', colors.PP);

    // Tambah R1-R3
    for (let i = 1; i <= 3; i++) addLine(levels[`R${i}`], `R${i}`, colors.R);

    // Tambah S1-S3
    for (let i = 1; i <= 3; i++) addLine(levels[`S${i}`], `S${i}`, colors.S);

    // Zona antara PP-R1 dan PP-S1
    if (levels.R1 && levels.pp) addZone(chart, levels.pp, levels.R1, colors.R);
    if (levels.S1 && levels.pp) addZone(chart, levels.S1, levels.pp, colors.S);
  };

  // Navbar
  const renderNavbar = () => {
    const isUp = parseFloat(latest?.ch || 0) >= 0;
    const arrow = isUp ? '▲' : '▼';
    const color = isUp ? 'text-green-400' : 'text-red-400';

    return (
      <nav className="absolute top-0 left-0 w-full bg-[#0A0A0A] shadow-md p-1 md:p-2 shadow-emerald-500/35 z-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 py-1 gap-1 sm:gap-2">
          {/* Info pair */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-white">
            <span className="font-medium text-[11px] sm:text-xs md:text-sm">{latest?.s || symbol}</span>
            {latest && (
              <div className="flex items-center gap-2">
                <span className={`text-[11px] sm:text-xs md:text-sm font-medium ${color}`}>
                  {arrow} {latest.c}
                </span>
                <span className={`text-[10px] sm:text-[11px] md:text-xs ${color}`}>
                  {latest.ch} ({latest.cp})
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex w-full sm:w-auto justify-between sm:justify-end gap-2 mt-1 sm:mt-0">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="flex-1 sm:flex-none bg-[#0A0A0A] text-slate-200 border-b border-emerald-500/35 px-1 py-0.5 rounded-md text-[11px] sm:text-xs"
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <button
              onClick={() => setChartType((prev) => (prev === 'line' ? 'candlestick' : 'line'))}
              className="flex items-center gap-1 text-[11px] sm:text-xs text-emerald-400 border border-emerald-400 px-2 py-0.5 rounded hover:bg-emerald-500/20"
            >
              {chartType === 'line' ? (
                <>
                  <CandlestickChart size={14} className="text-emerald-400" />
                  <span>Candle</span>
                </>
              ) : (
                <>
                  <LineChart size={14} className="text-emerald-400" />
                  <span>Line</span>
                </>
              )}
            </button>

            <select
              value={pivotMethod}
              onChange={(e) => setPivotMethod(e.target.value)}
              className="bg-[#0A0A0A] text-slate-200 border border-emerald-500/35 px-1 py-0.5 rounded-md text-[11px] sm:text-xs"
            >
              {PIVOT_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>

            <button
              onClick={() => setShowPivot(!showPivot)}
              className="text-[11px] sm:text-xs border px-2 py-0.5 rounded text-emerald-400 border-emerald-400 hover:bg-emerald-500/20"
            >
              {showPivot ? 'Hide Pivot' : 'Show Pivot'}
            </button>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="relative min-h-screen">
      {loading ? (
        <Loader text="Loading chart..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : data.length === 0 ? (
        <p className="text-slate-400 font-medium text-center mt-8">No chart data available.</p>
      ) : (
        <>
          {renderNavbar()}

          {/* Panel Info Pivot */}
          {pivotData && pivotData[pivotMethod] && latest && (
            <div className="absolute top-12 left-2 bg-black/70 border border-emerald-500 text-white text-xs rounded p-2">
              <p className="font-semibold mb-1">Pivot ({pivotMethod})</p>
              {Object.entries(pivotData[pivotMethod]).map(([key, val]) => {
                const levelPrice = parseFloat(val);
                const currentPrice = parseFloat(latest.c);
                const diff = (currentPrice - levelPrice).toFixed(2);
                const distance = diff > 0 ? `+${diff}` : diff;

                return (
                  <p key={key}>
                    {key}: {val} <span className="text-slate-400 ml-1">({distance})</span>
                  </p>
                );
              })}
            </div>
          )}

          <div className="pt-0 md:pt-5">
            <div
              ref={chartContainerRef}
              className="w-full h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]"
            />
          </div>
        </>
      )}
    </div>
  );
}
// tes 