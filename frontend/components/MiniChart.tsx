'use client'

import { Line } from 'react-chartjs-2'

interface MiniChartProps {
  data: number[]
  color: string
  isPositive: boolean
}

export default function MiniChart({ data, color, isPositive }: MiniChartProps) {
  const chartData = {
    labels: new Array(data.length).fill(''),
    datasets: [
      {
        data,
        borderColor: color,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  }

  return (
    <div className="h-16">
      <Line data={chartData} options={options} />
    </div>
  )
}
