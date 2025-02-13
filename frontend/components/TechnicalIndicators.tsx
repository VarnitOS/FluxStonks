'use client'

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import TiltedCard from './TiltedCard'

interface IndicatorData {
  status: string;
  message: string;
  data: {
    symbol: string;
    company_name: string;
    current_price: number;
    signals: {
      rsi: {
        value: number;
        signal: string;
        strength: string;
      };
      macd: {
        value: number;
        signal: number;
        histogram: number;
        trend: string;
      };
      moving_averages: {
        ma50: number;
        ma200: number;
        trend: string;
        strength: number;
      };
    };
    summary: {
      short_term: string;
      long_term: string;
      volatility: string;
      price_strength: string;
    };
  };
}

function SignalOverlay({ title, value, signal }: { 
  title: string;
  value: string | number;
  signal: string;
}) {
  const isPositive = signal.toLowerCase() === 'bullish';
  const isNeutral = signal.toLowerCase() === 'neutral';
  
  return (
    <div className="w-full h-full p-6 flex flex-col justify-between backdrop-blur-[2px]">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-sm font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${
          isNeutral ? 'bg-gray-500/60 text-white' :
          isPositive ? 'bg-green-500/60 text-white' : 'bg-red-500/60 text-white'
        } shadow-lg backdrop-blur-md`}>
          {signal}
        </div>
      </div>
      <div className="text-4xl text-white font-bold text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">{value}</div>
    </div>
  );
}

export default function TechnicalIndicators({ data }: { data: IndicatorData }) {
  const { signals, summary } = data.data;

  const getBackgroundForSignal = (signal: string, indicator: string) => {
    // Special backgrounds for each indicator
    if (indicator === 'RSI') {
      return 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832'; // Digital grid pattern
    }
    if (indicator === 'MACD') {
      return 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832'; // Abstract lines
    }
    
    // Default backgrounds based on signal
    const isPositive = signal.toLowerCase() === 'bullish';
    const isNeutral = signal.toLowerCase() === 'neutral';
    return isNeutral 
      ? 'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2029'
      : isPositive
        ? 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1964'
        : 'https://images.unsplash.com/photo-1607893378714-007fd47c8719?q=80&w=2070';
  };

  return (
    <div className="space-y-8">
      {/* Signal cards using TiltedCard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TiltedCard
          imageSrc={getBackgroundForSignal(signals.rsi.signal, 'RSI')}
          altText="Relative Strength Index"
          captionText={`RSI (Relative Strength Index): ${signals.rsi.value.toFixed(2)}`}
          containerHeight="200px"
          containerWidth="100%"
          imageHeight="200px"
          imageWidth="100%"
          rotateAmplitude={20}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
          overlayContent={
            <SignalOverlay
              title="Relative Strength Index (14)"
              value={signals.rsi.value.toFixed(2)}
              signal={signals.rsi.signal}
            />
          }
        />

        <TiltedCard
          imageSrc={getBackgroundForSignal(signals.macd.trend, 'MACD')}
          altText="Moving Average Convergence Divergence"
          captionText={`MACD: ${signals.macd.value.toFixed(2)}`}
          containerHeight="200px"
          containerWidth="100%"
          imageHeight="200px"
          imageWidth="100%"
          rotateAmplitude={20}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
          overlayContent={
            <SignalOverlay
              title="Moving Average Convergence Divergence"
              value={signals.macd.value.toFixed(2)}
              signal={signals.macd.trend}
            />
          }
        />

        <TiltedCard
          imageSrc={getBackgroundForSignal(signals.moving_averages.trend, 'MA')}
          altText="Moving Averages"
          captionText={`Moving Averages Strength: ${signals.moving_averages.strength.toFixed(2)}%`}
          containerHeight="200px"
          containerWidth="100%"
          imageHeight="200px"
          imageWidth="100%"
          rotateAmplitude={20}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={false}
          displayOverlayContent={true}
          overlayContent={
            <SignalOverlay
              title="Moving Averages (50/200)"
              value={`${signals.moving_averages.strength.toFixed(2)}%`}
              signal={signals.moving_averages.trend}
            />
          }
        />
      </div>

      {/* Summary Card */}
      <div className="bg-[#1E1F25]/30 rounded-3xl p-6 backdrop-blur-sm">
        <h3 className="text-white/60 text-sm font-medium mb-4">Market Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-white/50 text-sm mb-1">Short Term</div>
            <div className={`text-lg font-medium ${
              summary.short_term === 'Bullish' ? 'text-green-400' : 'text-red-400'
            }`}>{summary.short_term}</div>
          </div>
          <div>
            <div className="text-white/50 text-sm mb-1">Long Term</div>
            <div className={`text-lg font-medium ${
              summary.long_term === 'Bullish' ? 'text-green-400' : 'text-red-400'
            }`}>{summary.long_term}</div>
          </div>
          <div>
            <div className="text-white/50 text-sm mb-1">Volatility</div>
            <div className="text-lg font-medium text-white">{summary.volatility}</div>
          </div>
          <div>
            <div className="text-white/50 text-sm mb-1">Price Strength</div>
            <div className="text-lg font-medium text-blue-400">{summary.price_strength}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 