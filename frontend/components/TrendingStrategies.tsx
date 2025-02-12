'use client'

import TopGainers from './TopGainers'
import TopLosers from './TopLosers'
import DowIndex from './DowIndex'

export default function TrendingStrategies() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <TopGainers />
      <TopLosers />
      <DowIndex />
    </div>
  )
}
