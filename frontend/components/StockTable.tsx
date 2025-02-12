'use client'

import { useRef, useEffect, useState } from 'react'

interface StockData {
  symbol: string;
  price: number;
  high: number;
  low: number;
  close: number;
  change: number;
  change_percent: number;
}

export default function StockTable() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const fetchStockData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/market/dow');
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Create duplicated data for infinite scroll effect
  const repeatedData = [...stockData, ...stockData, ...stockData].map((stock, i) => ({
    ...stock,
    uniqueKey: `${stock.symbol}-${i}`
  }));

  return (
    <div className="w-full">
      {/* Headers */}
      <div className="grid grid-cols-7 gap-4 px-6 py-3 text-white/60 text-sm font-medium mb-2">
        <div>Symbol</div>
        <div className="text-right">High</div>
        <div className="text-right">Low</div>
        <div className="text-right">Close</div>
        <div className="text-right">Change</div>
        <div className="text-right">Change %</div>
        <div className="text-right">5 Day Performance</div>
      </div>

      {/* Scroll container */}
      <div 
        className="relative h-[600px] overflow-hidden" // Increased height
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`animate-scroll ${isPaused ? 'animation-pause' : ''}`}
        >
          {repeatedData.map((stock) => (
            <StockRow key={stock.uniqueKey} stock={stock} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StockRow({ stock }: { stock: StockData & { uniqueKey: string } }) {
  const isPositive = stock.change_percent >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid grid-cols-7 gap-4 px-6 py-3 text-white hover:bg-white/5 transition-colors">
      <div className="font-medium">{stock.symbol}</div>
      <div className="text-right">${stock.high.toLocaleString()}</div>
      <div className="text-right">${stock.low.toLocaleString()}</div>
      <div className="text-right">${stock.close.toLocaleString()}</div>
      <div className={`text-right ${changeColor}`}>
        {isPositive ? '+' : ''}{stock.change.toFixed(2)}
      </div>
      <div className={`text-right ${changeColor}`}>
        {isPositive ? '+' : ''}{stock.change_percent.toFixed(2)}%
      </div>
      <div className="text-right flex justify-end space-x-1">
        {Array(5).fill(0).map((_, i) => (
          <div 
            key={i}
            className={`w-2 h-8 rounded-sm ${Math.random() > 0.5 ? 'bg-green-500' : 'bg-red-500'}`}
          />
        ))}
      </div>
    </div>
  );
} 