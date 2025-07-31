import ForexChartClient from './forexChartClient';

const symbols = [
  // Major Pairs
  'eurusd',
  'usdjpy',
  'gbpusd',
  'usdchf',
  'usdcad',
  'audusd',
  'nzdusd',

  // Cross Pairs (Minor)
  'eurgbp',
  'eurjpy',
  'eurchf',
  'euraud',
  'gbpjpy',
  'gbpchf',
  'audjpy',
  'audnzd',
  'cadjpy',
  'chfjpy',

  // Commodities
  'xauusd',  // Gold
  'xagusd',  // Silver
  'xptusd',  // Platinum
  'xpdusd',  // Palladium
  'wtiusd',  // Crude Oil WTI
  'brentusd', // Brent Oil

  // Exotics
  'usdtry',
  'usdsek',
  'usdnok',
  'usdzar',
  'usdmxn',
  'usdhkd',
];



export async function generateStaticParams() {
  return symbols.map((symbol) => ({ symbol }));
}

export default function ChartPage({ params }) {
  const symbol = params.symbol.toUpperCase().replace(/(.{3})(.{3})/, '$1/$2');
  return (
    <div className="p-4">
      <main className='min-h-screen w-full'>
        <ForexChartClient symbol={symbol} />
      </main>

    </div>
  );
}
