from typing import Dict, List
import yfinance as yf
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest, StockLatestTradeRequest, StockLatestQuoteRequest
from alpaca.data.timeframe import TimeFrame, TimeFrameUnit
import asyncio
import json
import logging
from datetime import datetime, timedelta, timezone
import redis
from dotenv import load_dotenv
import os
import ssl
import websocket
from indicators import TechnicalIndicators
import pytz
from alpaca.data.live import StockDataStream

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketDataIntegrator:
    def __init__(self):
        
        API_KEY = os.getenv("ALPACA_KEY")
        API_SECRET = os.getenv("ALPACA_SECRET")
        
        
        logger.info(f"Initializing Alpaca client with key: {API_KEY[:5]}...")
        
        if not API_KEY or not API_SECRET:
            logger.error("Missing Alpaca credentials!")
            return
            
        self.client = StockHistoricalDataClient(API_KEY, API_SECRET)
        
        # Add SDK WebSocket stream
        self.stream = StockDataStream(API_KEY, API_SECRET)
        
        # Setup stream handlers
        self.stream.subscribe_trades(self.handle_trade)
        self.stream.subscribe_quotes(self.handle_quote)
        self.stream.subscribe_bars(self.handle_bar)
        
        # Redis for caching
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.logger = logging.getLogger(__name__)
        
        # Track API calls
        self.alpaca_calls = 0
        self.alpaca_last_reset = datetime.now()
        
        self.ws = None
        self.connected = False
        self.loop = None
        
        # Dow Jones symbols
        self.dow_symbols = [
            "AAPL", "AMGN", "AXP", "BA", "CAT", "CRM", "CSCO", "CVX", "DIS", "DOW",
            "GS", "HD", "HON", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD", "MMM",
            "MRK", "MSFT", "NKE", "PG", "TRV", "UNH", "V", "VZ", "WBA", "WMT"
        ]

        self.news_cache = []
        self.last_news_update = None
        self.NEWS_CACHE_DURATION = timedelta(minutes=1)
        if self.client:
            if not self.test_connection():
                logger.error("Failed to establish Alpaca connection")

    async def get_stock_data(self, symbol: str) -> Dict:
        """Get stock data with fallback logic"""
        cache_key = f"stock_data:{symbol}"
        
        # Try cache first
        cached_data = self.redis_client.get(cache_key)
        if cached_data:
            data = json.loads(cached_data)
            data['source'] = 'cache'
            return data
        
        # Try Alpaca first during market hours
        if await self.is_market_open() and self.can_use_alpaca():
            data = await self.fetch_alpaca_data(symbol)
            if data:
                self.redis_client.setex(cache_key, 300, json.dumps(data))
                return data
        
        # Fallback to Yahoo
        data = await self.fetch_yahoo_data(symbol)
        if data:
            self.redis_client.setex(cache_key, 300, json.dumps(data))
            return data
        
        # Return error response if both sources fail
        return {
            "symbol": symbol,
            "price": None,
            "close": None,
            "volume": None,
            "timestamp": datetime.now().isoformat(),
            "source": "error"
        }
    
    def can_use_alpaca(self) -> bool:
        """Check if we can use Alpaca API based on rate limits"""
        # Reset counter if new minute
        now = datetime.now()
        if (now - self.alpaca_last_reset).seconds >= 60:
            self.alpaca_calls = 0
            self.alpaca_last_reset = now
            
        return self.alpaca_calls < 190
        
    async def fetch_alpaca_data(self, symbol: str) -> Dict:
        """Fetch data from Alpaca - returns None if data unavailable"""
        try:
            logger.info(f"Fetching Alpaca data for {symbol}...")
            
            # Get latest trade
            request = StockLatestTradeRequest(symbol_or_symbols=[symbol])
            trade_response = self.client.get_stock_latest_trade(request)
            
            if not trade_response or symbol not in trade_response:
                logger.warning(f"No trade data from Alpaca for {symbol}")
                return None
            
            trade = trade_response[symbol]
            
            # Get latest quote
            quote_request = StockLatestQuoteRequest(symbol_or_symbols=[symbol])
            quote_response = self.client.get_stock_latest_quote(quote_request)
            quote = quote_response[symbol] if quote_response and symbol in quote_response else None
            
            price = float(trade.price)
            
            # Use bid price if ask price is 0
            if quote and quote.ask_price > 0:
                open_price = float(quote.ask_price)
            elif quote and quote.bid_price > 0:
                open_price = float(quote.bid_price)
            else:
                open_price = price
                
            # Calculate high/low safely
            high = max(price, float(quote.ask_price if quote and quote.ask_price > 0 else price))
            low = min(price, float(quote.bid_price if quote and quote.bid_price > 0 else price))
            
            # Safe calculation of change percentage
            change = price - open_price
            change_percent = (change / open_price * 100) if open_price > 0 else 0
                
            return {
                'symbol': symbol,
                'price': price,
                'open': open_price,
                'high': high,
                'low': low,
                'close': price,
                'volume': int(trade.size),
                'change': change,
                'change_percent': change_percent,
                'timestamp': datetime.now().isoformat(),
                'source': 'alpaca'
            }
                
        except Exception as e:
            logger.error(f"Error fetching Alpaca data for {symbol}: {str(e)}")
            return None

    async def fetch_yahoo_data(self, symbol: str) -> Dict:
        """Fetch data from Yahoo Finance - returns None if data unavailable"""
        try:
            logger.info(f"Fetching Yahoo data for {symbol}")
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1d")
            
            if hist.empty:
                logger.warning(f"No Yahoo data for {symbol}")
                return None
            
            last_row = hist.iloc[-1]
            
            return {
                'symbol': symbol,
                'price': float(last_row['Close']),
                'open': float(last_row['Open']),
                'high': float(last_row['High']),
                'low': float(last_row['Low']),
                'close': float(last_row['Close']),
                'volume': int(last_row['Volume']),
                'change': float(last_row['Close'] - last_row['Open']),
                'change_percent': float((last_row['Close'] - last_row['Open']) / last_row['Open'] * 100),
                'timestamp': datetime.now().isoformat(),
                'source': 'yahoo'
            }
            
        except Exception as e:
            logger.error(f"Error fetching Yahoo data for {symbol}: {str(e)}")
            return None

    async def start_websocket_stream(self, symbols: List[str]):
        """Start real-time data stream"""
        # Completely disable all websocket debug logging
        logging.getLogger('websocket').setLevel(logging.ERROR)
        websocket.enableTrace(False)
        
        def on_message(ws, message):
            try:
                message_data = json.loads(message)
                if isinstance(message_data, list) and message_data:
                    msg = message_data[0]
                    msg_type = msg.get('T')
                    
                    if msg_type == 'success':
                        if msg.get('msg') == 'authenticated':
                            logger.info("✓ Successfully authenticated")
                            # Only subscribe after successful authentication
                            subscribe_message = {
                                "action": "subscribe",
                                "trades": symbols,
                                "quotes": symbols,
                                "bars": symbols
                            }
                            ws.send(json.dumps(subscribe_message))
                    elif msg_type == 'subscription':
                        logger.info("✓ Successfully subscribed to market data")
                    elif msg_type == 't':  # Trade
                        symbol = msg.get('S')
                        price = float(msg.get('p', 0))
                        size = float(msg.get('s', 0))
                        logger.info(f"Trade: {symbol} - Price: ${price:.2f} Size: {size}")
                        self._handle_trade(msg)
                    elif msg_type == 'q':  # Quote
                        symbol = msg.get('S')
                        bid = float(msg.get('bp', 0))
                        ask = float(msg.get('ap', 0))
                        bid_size = float(msg.get('bs', 0))
                        ask_size = float(msg.get('as', 0))
                        logger.info(f"Quote: {symbol} - Bid: ${bid:.2f} ({bid_size}) Ask: ${ask:.2f} ({ask_size})")
                        self._handle_quote(msg)
                    elif msg_type == 'b':  # Bar updates
                        symbol = msg.get('S')
                        close = float(msg.get('c', 0))
                        volume = float(msg.get('v', 0))
                        logger.info(f"Bar: {symbol} - Close: ${close:.2f} Volume: {volume}")
            except Exception as e:
                logger.error(f"Error processing message: {e}")

        def on_error(ws, error):
            logger.error(f"WebSocket Error: {error}")

        def on_close(ws, close_status_code, close_msg):
            logger.info("WebSocket connection closed")
            self.connected = False

        def on_open(ws):
            logger.info("✓ WebSocket connection established")
            self.connected = True
            
            # Authenticate first
            auth_data = {
                "action": "auth",
                "key": os.getenv("ALPACA_KEY"),
                "secret": os.getenv("ALPACA_SECRET")
            }
            ws.send(json.dumps(auth_data))

        # Use live trading URL
        ws_url = "wss://stream.data.alpaca.markets/v2/iex"
        
        logger.info("\nStarting Market Data Stream")
        logger.info("Note: Data will only be received during market hours (9:30 AM - 4:00 PM ET, Mon-Fri)")
        logger.info(f"Current subscriptions: {', '.join(symbols)}")
        logger.info("-" * 50)
        
        while True:  # Reconnection loop
            try:
                if self.ws and self.ws.sock and self.ws.sock.connected:
                    self.ws.close()
                
                self.ws = websocket.WebSocketApp(
                    ws_url,
                    on_open=on_open,
                    on_message=on_message,
                    on_error=on_error,
                    on_close=on_close
                )

                self.ws.run_forever(
                    sslopt={"cert_reqs": ssl.CERT_NONE},
                    ping_interval=10,
                    ping_timeout=5
                )
                
                if not self.connected:
                    logger.warning("Connection lost, attempting to reconnect in 5 seconds...")
                    await asyncio.sleep(5)
                
            except KeyboardInterrupt:
                logger.info("\nGracefully shutting down...")
                if self.ws:
                    self.ws.close()
                break
            except Exception as e:
                logger.error(f"Connection error: {e}")
                await asyncio.sleep(5)

    def _handle_trade(self, trade_data):
        """Handle trade messages synchronously"""
        try:
            symbol = trade_data.get('S')
            if symbol:
                trade_info = {
                    'price': trade_data.get('p'),
                    'size': trade_data.get('s'),
                    'timestamp': datetime.now().isoformat()
                }
                self.redis_client.setex(
                    f"last_trade:{symbol}",
                    300,
                    json.dumps(trade_info)
                )
                # Debug log to confirm data is being stored
                cached_data = self.redis_client.get(f"last_trade:{symbol}")
                if cached_data:
                    logger.info(f"Trade stored in Redis for {symbol}: {cached_data.decode()}")
        except Exception as e:
            logger.error(f"Error processing trade: {e}")

    def _handle_quote(self, quote_data):
        """Handle quote messages synchronously"""
        try:
            symbol = quote_data.get('S')
            if symbol:
                quote_info = {
                    'bid': quote_data.get('bp'),
                    'ask': quote_data.get('ap'),
                    'timestamp': datetime.now().isoformat()
                }
                self.redis_client.setex(
                    f"last_quote:{symbol}",
                    300,
                    json.dumps(quote_info)
                )
                cached_data = self.redis_client.get(f"last_quote:{symbol}")
                if cached_data:
                    logger.info(f"Quote stored in Redis for {symbol}: {cached_data.decode()}")
        except Exception as e:
            logger.error(f"Error processing quote: {e}")

    async def get_historical_bars(self, symbol: str, timeframe: str = "1Min", days: int = 1):
        """Get historical bar data without market hours constraints."""
        try:
            logger.info(f"Getting historical bars for {symbol}")

            # Get current time in ET
            et_tz = pytz.timezone('America/New_York')
            now = datetime.now(et_tz)
        
        # Calculate time range
            end_dt = now.replace(second=0, microsecond=0)
            start_dt = end_dt - timedelta(days=days)
        
        # Convert timeframe
            timeframe_map = {
                "1Min": TimeFrame(1, TimeFrameUnit.Minute),
                "5Min": TimeFrame(5, TimeFrameUnit.Minute),
                "1H": TimeFrame(1, TimeFrameUnit.Hour),
                "1D": TimeFrame(1, TimeFrameUnit.Day)
            }
            tf = timeframe_map.get(timeframe)

            request = StockBarsRequest(
                symbol_or_symbols=symbol,
                timeframe=tf,
                start=start_dt,
                end=end_dt,
                feed='iex',
                limit=10000
            )
        
            logger.info(f"Requesting data from {start_dt} to {end_dt} ET")

            # Get bars
            bars = self.client.get_stock_bars(request)

            if not bars:
                logger.warning(f"No bars returned for {symbol}")
                return []
        
        # Format response
            formatted_bars = []
            if isinstance(bars, dict) and symbol in bars:
                bars_data = bars[symbol]
            elif hasattr(bars, 'data'):
                bars_data = bars.data
            else:
                logger.error(f"Unexpected response format: {type(bars)}")
                return []
        
            for bar in bars_data:
                try:
                    formatted_bars.append({
                        "timestamp": bar.timestamp.isoformat() if hasattr(bar, 'timestamp') else str(bar.get('t', '')),
                        "open": float(bar.open if hasattr(bar, 'open') else bar.get('o', 0)),
                        "high": float(bar.high if hasattr(bar, 'high') else bar.get('h', 0)),
                        "low": float(bar.low if hasattr(bar, 'low') else bar.get('l', 0)),
                        "close": float(bar.close if hasattr(bar, 'close') else bar.get('c', 0)),
                        "volume": int(bar.volume if hasattr(bar, 'volume') else bar.get('v', 0))
                    })
                except Exception as e:
                    logger.error(f"Error formatting bar: {e}")
                    continue
        
            logger.info(f"Retrieved {len(formatted_bars)} bars")
            return formatted_bars
        
        except Exception as e:
            logger.error(f"Error getting bars: {e}")
            logger.exception("Full traceback:")
            return []

    async def get_latest_bars(self, symbols: List[str]) -> Dict:
        """Get latest minute bars for multiple symbols using IEX"""
        cache_key = f"latest_bars:{','.join(symbols)}"
        
        # Try cache first
        cached = self.redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
        
        try:
            # Get bars from Alpaca with IEX feed
            bars = self.client.get_stock_bars(
                StockBarsRequest(
                    symbol_or_symbols=symbols,
                    timeframe=TimeFrame.Minute,
                    start=datetime.now(timezone.utc) - timedelta(minutes=5),
                    feed='iex'  # Changed to string 'iex' instead of DataFeed.IEX
                )
            )
            
            result = {}
            for symbol in symbols:
                if symbol in bars:
                    symbol_bars = bars[symbol]
                    if len(symbol_bars) > 0:
                        latest = symbol_bars[-1]
                        result[symbol] = {
                            "open": float(latest.open),
                            "high": float(latest.high),
                            "low": float(latest.low),
                            "close": float(latest.close),
                            "volume": int(latest.volume),
                            "timestamp": latest.timestamp.isoformat()
                        }
            
            # Cache for 30 seconds
            self.redis_client.setex(cache_key, 30, json.dumps(result))
            return result
            
        except Exception as e:
            logger.error(f"Error getting bars: {e}")
            return {}

    async def get_top_gainers(self) -> List[Dict]:
        """Get top 50 gaining stocks"""
        cache_key = "top_gainers"
        cached = self.redis_client.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        try:
            # Get market data for all tracked symbols
            gainers = []
            symbols = await self.get_market_symbols()
            
            for symbol in symbols[:100]:  # Limit initial scan
                data = await self.get_stock_data(symbol)
                if data and data.get('change_percent'):
                    gainers.append(data)
            
            # Sort by percentage gain and get top 50
            gainers.sort(key=lambda x: x['change_percent'], reverse=True)
            top_gainers = gainers[:50]
            
            # Cache for 5 minutes
            self.redis_client.setex(cache_key, 300, json.dumps(top_gainers))
            return top_gainers
            
        except Exception as e:
            logger.error(f"Error getting top gainers: {e}")
            return []

    async def get_top_losers(self) -> List[Dict]:
        """Get top 50 losing stocks"""
        cache_key = "top_losers"
        cached = self.redis_client.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        try:
            # Similar to gainers but sort ascending
            losers = []
            symbols = await self.get_market_symbols()
            
            for symbol in symbols[:100]:
                data = await self.get_stock_data(symbol)
                if data and data.get('change_percent'):
                    losers.append(data)
            
            losers.sort(key=lambda x: x['change_percent'])
            top_losers = losers[:50]
            
            self.redis_client.setex(cache_key, 300, json.dumps(top_losers))
            return top_losers
            
        except Exception as e:
            logger.error(f"Error getting top losers: {e}")
            return []

    async def get_dow_jones_stocks(self) -> List[Dict]:
        """Get Dow Jones Industrial Average stocks"""
        cache_key = "dow_jones"
        cached = self.redis_client.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        try:
            dow_data = []
            for symbol in self.dow_symbols:
                data = await self.get_stock_data(symbol)
                if data:
                    dow_data.append(data)
            
            self.redis_client.setex(cache_key, 60, json.dumps(dow_data))  # 1 min cache
            return dow_data
            
        except Exception as e:
            logger.error(f"Error getting Dow Jones data: {e}")
            return []

    async def get_trending_news(self) -> list:
        """Get market news with caching"""
        try:
            now = datetime.now(timezone.utc)
            
            # Return cached news if fresh (less than 5 minutes old)
            if (self.last_news_update and 
                self.news_cache and 
                now - self.last_news_update < self.NEWS_CACHE_DURATION):
                logger.info("Returning cached news")
                return self.news_cache
                
            # Otherwise fetch new data
            logger.info("Fetching fresh news")
            search = yf.Search(query="stock market")
            market_news = search.news
            
            if not market_news:
                return self.news_cache if self.news_cache else []  # Return old cache if new fetch fails
                
            # Process and format news
            all_news = []
            for article in market_news:
                try:
                    formatted_article = {
                        "id": str(hash(article['title'])),
                        "headline": article['title'],
                        "summary": article.get('summary', ''),
                        "source": article.get('publisher', 'Yahoo Finance'),
                        "url": article['link'],
                        "image_url": article.get('thumbnail', {}).get('resolutions', [{}])[0].get('url', ''),
                        "timestamp": datetime.fromtimestamp(
                            article['providerPublishTime'], 
                            tz=timezone.utc
                        ).isoformat(),
                        "category": "Markets",
                        "tickers": article.get('relatedTickers', [])
                    }
                    all_news.append(formatted_article)
                except KeyError as ke:
                    logger.error(f"Missing key in article: {ke}")
                    continue
            
            # Update cache
            self.news_cache = sorted(all_news, key=lambda x: x['timestamp'], reverse=True)[:10]
            self.last_news_update = now
            
            logger.info(f"Updated news cache with {len(self.news_cache)} articles")
            return self.news_cache
            
        except Exception as e:
            logger.error(f"Error fetching news: {e}")
            return self.news_cache if self.news_cache else []  # Return old cache on error

    async def get_batch_stock_data(self, symbols: List[str]) -> Dict[str, Dict]:
        """Get real-time data for multiple symbols"""
        result = {}
        tasks = []
        
        for symbol in symbols:
            tasks.append(self.get_stock_data(symbol))
        
        data = await asyncio.gather(*tasks)
        
        for i, symbol in enumerate(symbols):
            result[symbol] = data[i]
            
        return result

    async def get_market_symbols(self) -> List[str]:
        """Get list of tradable symbols"""
        cache_key = "market_symbols"
        cached = self.redis_client.get(cache_key)
        
        if cached:
            return json.loads(cached)
            
        try:
            # This is a placeholder - implement based on your data source
            # Could get from Alpaca, Yahoo Finance, or other source
            symbols = self.dow_symbols  # For now, just return Dow symbols
            
            self.redis_client.setex(cache_key, 86400, json.dumps(symbols))  # 24h cache
            return symbols
            
        except Exception as e:
            logger.error(f"Error getting market symbols: {e}")
            return []

    async def get_technical_indicators(self, symbol: str) -> dict:
        """Get technical indicators with analysis"""
        try:
            # Get data
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1y")
            hist.columns = hist.columns.str.lower()
            
            # Get current price for reference
            current_price = hist['close'].iloc[-1]
            avg_volume = hist['volume'].mean()
            
            # Calculate base indicators
            indicators = TechnicalIndicators.get_all_indicators(hist)
            
            # RSI Analysis
            rsi = indicators['rsi']
            rsi_signal = {
                "value": round(rsi, 2),
                "signal": "Oversold" if rsi < 30 else "Overbought" if rsi > 70 else "Neutral",
                "strength": "Strong" if (rsi < 20 or rsi > 80) else "Moderate"
            }
            
            # MACD Analysis
            macd_data = indicators['macd']
            macd_signal = {
                "value": round(macd_data['macd'], 2),
                "signal": round(macd_data['signal'], 2),
                "histogram": round(macd_data['histogram'], 2),
                "trend": "Bullish" if macd_data['histogram'] > 0 else "Bearish"
            }
            
            # Moving Averages
            ma_data = indicators['moving_averages']
            ma50, ma200 = ma_data['ma50'], ma_data['ma200']
            ma_trend = "Bullish" if ma50 > ma200 else "Bearish"
            ma_strength = round(abs(ma50 - ma200) / ma200 * 100, 2)
            
            ma_signal = {
                "ma50": round(ma50, 2),
                "ma200": round(ma200, 2),
                "trend": ma_trend,
                "strength": ma_strength
            }
            
            # Volume Analysis
            current_volume = hist['volume'].iloc[-1]
            volume_ratio = current_volume / avg_volume
            volatility = "High" if volume_ratio > 1.5 else "Low" if volume_ratio < 0.5 else "Normal"
            
            # Determine overall trends
            short_term_signals = [
                rsi > 50,  # RSI above midpoint
                macd_data['histogram'] > 0,  # MACD positive
                current_volume > avg_volume  # Above average volume
            ]
            
            short_term = "Bullish" if sum(short_term_signals) >= 2 else "Bearish"
            
            return {
                "symbol": symbol,
                "company_name": ticker.info.get('longName', symbol),
                "current_price": round(current_price, 2),
                "signals": {
                    "rsi": rsi_signal,
                    "macd": macd_signal,
                    "moving_averages": ma_signal
                },
                "summary": {
                    "short_term": short_term,
                    "long_term": ma_trend,
                    "volatility": volatility,
                    "price_strength": f"{round((current_price / ma200 - 1) * 100, 2)}% vs 200MA"
                }
            }
            
        except Exception as e:
            logger.error(f"Error calculating indicators for {symbol}: {e}")
            return {}

    async def is_market_open(self) -> bool:
        return True

    def test_connection(self):
        """Test Alpaca API connection and permissions."""
        if not self.client:
            logger.error("Client not initialized")
            return False
        
        try:
        # Test with a simple request
            test_request = StockBarsRequest(
                symbol_or_symbols="AAPL",
                timeframe=TimeFrame(1, TimeFrameUnit.Day),
                start=datetime.now(pytz.UTC) - timedelta(days=1),
                end=datetime.now(pytz.UTC),
                feed='iex'
            )
        
            result = self.client.get_stock_bars(test_request)
            logger.info("Successfully connected to Alpaca API")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Alpaca: {e}")
            return False

    async def handle_trade(self, trade):
        """Handle incoming trade data"""
        try:
            await self._handle_trade({
                'S': trade.symbol,
                'p': trade.price,
                's': trade.size,
                'timestamp': trade.timestamp
            })
        except Exception as e:
            logger.error(f"Error handling trade: {e}")

    async def handle_quote(self, quote):
        """Handle incoming quote data"""
        try:
            await self._handle_quote({
                'S': quote.symbol,
                'bp': quote.bid_price,
                'ap': quote.ask_price,
                'bs': quote.bid_size,
                'as': quote.ask_size
            })
        except Exception as e:
            logger.error(f"Error handling quote: {e}")

    async def handle_bar(self, bar):
        """Handle incoming bar data"""
        try:
            # Use existing bar handling logic
            pass
        except Exception as e:
            logger.error(f"Error handling bar: {e}")
