'use client'

import BackgroundEffects from './BackgroundEffects'
import Header from './Header'
import TrendingStrategies from './TrendingStrategies'
import NewsCard from './NewsCard'
import MarketActivity from './MarketActivity'
import RotatingText from './RotatingText'
import GradientText from './GradientText'
import StockTable from './StockTable'
import BacktestCard from './BacktestCard'

export default function HomeContent() {
  return (
    <div className="relative min-h-screen w-full bg-[#0A0B0F]">
      <BackgroundEffects />

      {/* Main Content */}
      <main className="relative w-full px-6 py-6">
        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={5}
            showBorder={false}
            className="text-4xl font-semibold tracking-tight"
          >
            Top Trending
          </GradientText>
          <RotatingText
            texts={['Index', 'Stocks', 'Movers', 'Gainers', 'Losers']}
            mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-xl text-white overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg animate-gradient bg-[length:200%_200%]"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Trending & Stocks */}
          <div className="col-span-9 space-y-6">
            {/* Trending Cards */}
            <TrendingStrategies />
            
            {/* Stock Table */}
            <div className="bg-[#1E1F25]/30 rounded-3xl p-6 min-h-[400px]">
              <StockTable />
            </div>
          </div>
          
          {/* Right Column - News & Market Activity */}
          <div className="col-span-3 space-y-6">
            {/* News Card - No glass background */}
            <BacktestCard/>
            
            {/* Market Activity */}
            <MarketActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
