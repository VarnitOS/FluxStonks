'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import CountUp from './CountUp'

interface MarketStatusData {
  status: string
  market_open: boolean
  timestamp: string
}

interface TimeLeft {
  hours: number
  minutes: number
}

interface MarketData {
  label: string
  color: string
  size: string
  position: string
  getValue: (data: MarketStatusData, timeLeft: TimeLeft) => { 
    value: string | React.ReactNode
    subtext: string 
  }
}

const marketData: MarketData[] = [
  {
    label: 'Market Status',
    color: '#ec4899', // pink
    size: 'w-32 h-32',
    position: 'left-1/2 -translate-x-28 top-16', // Moved more left and up
    getValue: (data: MarketStatusData) => ({
      value: data.market_open ? 'OPEN' : 'CLOSED',
      subtext: data.status
    })
  },
  {
    label: 'Time Left',
    color: '#9333ea', // purple
    size: 'w-32 h-32',
    position: 'left-1/2 translate-x-0 top-16', // Adjusted right position and up
    getValue: (data: MarketStatusData, timeLeft: TimeLeft) => ({
      value: (
        <div className="flex items-baseline gap-1">
          <div className="flex items-baseline">
            <CountUp
              from={0}
              to={timeLeft.hours}
              duration={1}
              className="text-2xl text-white font-bold tracking-tight"
            />
            <span className="text-2xl text-white font-bold tracking-tight">h</span>
          </div>
          <div className="flex items-baseline">
            <CountUp
              from={0}
              to={timeLeft.minutes}
              duration={1}
              className="text-2xl text-white font-bold tracking-tight"
            />
            <span className="text-2xl text-white font-bold tracking-tight">m</span>
          </div>
        </div>
      ),
      subtext: data.market_open ? 'Until Close' : 'Until Open'
    })
  },
  {
    label: 'Exchange',
    color: '#1E1F25', // dark
    size: 'w-28 h-28',
    position: 'left-1/2 -translate-x-14 top-36', // Moved more left and adjusted down
    getValue: () => ({
      value: 'IEX',
      subtext: 'Exchange'
    })
  }
]

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

export default function MarketActivity() {
  const [marketStatus, setMarketStatus] = useState<MarketStatusData | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0 })

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/')
        const data = await response.json()
        setMarketStatus(data)
        setTimeLeft(calculateMarketTime(data.timestamp, data.market_open))
      } catch (error) {
        console.error('Error fetching market status:', error)
      }
    }

    fetchMarketStatus()
    const interval = setInterval(fetchMarketStatus, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  if (!marketStatus) return null

  return (
    <div className="bg-[#1E1F25]/80 rounded-3xl p-4">
      <h3 className="text-2xl text-white font-medium mb-2">Today's Market Activity</h3>
      <div className="relative h-60 flex items-center justify-center">
        {marketData.map((item) => {
          const info = item.getValue(marketStatus, timeLeft)
          return (
            <div
              key={item.label}
              className={`absolute ${item.position} ${item.size} rounded-full flex items-center justify-center flex-col transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm`}
              style={{ backgroundColor: item.color }}
            >
              {typeof info.value === 'string' ? (
                <span className="text-2xl text-white font-bold tracking-tight">{info.value}</span>
              ) : (
                info.value
              )}
              <span className="text-white/90 text-sm font-medium mt-1">{info.subtext}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
