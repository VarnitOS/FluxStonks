import pandas as pd
import numpy as np
from typing import Dict, List
from datetime import datetime, timezone

class TechnicalIndicators:
    @staticmethod
    def calculate_rsi(data: pd.Series, periods: int = 14) -> float:
        """Calculate RSI"""
        delta = data.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs)).iloc[-1]

    @staticmethod
    def calculate_macd(data: pd.Series) -> Dict:
        """Calculate MACD"""
        exp1 = data.ewm(span=12, adjust=False).mean()
        exp2 = data.ewm(span=26, adjust=False).mean()
        macd = exp1 - exp2
        signal = macd.ewm(span=9, adjust=False).mean()
        return {
            "macd": float(macd.iloc[-1]),
            "signal": float(signal.iloc[-1]),
            "histogram": float(macd.iloc[-1] - signal.iloc[-1])
        }

    @staticmethod
    def calculate_moving_averages(data: pd.Series) -> Dict:
        """Calculate Moving Averages"""
        return {
            "ma50": float(data.rolling(window=50).mean().iloc[-1]),
            "ma200": float(data.rolling(window=200).mean().iloc[-1])
        }

    @staticmethod
    def calculate_volume_ma(data: pd.Series, periods: int = 20) -> float:
        """Calculate Volume Moving Average"""
        return float(data.rolling(window=periods).mean().iloc[-1])

    @classmethod
    def get_all_indicators(cls, df: pd.DataFrame) -> Dict:
        """Calculate all technical indicators"""
        try:
            if df.empty:
                return {}

            return {
                "rsi": cls.calculate_rsi(df['close']),
                "macd": cls.calculate_macd(df['close']),
                "moving_averages": cls.calculate_moving_averages(df['close']),
                "volume_ma": cls.calculate_volume_ma(df['volume']),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        except Exception as e:
            print(f"Error calculating indicators: {e}")
            return {} 