import asyncio
import websockets
import json
import logging
from websockets.exceptions import ConnectionClosed
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def connect_websocket():
    """Create WebSocket connection with retry logic"""
    while True:
        try:
            return await websockets.connect("ws://localhost:8000/ws")
        except ConnectionRefusedError:
            logger.error("Connection refused. Retrying in 2 seconds...")
            await asyncio.sleep(2)
        except Exception as e:
            logger.error(f"Connection error: {e}. Retrying in 2 seconds...")
            await asyncio.sleep(2)

async def test_websocket():
    while True:
        try:
            websocket = await connect_websocket()
            logger.info("Connected to WebSocket")

            # Subscribe to AAPL bars
            subscribe_message = {
                "action": "subscribe",
                "bars": ["AAPL"]
            }
            
            logger.info(f"Sending subscription: {subscribe_message}")
            await websocket.send(json.dumps(subscribe_message))

            # Listen for messages
            while True:
                try:
                    message = await websocket.recv()
                    data = json.loads(message)
                    logger.info(f"Received: {data}")
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse message: {e}")
                except Exception as e:
                    logger.error(f"Error receiving message: {e}")
                    break

        except ConnectionClosed as e:
            logger.warning(f"Connection closed: {e}. Reconnecting...")
            await asyncio.sleep(1)
        except Exception as e:
            logger.error(f"Unexpected error: {e}. Reconnecting...")
            await asyncio.sleep(1)
        finally:
            try:
                await websocket.close()
            except:
                pass

if __name__ == "__main__":
    try:
        asyncio.run(test_websocket())
    except KeyboardInterrupt:
        logger.info("Test stopped by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}") 