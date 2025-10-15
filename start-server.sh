#!/bin/bash

# Start the yfinance FastAPI server for historical data
echo "Starting yfinance API server..."
echo "Server will be available at http://127.0.0.1:8000"
echo "To stop the server, press Ctrl+C"
echo ""

# Start the server
python -m uvicorn yfinance_api:app --host 127.0.0.1 --port 8000
