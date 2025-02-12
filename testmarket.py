import asyncio
import websockets
import json

async def test_websocket():
    uri = "ws://localhost:8000/ws"
    
    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket")

        # Subscribe to some stocks
        subscribe_message = {
            "action": "subscribe",
            "trades": ["AAPL", "MSFT"],
            "quotes": ["AAPL", "MSFT"]
        }
        
        await websocket.send(json.dumps(subscribe_message))
        print(f"Sent subscription: {subscribe_message}")

        # Listen for messages
        while True:
            try:
                response = await websocket.recv()
                print(f"Received: {response}")
            except websockets.exceptions.ConnectionClosed:
                print("Connection closed")
                break

asyncio.get_event_loop().run_until_complete(test_websocket())