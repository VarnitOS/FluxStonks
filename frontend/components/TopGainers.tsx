'use client'

import { useState, useEffect } from 'react'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'

interface StockData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
}

export default function TopGainers() {
  const [gainersData, setGainersData] = useState<StockData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchGainersData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/market/gainers');
      const data = await response.json();
      if (data && data.length > 0) {
        // Round all numeric values to 2 decimal places for each stock
        const roundedData = data.map((stock: StockData) => ({
          ...stock,
          price: Number(stock.price.toFixed(2)),
          change: Number(stock.change.toFixed(2)),
          change_percent: Number(stock.change_percent.toFixed(2))
        }));
        setGainersData(roundedData);
      }
    } catch (error) {
      console.error('Error fetching gainers data:', error);
    }
  };

  // Fetch data every 10 minutes
  useEffect(() => {
    fetchGainersData();
    const fetchInterval = setInterval(fetchGainersData, 10 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Cycle through gainers every 3 seconds
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % gainersData.length);
    }, 3000);
    return () => clearInterval(cycleInterval);
  }, [gainersData.length]);

  if (gainersData.length === 0) {
    return (
      <GlassCard 
        title="Top Gainers"
        description="24h Price Change"
        icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
        href="#"
        stats={{
          value: "Loading...",
          change: 0,
          additionalValue: "--"
        }}
        spotlightColor="rgba(34, 197, 94, 0.7)"
      />
    );
  }

  const currentStock = gainersData[currentIndex];

  return (
    <GlassCard 
      title="Top Gainers"
      description="24h Price Change"
      icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
      href="#"
      stats={{
        value: currentStock.symbol,
        change: currentStock.change_percent,
        additionalValue: `$${currentStock.price.toLocaleString()}`
      }}
      spotlightColor="rgba(34, 197, 94, 0.7)"
    />
  );
}
