from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import yfinance as yf
import pandas as pd
from datetime import datetime

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/historical-prices")
def get_historical_prices(
    symbol: str = Query(..., description="Stock symbol, e.g. AAPL"),
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD")
):
    try:
        # Download data with auto_adjust=True to get adjusted prices
        data = yf.download(symbol, start=start, end=end, progress=False, auto_adjust=True)
        if data.empty:
            return {"results": []}

        # Flatten MultiIndex columns if present (yfinance sometimes returns MultiIndex)
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        # Handle the case where Close might be a series or single value
        results = []
        for idx, row in data.iterrows():
            close_value = row["Close"]
            # Convert to float properly, handling both series and scalar values
            if hasattr(close_value, 'iloc'):
                # It's a pandas Series, get the first value
                close_float = float(close_value.iloc[0])
            else:
                # It's already a scalar
                close_float = float(close_value)

            results.append({
                "date": idx.strftime("%Y-%m-%d"),
                "close": close_float
            })

        return {"results": results}
    except Exception as e:
        return {"error": str(e)}
