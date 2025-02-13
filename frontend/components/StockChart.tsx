'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, CandlestickSeriesOptions, HistogramSeriesOptions } from 'lightweight-charts'

interface ChartData {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface StockChartProps {
  data: ChartData[]
  symbol: string
}

const timeframes = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
  { label: 'ALL', value: 'all' }
]

export default function StockChart({ data, symbol }: StockChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m')
  
  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(39, 39, 42, 0.3)' },
        horzLines: { color: 'rgba(39, 39, 42, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      crosshair: {
        vertLine: {
          color: '#606060',
          width: 0.5,
          style: 1,
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          color: '#606060',
          width: 0.5,
          style: 1,
          visible: true,
          labelVisible: true,
        },
      },
    }) as IChartApi & {
      addCandlestickSeries(options?: CandlestickSeriesOptions): any;
      addHistogramSeries(options?: HistogramSeriesOptions): any;
    }

    const mainSeries = chart.addCandlestickSeries({
      lastValueVisible: true,
      title: 'OHLC',
      visible: true,
      priceLineVisible: true,
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickVisible: true,
      borderColor: '#000000',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickColor: '#737375',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444'
    })

    const volumeSeries = chart.addHistogramSeries({
      color: '#60a5fa',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    const formattedData = data.map(item => ({
      time: new Date(item.timestamp).getTime() / 1000,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))

    const volumeData = data.map(item => ({
      time: new Date(item.timestamp).getTime() / 1000,
      value: item.volume,
      color: item.close >= item.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    }))

    mainSeries.setData(formattedData)
    volumeSeries.setData(volumeData)

    chart.timeScale().fitContent()

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth || 800,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data])

  const handleTimeframeChange = async (timeframe: string) => {
    setSelectedTimeframe(timeframe)
    // Here you would fetch new data based on timeframe
    // const newData = await fetch(`/api/stock/${symbol}/history/${timeframe}`)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/60 text-sm">Price Chart</div>
        <div className="flex gap-2">
          {timeframes.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTimeframeChange(value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTimeframe === value
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-[#1E1F25]/50 text-white/60 hover:bg-[#1E1F25] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[500px]" />
    </div>
  )
} 