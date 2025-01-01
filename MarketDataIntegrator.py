from typing import Dict, List
import yfinance as yf
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
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

load_dotenv()
logging.basicConfig(level=logging.INFO)

class MarketDataIntegrator:
    def __init__(self):
        # Initialize APIs
        self.alpaca_client = StockHistoricalDataClient(
            os.getenv("ALPACA_KEY"),
            os.getenv("ALPACA_SECRET")
        )
        
        # Redis for caching
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.logger = logging.getLogger(__name__)
        
        # Track API calls
        self.alpaca_calls = 0
        self.alpaca_last_reset = datetime.now()
        
        self.ws = None
        self.connected = False
        self.loop = None
        
    async def get_stock_data(self, symbol: str) -> Dict:
        """
        Smart data fetching with cache and API limit management
        """
        cache_key = f"stock_data:{symbol}"
        
        # Try cache first
        cached_data = self.redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
            
        # Determine best source based on API limits
        if self.can_use_alpaca():
            data = await self.fetch_alpaca_data(symbol)
            self.alpaca_calls += 1
        else:
            data = await self.fetch_yahoo_data(symbol)
            
        # Cache the result
        self.redis_client.setex(cache_key, 300, json.dumps(data))  # 5 min cache
        return data
    
    def can_use_alpaca(self) -> bool:
        """Check if we can use Alpaca API based on rate limits"""
        # Reset counter if new minute
        now = datetime.now()
        if (now - self.alpaca_last_reset).seconds >= 60:
            self.alpaca_calls = 0
            self.alpaca_last_reset = now
            
        # Alpaca free tier: 200 calls per minute
        return self.alpaca_calls < 190  # Buffer of 10
        
    async def fetch_alpaca_data(self, symbol: str) -> Dict:
        """Fetch data from Alpaca"""
        try:
            bars = self.alpaca_client.get_stock_bars(
                StockBarsRequest(
                    symbol_or_symbols=symbol,
                    timeframe=TimeFrame.Minute,
                    start=datetime.now() - timedelta(minutes=5)
                )
            )
            return {
                'source': 'alpaca',
                'price': bars.df.iloc[-1].close if not bars.df.empty else None,
                'volume': bars.df.iloc[-1].volume if not bars.df.empty else None,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error(f"Alpaca error for {symbol}: {e}")
            return await self.fetch_yahoo_data(symbol)  # Fallback to Yahoo
            
    async def fetch_yahoo_data(self, symbol: str) -> Dict:
        """Fetch data from Yahoo Finance"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get current price using fast_info for more reliable real-time data
            current_price = ticker.fast_info['lastPrice'] if hasattr(ticker, 'fast_info') else info.get('regularMarketPrice')
            
            return {
                'source': 'yahoo',
                'price': current_price,
                'volume': info.get('regularMarketVolume'),
                'market_cap': info.get('marketCap'),
                'last_price': info.get('regularMarketPrice'),
                'open': info.get('regularMarketOpen'),
                'high': info.get('regularMarketDayHigh'),
                'low': info.get('regularMarketDayLow'),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error(f"Yahoo error for {symbol}: {e}")
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
                            print("✓ Successfully authenticated")
                            # Only subscribe after successful authentication
                            subscribe_message = {
                                "action": "subscribe",
                                "trades": symbols,
                                "quotes": symbols,
                                "bars": symbols
                            }
                            ws.send(json.dumps(subscribe_message))
                    elif msg_type == 'subscription':
                        print("✓ Successfully subscribed to market data")
                    elif msg_type == 't':  # Trade
                        symbol = msg.get('S')
                        price = float(msg.get('p', 0))
                        size = float(msg.get('s', 0))
                        print(f"Trade: {symbol} - Price: ${price:.2f} Size: {size}")
                        self._handle_trade(msg)
                    elif msg_type == 'q':  # Quote
                        symbol = msg.get('S')
                        bid = float(msg.get('bp', 0))
                        ask = float(msg.get('ap', 0))
                        bid_size = float(msg.get('bs', 0))
                        ask_size = float(msg.get('as', 0))
                        print(f"Quote: {symbol} - Bid: ${bid:.2f} ({bid_size}) Ask: ${ask:.2f} ({ask_size})")
                        self._handle_quote(msg)
                    elif msg_type == 'b':  # Bar updates
                        symbol = msg.get('S')
                        close = float(msg.get('c', 0))
                        volume = float(msg.get('v', 0))
                        print(f"Bar: {symbol} - Close: ${close:.2f} Volume: {volume}")
            except Exception as e:
                print(f"Error processing message: {e}")

        def on_error(ws, error):
            print(f"WebSocket Error: {error}")

        def on_close(ws, close_status_code, close_msg):
            print("WebSocket connection closed")
            self.connected = False

        def on_open(ws):
            print("✓ WebSocket connection established")
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
        
        print("\nStarting Market Data Stream")
        print("Note: Data will only be received during market hours (9:30 AM - 4:00 PM ET, Mon-Fri)")
        print("Current subscriptions:", ", ".join(symbols))
        print("-" * 50)
        
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
                    print("Connection lost, attempting to reconnect in 5 seconds...")
                    await asyncio.sleep(5)
                
            except KeyboardInterrupt:
                print("\nGracefully shutting down...")
                if self.ws:
                    self.ws.close()
                break
            except Exception as e:
                print(f"Connection error: {e}")
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
                # Debug print to confirm data is being stored
                cached_data = self.redis_client.get(f"last_trade:{symbol}")
                if cached_data:
                    print(f"✓ Trade stored in Redis for {symbol}: {cached_data.decode()}")
        except Exception as e:
            print(f"Error processing trade: {e}")

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
                # Debug print to confirm data is being stored
                cached_data = self.redis_client.get(f"last_quote:{symbol}")
                if cached_data:
                    print(f"✓ Quote stored in Redis for {symbol}: {cached_data.decode()}")
        except Exception as e:
            print(f"Error processing quote: {e}")

    async def get_historical_bars(self, symbol: str, timeframe: str, start: datetime, end: datetime) -> List[Dict]:
        """
        Get historical bar data for a symbol
        """
        cache_key = f"historical_bars:{symbol}:{timeframe}:{start.date()}:{end.date()}"
        
        # Try cache first
        cached_data = self.redis_client.get(cache_key)
        if cached_data:
            self.logger.info(f"Cache hit for historical data: {symbol}")
            return json.loads(cached_data)
        
        self.logger.info(f"Fetching historical data for {symbol}")
        
        try:
            # Validate timeframe format according to API docs
            valid_timeframes = ['1Min', '5Min', '15Min', '1Hour', '1Day']
            if timeframe not in valid_timeframes:
                raise ValueError(f"Invalid timeframe. Must be one of {valid_timeframes}")
            
            # Validate dates
            if end > datetime.now():
                end = datetime.now()
            if start > end:
                raise ValueError("Start date must be before end date")
            
            # Map timeframes to amount and TimeFrameUnit
            timeframe_map = {
                '1Min': (1, TimeFrameUnit.Minute),
                '5Min': (5, TimeFrameUnit.Minute),
                '15Min': (15, TimeFrameUnit.Minute),
                '1Hour': (1, TimeFrameUnit.Hour),
                '1Day': (1, TimeFrameUnit.Day)
            }
            
            amount, unit = timeframe_map[timeframe]
            
            # Get data from Alpaca
            request = StockBarsRequest(
                symbol_or_symbols=[symbol],
                timeframe=TimeFrame(amount, unit),
                start=start,
                end=end,
                adjustment='raw',
                feed='sip',
                limit=1000
            )
            
            if not isinstance(self.alpaca_client, StockHistoricalDataClient):
                self.alpaca_client = StockHistoricalDataClient(
                    api_key=self.api_key,
                    secret_key=self.secret_key
                )
            
            bars = self.alpaca_client.get_stock_bars(request)
            
            # Convert to list of dictionaries
            data = []
            # Get the bars for the specific symbol
            symbol_bars = bars[symbol]
            
            for bar in symbol_bars:
                data.append({
                    'timestamp': bar.timestamp.isoformat(),
                    'open': float(bar.open),
                    'high': float(bar.high),
                    'low': float(bar.low),
                    'close': float(bar.close),
                    'volume': int(bar.volume)
                })
            
            # Cache the result (1 hour for intraday, 1 day for daily)
            ttl = 3600 if timeframe.endswith('Min') else 86400
            self.redis_client.setex(cache_key, ttl, json.dumps(data))
            
            return data
            
        except Exception as e:
            self.logger.error(f"Error fetching historical data for {symbol}: {e}")
            raise

    async def get_latest_bars(self, symbol: str, limit: int = 100) -> List[Dict]:
        """Get latest bars regardless of market status"""
        try:
            # Try to get from cache first
            cache_key = f"latest_bars:{symbol}"
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)

            # If not in cache, get historical data
            end = datetime.now()
            start = end - timedelta(days=1)  # Get last day's data
            
            data = await self.get_historical_bars(
                symbol=symbol,
                timeframe='1Min',
                start=start,
                end=end
            )
            
            # Cache the result
            self.redis_client.setex(cache_key, 60, json.dumps(data))  # 1 minute cache
            return data
            
        except Exception as e:
            self.logger.error(f"Error getting latest bars for {symbol}: {e}")
            return []