import websocket
import json
import logging
import ssl
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def on_open(ws):
    logger.info("WebSocket connection opened")
    
    auth_data = {
        "action": "auth",
        "key": "AKFW4CEEITQBZ2AB4AVF",
        "secret": "nLLVccGUYaC4nWpLwj4wo0O6GfvBRWS0bS5nMe8S"
    }
    
    logger.info("Sending authentication...")
    ws.send(json.dumps(auth_data))

    listen_message = {  "action": "subscribe",
                        "trades": ["AAPL"],
                        "quotes": ["AMD", "CLDR"],
                        "bars": ["*"],
                        "dailyBars":["VOO"],
                        "statuses":["*"]
        }
    
    logger.info("Subscribing to data streams...")
    ws.send(json.dumps(listen_message))

def on_message(ws, message):
    logger.info(f"Received message: {message}")
    try:
        data = json.loads(message)
        if isinstance(data, list) and len(data) > 0:
            msg_type = data[0].get('T', 'unknown')
            logger.info(f"Message type: {msg_type}")
            
            if msg_type == 'success':
                logger.info(f"Success message: {data[0].get('msg', '')}")
            elif msg_type == 'error':
                logger.error(f"Error message: {data[0].get('msg', '')}")
                
    except json.JSONDecodeError:
        logger.error(f"Failed to parse message: {message}")
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")

def on_error(ws, error):
    logger.error(f"WebSocket error: {str(error)}")

def on_close(ws, close_status_code, close_msg):
    logger.info(f"WebSocket closed. Status code: {close_status_code}, Message: {close_msg}")

if __name__ == "__main__":
    socket = 'wss://stream.data.alpaca.markets/v2/iex'
    
    logger.info(f"Connecting to {socket}")
    
    # Enable trace for debugging
    websocket.enableTrace(True)
    
    # Create SSL context
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    ws = websocket.WebSocketApp(
        socket,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    
    logger.info("Starting WebSocket connection...")
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})  # Disable SSL certificate verification