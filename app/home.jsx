'use client';

export default function Home() {
    return (
        <main className="container mx-auto p-6 md:p-10 mt-12 font-sans">
            <div className="p-8 rounded-2xl bg-[#0A0A0A] shadow-lg shadow-emerald-500/30 text-center">
                {/* Development Badge */}
                <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-400">
                    Development Stage
                </div>

                {/* Title & Tagline */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    FlowMetrics <span className="text-emerald-400">Forex Viewer</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base mb-8 max-w-2xl mx-auto">
                    A portfolio application showcasing real-time forex market data,
                    interactive charts, and basic pivot level analysis. <strong>Not intended for trading purposes</strong>,
                    purely for demonstration and development reference.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
                    <a
                        href="/forexlist"
                        className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm md:text-base font-medium transition"
                    >
                        View Forex List
                    </a>

                    <a
                        href="/developer"
                        className="px-6 py-3 border border-emerald-500 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm md:text-base font-medium transition"
                    >
                        About the Developer
                    </a>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-emerald-500/20">
                        <h3 className="text-white font-semibold mb-2">Forex Data</h3>
                        <p className="text-gray-400 text-sm">
                            Displaying real-time forex data as a simple reference for market analysis.
                        </p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-emerald-500/20">
                        <h3 className="text-white font-semibold mb-2">Interactive Charts</h3>
                        <p className="text-gray-400 text-sm">
                            Real-time price charts with both line and candlestick options.
                        </p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-emerald-500/20">
                        <h3 className="text-white font-semibold mb-2">Automatic Pivots</h3>
                        <p className="text-gray-400 text-sm">
                            Automatically calculate and display basic pivot levels for quick technical insights.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
