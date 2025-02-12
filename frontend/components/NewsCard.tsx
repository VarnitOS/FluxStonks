'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  image_url: string;
  timestamp: string;
}

interface NewsResponse {
  status: string;
  message: string;
  data: NewsItem[];
}

export default function NewsCard() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const fetchNewsData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/news');
      const responseData: NewsResponse = await response.json();
      
      if (responseData.status === 'success' && responseData.data.length > 0) {
        // Filter out items without valid image URLs
        const validNews = responseData.data.filter(item => 
          item.image_url && item.image_url.startsWith('http')
        );
        setNewsData(validNews);
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(fetchNewsData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (newsData.length === 0) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % newsData.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, newsData.length]);

  if (newsData.length === 0) {
    return (
      <div className="relative w-full h-[200px] rounded-3xl overflow-hidden bg-[#1E1F25]/30">
        <div className="absolute inset-0 flex items-center justify-center text-white/60">
          Loading news...
        </div>
      </div>
    );
  }

  const currentNews = newsData[currentIndex];
  const fallbackImageUrl = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop";

  return (
    <div 
      className="relative w-full h-[200px] rounded-3xl overflow-hidden bg-[#1E1F25]/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageError[currentNews.id] ? fallbackImageUrl : currentNews.image_url}
          alt={currentNews.headline}
          fill
          className="object-cover transition-opacity duration-500"
          priority
          onError={() => {
            setImageError(prev => ({ ...prev, [currentNews.id]: true }));
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
      </div>

      {/* Content */}
      <a 
        href={currentNews.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 p-6 flex flex-col justify-end group"
      >
        <h3 className="text-white text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
          {currentNews.headline}
        </h3>
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{currentNews.source}</span>
          <span>{new Date(currentNews.timestamp).toLocaleString()}</span>
        </div>
      </a>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {newsData.map((_, i) => (
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