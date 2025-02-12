'use client'

import { useEffect, useState } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface StockDetail {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volume: number;
  market_cap?: number;
  pe_ratio?: number;
  dividend_yield?: number;
}

export default function StockPage({ params }: { params: { symbol: string } }) {
  const [stockData, setStockData] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/stock/${params.symbol}`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [params.symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] p-6">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] p-6">
        <div className="text-white">Stock not found</div>
      </div>
    );
  }

  const isPositive = stockData.change_percent >= 0;

  return (
    <div className="min-h-screen bg-[#0A0B0F] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-white">{params.symbol}</h1>
          <div className={`flex items-center gap-2 text-2xl ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowTrendingUpIcon className="w-6 h-6" /> : <ArrowTrendingDownIcon className="w-6 h-6" />}
            <span>{isPositive ? '+' : ''}{stockData.change_percent.toFixed(2)}%</span>
          </div>
        </div>
        <div className="text-3xl text-white/90">${stockData.price.toLocaleString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard title="Today's Range" value={`$${stockData.low.toLocaleString()} - $${stockData.high.toLocaleString()}`} />
        <StatsCard title="Open" value={`$${stockData.open.toLocaleString()}`} />
        <StatsCard title="Close" value={`$${stockData.close.toLocaleString()}`} />
        <StatsCard title="Volume" value={stockData.volume.toLocaleString()} />
        {stockData.market_cap && (
          <StatsCard title="Market Cap" value={`$${(stockData.market_cap / 1e9).toFixed(2)}B`} />
        )}
        {stockData.pe_ratio && (
          <StatsCard title="P/E Ratio" value={stockData.pe_ratio.toFixed(2)} />
        )}
        {stockData.dividend_yield && (
          <StatsCard title="Dividend Yield" value={`${stockData.dividend_yield.toFixed(2)}%`} />
        )}
      </div>

      {/* Chart will go here */}
      <div className="mt-8 bg-[#1E1F25]/30 rounded-3xl h-[400px]">
        {/* Add chart component later */}
      </div>
    </div>
  );
}

function StatsCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#1E1F25]/30 rounded-3xl p-6">
      <div className="text-white/60 text-sm mb-2">{title}</div>
      <div className="text-white text-xl font-medium">{value}</div>
    </div>
  );
} 