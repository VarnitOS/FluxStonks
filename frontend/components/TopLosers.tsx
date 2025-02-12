'use client'

import { useState, useEffect } from 'react'
import { ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'

interface StockData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
}

export default function TopLosers() {
  const [losersData, setLosersData] = useState<StockData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchLosersData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/market/losers');
      const data = await response.json();
      if (data && data.length > 0) {
        // Round all numeric values to 2 decimal places for each stock
        const roundedData = data.map((stock: StockData) => ({
          ...stock,
          price: Number(stock.price.toFixed(2)),
          change: Number(stock.change.toFixed(2)),
          change_percent: Number(stock.change_percent.toFixed(2))
        }));
        setLosersData(roundedData);
      }
    } catch (error) {
      console.error('Error fetching losers data:', error);
    }
  };

  // Fetch data every 10 minutes
  useEffect(() => {
    fetchLosersData();
    const fetchInterval = setInterval(fetchLosersData, 10 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Cycle through losers every 3 seconds
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % losersData.length);
    }, 3000);
    return () => clearInterval(cycleInterval);
  }, [losersData.length]);

  if (losersData.length === 0) {
    return (
      <GlassCard 
        title="Top Losers"
        description="24h Price Change"
        icon={<ArrowTrendingDownIcon className="w-5 h-5" />}
        href="#"
        stats={{
          value: "Loading...",
          change: 0,
          additionalValue: "--"
        }}
        spotlightColor="rgba(239, 68, 68, 0.7)" // red-500 with opacity
      />
    );
  }

  const currentStock = losersData[currentIndex];

  return (
    <GlassCard 
      title="Top Losers"
      description="24h Price Change"
      icon={<ArrowTrendingDownIcon className="w-5 h-5" />}
      href="#"
      stats={{
        value: currentStock.symbol,
        change: currentStock.change_percent,
        additionalValue: `$${currentStock.price.toLocaleString()}`
      }}
      spotlightColor="rgba(239, 68, 68, 0.7)" // red-500 with opacity
    />
  );
}
