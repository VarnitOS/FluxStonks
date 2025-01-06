import websockets
import json
import logging
import ssl
import asyncio
import statistics
import time
from typing import Set, Dict, Optional
import os
from dotenv import load_dotenv
import redis
from fastapi import FastAPI, WebSocket, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from MarketDataIntegrator import MarketDataIntegrator
import pytz
import asyncio


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


load_dotenv()
ALPACA_KEY = os.getenv("ALPACA_KEY")
ALPACA_SECRET = os.getenv("ALPACA_SECRET")
ALPACA_STREAM_URL = "wss://stream.data.alpaca.markets/v2/iex"


app = FastAPI()
mdi = MarketDataIntegrator()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


connected_clients: Set[WebSocket] = set()
client_subscriptions: Dict[WebSocket, Set[str]] = {}
alpaca_ws = None


redis_client = redis.Redis(host='localhost', port=6379, db=0)
CACHE_EXPIRY = 300
SMOOTHING_WINDOW = 10

# Market hours check
def is_market_open() -> bool:
    """Check if US stock market is currently open."""
    return mdi.is_market_open()

# REST Endpoints
@app.get("/")
async def root():
    """Root endpoint showing API status and market info."""
    return {
        "status": "active",
        "market_open": is_market_open(),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/stock/{symbol}")
async def get_stock(symbol: str):
    """Get current stock data"""
    try:
        logger.info(f"Fetching data for symbol: {symbol}")
        data = await mdi.get_stock_data(symbol)
        if not data:
            raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
        return data
    except Exception as e:
        logger.error(f"Error fetching stock data: {e}")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/api/market/dow")
async def get_dow():
    """Get Dow Jones stocks data"""
    try:
        return await mdi.get_dow_jones_stocks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/market/gainers")
async def get_gainers():
    """Get top gainers"""
    try:
        return await mdi.get_top_gainers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/market/losers")
async def get_losers():
    """Get top losers"""
    try:
        return await mdi.get_top_losers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news")
async def get_news():
    """Get trending market news"""
    try:
        news = await mdi.get_trending_news()
        if not news:
            return {"status": "error", "message": "No news articles found", "data": None}
        return {"status": "success", "message": f"Found {len(news)} news articles", "data": news}
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/indicators/{symbol}")
async def get_indicators(symbol: str):
    """Get all technical indicators for a symbol"""
    try:
        data = await mdi.get_technical_indicators(symbol)
        if not data:
            return {"status": "error", "message": f"No indicator data found for symbol {symbol}", "data": None}
        return {"status": "success", "message": "Successfully calculated indicators", "data": data}
    except Exception as e:
        logger.error(f"Error calculating indicators: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def connect_to_alpaca():
    """Connect to Alpaca WebSocket and handle authentication"""
    global alpaca_ws
    
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        async with websockets.connect(ALPACA_STREAM_URL, ssl=ssl_context) as ws:
            alpaca_ws = ws
            logger.info("Connected to Alpaca")
            
            # Send authentication
            auth_message = {
                "action": "auth",
                "key": ALPACA_KEY,
                "secret": ALPACA_SECRET
            }
            await ws.send(json.dumps(auth_message))
            logger.info("Sent authentication")
            
            while True:
                message = await ws.recv()
                logger.info(f"Received: {message}")
                
                data = json.loads(message)
                if isinstance(data, list) and len(data) > 0:
                    msg_type = data[0].get('msg', '')
                    if msg_type == 'authenticated':
                        logger.info("Successfully authenticated")
                    elif msg_type == 'connected':
                        logger.info("Received connected message")
                
                # Forward message to all clients
                await forward_to_clients(message)
                
    except Exception as e:
        logger.error(f"Alpaca connection error: {e}")
        alpaca_ws = None
        await asyncio.sleep(5)
        asyncio.create_task(connect_to_alpaca())

async def process_and_cache_data(message: str):
    """Process incoming data, smooth it, and cache in Redis"""
    try:
        data = json.loads(message)
        if isinstance(data, list):
            for item in data:
                await cache_market_data(item)
        else:
            await cache_market_data(data)
    except Exception as e:
        logger.error(f"Error processing data: {e}")

async def cache_market_data(data):
    """Cache individual market data points with smoothing"""
    try:
        if data['T'] in ['t', 'q']:  # Trade or Quote
            symbol = data['S']
            timestamp = time.time()
            
            if data['T'] == 't':  # Trade
                # Cache trade price
                key = f"trade:{symbol}:prices"
                price = float(data['p'])
                redis_client.zadd(key, {f"{timestamp}:{price}": timestamp})
                # Trim old data
                redis_client.zremrangebyscore(key, 0, timestamp - CACHE_EXPIRY)
                
                # Calculate smoothed price
                prices = [float(item.split(':')[1]) for item in redis_client.zrange(key, -SMOOTHING_WINDOW, -1)]
                if prices:
                    smoothed_price = statistics.mean(prices)
                    redis_client.set(f"smoothed:trade:{symbol}", smoothed_price)
                
            elif data['T'] == 'q':  # Quote
                # Cache bid/ask
                bid_key = f"quote:{symbol}:bid"
                ask_key = f"quote:{symbol}:ask"
                bid = float(data['bp'])
                ask = float(data['ap'])
                
                redis_client.zadd(bid_key, {f"{timestamp}:{bid}": timestamp})
                redis_client.zadd(ask_key, {f"{timestamp}:{ask}": timestamp})
                
                # Trim old data
                redis_client.zremrangebyscore(bid_key, 0, timestamp - CACHE_EXPIRY)
                redis_client.zremrangebyscore(ask_key, 0, timestamp - CACHE_EXPIRY)
                
                # Calculate smoothed values
                bids = [float(item.split(':')[1]) for item in redis_client.zrange(bid_key, -SMOOTHING_WINDOW, -1)]
                asks = [float(item.split(':')[1]) for item in redis_client.zrange(ask_key, -SMOOTHING_WINDOW, -1)]
                
                if bids and asks:
                    smoothed_bid = statistics.mean(bids)
                    smoothed_ask = statistics.mean(asks)
                    redis_client.set(f"smoothed:quote:{symbol}:bid", smoothed_bid)
                    redis_client.set(f"smoothed:quote:{symbol}:ask", smoothed_ask)
                
    except Exception as e:
        logger.error(f"Error caching market data: {e}")

async def get_smoothed_data(symbol: str):
    """Get smoothed data for a symbol"""
    try:
        data = {
            'symbol': symbol,
            'trade_price': float(redis_client.get(f"smoothed:trade:{symbol}") or 0),
            'bid': float(redis_client.get(f"smoothed:quote:{symbol}:bid") or 0),
            'ask': float(redis_client.get(f"smoothed:quote:{symbol}:ask") or 0),
            'timestamp': datetime.now().isoformat()
        }
        return data
    except Exception as e:
        logger.error(f"Error getting smoothed data: {e}")
        return None

async def forward_to_clients(message: str):
    """Process, cache, and forward messages to all connected clients"""
    await process_and_cache_data(message)
    
    if connected_clients:
        for client in connected_clients.copy():
            try:
                if isinstance(json.loads(message), dict):
                    data = json.loads(message)
                    if data.get('T') in ['t', 'q']:
                        symbol = data.get('S')
                        smoothed_data = await get_smoothed_data(symbol)
                        if smoothed_data:
                            await client.send_text(json.dumps(smoothed_data))
                    else:
                        await client.send_text(message)
                else:
                    await client.send_text(message)
            except Exception as e:
                logger.error(f"Error sending to client: {e}")
                connected_clients.remove(client)

async def unsubscribe_client(websocket: WebSocket):
    """Unsubscribe client from all their subscriptions"""
    if websocket in client_subscriptions:
        subscriptions = client_subscriptions[websocket]
        if subscriptions and alpaca_ws:
            try:
                unsubscribe_message = {
                    "action": "unsubscribe",
                    "trades": [],
                    "quotes": [],
                    "bars": []
                }
                
                # Collect all symbols for each data type
                for sub in subscriptions:
                    data_type, symbol = sub.split(':')
                    unsubscribe_message[data_type].append(symbol)
                
                # Only send if there's something to unsubscribe from
                if any(unsubscribe_message.values()):
                    logger.info(f"Unsubscribing client from: {unsubscribe_message}")
                    await alpaca_ws.send(json.dumps(unsubscribe_message))
            except Exception as e:
                logger.error(f"Error unsubscribing client: {e}")
                
        del client_subscriptions[websocket]
        logger.info(f"Cleaned up subscriptions for client")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    client_subscriptions[websocket] = set()
    
    # Send connection confirmation
    await websocket.send_text(json.dumps({
        "type": "connection",
        "status": "connected",
        "message": "Successfully connected to WebSocket"
    }))
    
    logger.info(f"Client connected. Total clients: {len(connected_clients)}")
    
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received from client: {data}")
            
            if alpaca_ws:
                try:
                    message = json.loads(data)
                    action = message.get('action')
                    
                    if action == 'subscribe':
                        # Track subscriptions
                        for data_type in ['trades', 'quotes', 'bars']:
                            if data_type in message:
                                for symbol in message[data_type]:
                                    client_subscriptions[websocket].add(f"{data_type}:{symbol}")
                        
                        await alpaca_ws.send(json.dumps(message))
                        # Send subscription confirmation
                        await websocket.send_text(json.dumps({
                            "type": "subscription",
                            "status": "subscribed",
                            "message": f"Successfully subscribed to {message}"
                        }))
                        logger.info(f"Subscribed to: {message}")
                        
                    elif action == 'unsubscribe':
                        # Remove from tracked subscriptions
                        for data_type in ['trades', 'quotes', 'bars']:
                            if data_type in message:
                                for symbol in message[data_type]:
                                    client_subscriptions[websocket].discard(f"{data_type}:{symbol}")
                        
                        await alpaca_ws.send(json.dumps(message))
                        # Send unsubscription confirmation
                        await websocket.send_text(json.dumps({
                            "type": "subscription",
                            "status": "unsubscribed",
                            "message": f"Successfully unsubscribed from {message}"
                        }))
                        logger.info(f"Unsubscribed from: {message}")
                        
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "status": "failed",
                        "message": str(e)
                    }))
            
    except Exception as e:
        logger.error(f"Client error: {e}")
    finally:
        await unsubscribe_client(websocket)
        connected_clients.remove(websocket)
        logger.info(f"Client disconnected. Remaining: {len(connected_clients)}")

@app.on_event("startup")
async def startup_event():
    """Start Alpaca connection on server startup"""
    asyncio.create_task(connect_to_alpaca()) 

@app.get("/api/historical/{symbol}")
async def get_historical_data(
    symbol: str,
    timeframe: str = Query("1d", description="Data interval (1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo)"),
    days: str = Query("5d", description="Data period (1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max)")
):
    """Get historical market data for a symbol."""
    
    # Validate timeframe
    valid_timeframes = ["1m","2m","5m","15m","30m","60m","90m","1h","1d","5d","1wk","1mo","3mo"]
    if timeframe not in valid_timeframes:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid timeframe. Must be one of: {', '.join(valid_timeframes)}"
        )
    
    # Validate days/period
    valid_periods = ["1d","5d","1mo","3mo","6mo","1y","2y","5y","10y","ytd","max"]
    if days not in valid_periods:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid period. Must be one of: {', '.join(valid_periods)}"
        )
    
    try:
        data = await mdi.get_historical_bars(
            symbol=symbol,
            timeframe=timeframe,
            days=days
        )
        
        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for {symbol} with timeframe={timeframe}, days={days}"
            )
            
        return data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching data: {str(e)}"
        )



