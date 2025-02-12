'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'

interface DowData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
}

export default function DowIndex() {
  const [dowData, setDowData] = useState<DowData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchDowData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/market/dow');
      const data = await response.json();
      if (data && data.length > 0) {
        // Round all numeric values to 2 decimal places for each entry
        const roundedData = data.map((item: DowData) => ({
          ...item,
          price: Number(item.price.toFixed(2)),
          change: Number(item.change.toFixed(2)),
          change_percent: Number(item.change_percent.toFixed(2))
        }));
        setDowData(roundedData);
      }
    } catch (error) {
      console.error('Error fetching Dow data:', error);
    }
  };

  // Fetch data every 10 minutes
  useEffect(() => {
    fetchDowData();
    const fetchInterval = setInterval(fetchDowData, 10 * 60 * 1000);
    return () => clearInterval(fetchInterval);
  }, []);

  // Cycle through indices every 3 seconds
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % dowData.length);
    }, 3000);
    return () => clearInterval(cycleInterval);
  }, [dowData.length]);

  if (dowData.length === 0) {
    return (
      <GlassCard 
        title="Market Indices"
        description="Dow Jones Index Values"
        icon={<ChartBarIcon className="w-5 h-5" />}
        href="#"
        stats={{
          value: "Loading...",
          change: 0,
          additionalValue: "--"
        }}
        spotlightColor="rgba(59, 130, 246, 0.7)" // blue-500 with opacity
      />
    );
  }

  const currentDow = dowData[currentIndex];
  const isPositive = currentDow.change_percent >= 0;

  return (
    <GlassCard 
      title="Market Indices"
      description="Dow Jones Index Values"
      icon={<ChartBarIcon className="w-5 h-5" />}
      href="#"
      stats={{
        value: currentDow.symbol,
        change: currentDow.change_percent,
        additionalValue: `$${currentDow.price.toLocaleString()}`
      }}
      spotlightColor={isPositive ? "rgba(34, 197, 94, 0.7)" : "rgba(239, 68, 68, 0.7)"} // green-500 or red-500 with opacity
    />
  );
}
