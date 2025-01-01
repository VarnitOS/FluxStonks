from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import logging
from MarketDataIntegrator import MarketDataIntegrator

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
mdi = MarketDataIntegrator()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_market_open() -> bool:
    """Check if US stock market is currently open."""
    now = datetime.now().astimezone()
    
    if now.weekday() > 4:  # 5 = Saturday, 6 = Sunday
        return False
    
    et_hour = (now.hour - 4) % 24  # Simple EST conversion (UTC-4)
    
    if (et_hour < 9 or et_hour >= 16 or 
        (et_hour == 9 and now.minute < 30)):
        return False
    
    return True

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

@app.get("/api/bars/{symbols}")
async def get_bars(symbols: str):
    """Get latest minute bars for multiple symbols"""
    try:
        # Check if market is open
        market_open = is_market_open()
        logger.info(f"Market status: {'OPEN' if market_open else 'CLOSED'}")
        
        # Get current time in ET
        now = datetime.now().astimezone()
        et_hour = (now.hour - 4) % 24  # Simple EST conversion
        current_time = f"{et_hour:02d}:{now.minute:02d} ET"
        
        if not market_open:
            return {
                "status": "closed",
                "current_time": current_time,
                "message": "Market is closed. Trading hours are 9:30 AM - 4:00 PM ET, Monday-Friday.",
                "next_open": "9:30 AM ET next trading day",
                "data": None
            }
            
        # If market is open, get the data
        logger.info(f"API: Fetching bars for symbols: {symbols}")
        symbol_list = symbols.split(',')
        data = await mdi.get_latest_bars(symbol_list)
        
        if not data:
            logger.error(f"API: No data returned for symbols {symbols}")
            return {
                "status": "open",
                "current_time": current_time,
                "message": f"No data found for symbols: {symbols}",
                "data": None
            }
            
        logger.info(f"API: Successfully returned data for {len(data)} symbols")
        return {
            "status": "open",
            "current_time": current_time,
            "message": "Success",
            "data": data
        }
        
    except Exception as e:
        logger.error(f"API: Error fetching bars: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/historical/{symbol}")
async def get_historical(symbol: str, timeframe: str = "1Min", days: int = 1):
    """Get historical bar data for a symbol."""
    try:
        end_dt = datetime.now()
        start_dt = end_dt - timedelta(days=days)
        data = await mdi.get_historical_bars(symbol, timeframe, start_dt, end_dt)
        return data
    except Exception as e:
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
            return {
                "status": "error",
                "message": "No news articles found",
                "data": None
            }
            
        return {
            "status": "success",
            "message": f"Found {len(news)} news articles",
            "data": news
        }
        
    except Exception as e:
        logger.error(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/indicators/{symbol}")
async def get_indicators(symbol: str):
    """Get all technical indicators for a symbol"""
    try:
        logger.info(f"Calculating indicators for symbol: {symbol}")
        data = await mdi.get_technical_indicators(symbol)
        
        if not data:
            return {
                "status": "error",
                "message": f"No indicator data found for symbol {symbol}",
                "data": None
            }
            
        return {
            "status": "success",
            "message": "Successfully calculated indicators",
            "data": data
        }
        
    except Exception as e:
        logger.error(f"Error calculating indicators: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 