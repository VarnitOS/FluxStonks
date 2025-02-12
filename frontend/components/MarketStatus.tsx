'use client'

import { useEffect, useState } from 'react'

interface MarketStatusData {
  status: string
  market_open: boolean
  timestamp: string
}

interface TimeLeft {
  hours: number
  minutes: number
}

function calculateMarketTime(timestamp: string, market_open: boolean): TimeLeft {
  const marketOpenTime = 9.5 * 60  // 9:30 AM in minutes
  const marketCloseTime = 16 * 60  // 4:00 PM in minutes
  
  const now = new Date(timestamp)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  if (market_open) {
    return {
      hours: Math.floor((marketCloseTime - currentMinutes) / 60),
      minutes: (marketCloseTime - currentMinutes) % 60
    }
  } else {
    const nextOpenMinutes = currentMinutes >= marketCloseTime 
      ? (24 * 60 - currentMinutes) + marketOpenTime
      : marketOpenTime - currentMinutes
    
    return {
      hours: Math.floor(nextOpenMinutes / 60),
      minutes: nextOpenMinutes % 60
    }
  }
}

export default function MarketStatus() {
  const [marketData, setMarketData] = useState<MarketStatusData | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0 })

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/')
        const data = await response.json()
        setMarketData(data)
        setTimeLeft(calculateMarketTime(data.timestamp, data.market_open))
      } catch (error) {
        console.error('Error fetching market status:', error)
      }
    }

    fetchMarketStatus()
    const interval = setInterval(fetchMarketStatus, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  if (!marketData) return null

  const timeCircleOffset = ((timeLeft.hours * 60 + timeLeft.minutes) / (24 * 60)) * 100
  const statusColor = marketData.market_open ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'

  return (
    <div className="bg-[#1E1F25]/80 rounded-3xl p-6">
      <h3 className="text-xl text-white/90 font-medium mb-6">Market Status</h3>
      <div className="flex flex-col space-y-4">
        {/* Time Circle */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-[#2D2E36]"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke={statusColor}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - timeCircleOffset / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-white text-lg font-medium">
                    {timeLeft.hours}h {timeLeft.minutes}m
                  </span>
                  <div className="text-white/60 text-sm">
                    {marketData.market_open ? 'Until Close' : 'Until Open'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Status */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-[#2D2E36]"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke={statusColor}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-white text-lg font-medium">
                    {marketData.market_open ? 'OPEN' : 'CLOSED'}
                  </span>
                  <div className="text-white/60 text-sm">Market Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Info */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-[#2D2E36]"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * 0.5}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-white text-lg font-medium">IEX</span>
                  <div className="text-white/60 text-sm">Exchange</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 