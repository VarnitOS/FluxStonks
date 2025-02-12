'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  image_url: string;
  timestamp: string;
  tickers?: string[];
}

interface RollingGalleryProps {
  items: NewsItem[];
  autoplay?: boolean;
  pauseOnHover?: boolean;
}

export default function RollingGallery({ 
  items, 
  autoplay = true, 
  pauseOnHover = true 
}: RollingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!autoplay || items.length === 0) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, isPaused, items.length]);

  if (items.length === 0) {
    return (
      <div className="relative w-full h-[300px] rounded-3xl overflow-hidden bg-[#1E1F25]/30">
        <div className="absolute inset-0 flex items-center justify-center text-white/60">
          Loading news...
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const fallbackImageUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop";

  return (
    <div 
      className="relative w-full h-[300px] rounded-3xl overflow-hidden bg-[#1E1F25]/30"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentItem.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={imageError[currentItem.id] ? fallbackImageUrl : currentItem.image_url}
            alt={currentItem.headline}
            fill
            className="object-cover"
            priority
            onError={() => {
              setImageError(prev => ({ ...prev, [currentItem.id]: true }));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.a 
          key={currentItem.id}
          href={currentItem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 p-6 flex flex-col justify-end group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-white text-2xl font-semibold mb-3 group-hover:text-blue-400 transition-colors line-clamp-3">
            {currentItem.headline}
          </h3>
          
          {/* Tickers */}
          {currentItem.tickers && currentItem.tickers.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentItem.tickers.map((ticker) => (
                <span 
                  key={ticker}
                  className="px-3 py-1 rounded-lg bg-white/10 text-white/90 text-sm font-medium"
                >
                  {ticker}
                </span>
              ))}
            </motion.div>
          )}

          <div className="flex items-center justify-between text-sm text-white/60">
            <span>{currentItem.source}</span>
            <span>{new Date(currentItem.timestamp).toLocaleString()}</span>
          </div>
        </motion.a>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {items.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
} 