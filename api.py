from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import asyncio
import json
from MarketDataIntegrator import MarketDataIntegrator

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

@app.websocket("/ws/bars/{symbol}")
async def websocket_bars(websocket: WebSocket, symbol: str):
    await websocket.accept()
    try:
        initial_data = await mdi.get_latest_bars(symbol)
        await websocket.send_json({
            "type": "initial",
            "data": initial_data
        })
        
        market_open = is_market_open()
        if market_open:
            await mdi.start_websocket_stream([symbol])
            
        while True:
            try:
                if market_open:
                    bar_data = mdi.redis_client.get(f"last_bar:{symbol}")
                    if bar_data:
                        await websocket.send_json({
                            "type": "update",
                            "data": json.loads(bar_data)
                        })
                else:
                    latest_data = await mdi.get_latest_bars(symbol)
                    if latest_data:
                        await websocket.send_json({
                            "type": "update",
                            "data": latest_data[-1]
                        })
                        
            except Exception as e:
                print(f"Error sending update: {e}")
                
            await asyncio.sleep(1 if market_open else 60)
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if market_open:
            await mdi.stop_websocket_stream([symbol])
        await websocket.close() 

@app.get("/")
async def root():
    """Root endpoint showing API status and market info."""
    return {
        "status": "active",
        "market_open": is_market_open(),
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "historical": "/api/historical/{symbol}",
            "websocket": "/ws/bars/{symbol}"
        }
    } 