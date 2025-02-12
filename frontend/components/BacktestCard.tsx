'use client'

import { useState, useEffect } from 'react'
import RollingGallery from './RollingGallery'

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

export default function BacktestCard() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  const fetchNewsData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/news');
      const responseData: NewsResponse = await response.json();
      
      if (responseData.status === 'success' && responseData.data.length > 0) {
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

  return (
    <RollingGallery 
      items={newsData}
      autoplay={true} 
      pauseOnHover={true} 
    />
  );
}
