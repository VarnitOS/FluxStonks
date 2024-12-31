import asyncio
from MarketDataIntegrator import MarketDataIntegrator
from datetime import datetime
import json

async def display_realtime_data():
    integrator = MarketDataIntegrator()
    symbols = ['AAPL', 'MSFT', 'GOOGL']
    
    # Start WebSocket stream
    websocket_task = asyncio.create_task(
        integrator.start_websocket_stream(symbols)
    )
    
    print("\nReal-time Market Data Monitor")
    print("Press Ctrl+C to exit\n")
    
    try:
        while True:
            # Clear screen (works on most terminals)
            print("\033[2J\033[H")
            
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"Last Update: {current_time}")
            print("=" * 50)
            
            for symbol in symbols:
                trade_data = integrator.redis_client.get(f"last_trade:{symbol}")
                quote_data = integrator.redis_client.get(f"last_quote:{symbol}")
                
                print(f"\n{symbol} Market Data:")
                print("-" * 20)
                
                if trade_data:
                    trade = json.loads(trade_data)
                    print(f"Last Trade:")
                    print(f"  Price: ${trade['price']}")
                    print(f"  Size: {trade['size']}")
                
                if quote_data:
                    quote = json.loads(quote_data)
                    print(f"Current Quote:")
                    print(f"  Bid: ${quote['bid']}")
                    print(f"  Ask: ${quote['ask']}")
                    print(f"  Spread: ${quote['ask'] - quote['bid']:.4f}")
                
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
        websocket_task.cancel()
        try:
            await websocket_task
        except asyncio.CancelledError:
            pass
        print("Shutdown complete")

if __name__ == "__main__":
    asyncio.run(display_realtime_data())