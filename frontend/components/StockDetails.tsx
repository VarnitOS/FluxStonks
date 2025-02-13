'use client'

import { useEffect, useState } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import SplitText from './SplitText'
import BlurText from './BlurText'
import TechnicalIndicators from './TechnicalIndicators'
import PixelCard from './PixelCard'
import StockChart from './StockChart'

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

export default function StockDetails({ symbol = 'AAPL' }: { symbol?: string }) {
  const [stockData, setStockData] = useState<StockDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [indicatorData, setIndicatorData] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockRes, indicatorRes, historyRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/stock/${symbol}`),
          fetch(`http://127.0.0.1:8000/api/indicators/${symbol}`),
          fetch(`http://127.0.0.1:8000/api/stock/${symbol}/history`)
        ]);
        
        const stockData = await stockRes.json();
        const indicatorData = await indicatorRes.json();
        const historyData = await historyRes.json();
        
        setStockData(stockData);
        setIndicatorData(indicatorData);
        setChartData(historyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="p-6">
        <div className="text-white">Stock not found</div>
      </div>
    );
  }

  const isPositive = stockData.change_percent >= 0;

  return (
    <div className="p-6">
      {/* Main content wrapper */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Main info and graph */}
        <div className="flex-1">
          {/* Header with stock info */}
          <div className="mb-8">
            <div className="flex items-start gap-8 mb-4">
              <div>
                <BlurText
                  text="Stock Details"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-2xl text-white/60 mb-4"
                />
                <SplitText
                  text={symbol}
                  className="text-4xl font-bold text-white"
                  delay={100}
                  animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                  easing={(t) => t * (2 - t)}
                  threshold={0.1}
                  rootMargin="-20px"
                  textAlign="left"
                />
              </div>

              <PixelCard variant="pink" className="!h-[120px] !w-[400px] !aspect-auto">
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-medium">Current Price</span>
                    <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <span>{isPositive ? '+' : ''}{stockData.change_percent.toFixed(2)}%</span>
                      {isPositive ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-4xl font-bold text-white">${stockData.price.toLocaleString()}</div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <div className="text-white/50">Open</div>
                        <div className="text-white font-medium">${stockData.open.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-white/50">Close</div>
                        <div className="text-white font-medium">${stockData.close.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </PixelCard>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatsCard title="Today's Range" value={`$${stockData.low.toLocaleString()} - $${stockData.high.toLocaleString()}`} />
              <StatsCard title="Volume" value={stockData.volume.toLocaleString()} />
              <StatsCard title="Market Cap" value={stockData.market_cap ? `$${(stockData.market_cap / 1e9).toFixed(2)}B` : '-'} />
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#1E1F25]/30 rounded-3xl p-6">
            <StockChart data={chartData} symbol={symbol} />
          </div>
        </div>

        {/* Right column - Technical indicators */}
        {indicatorData && (
          <div className="lg:w-[400px]">
            <BlurText
              text="Technical Analysis"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-2xl text-white/60 mb-6"
            />
            <TechnicalIndicators data={indicatorData} />
          </div>
        )}
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