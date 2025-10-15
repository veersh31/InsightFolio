
# InsightFolio

**AI-Powered Stock Analytics & Portfolio Dashboard**

InsightFolio is a modern, real-time stock analytics dashboard inspired by the best of Robinhood and Webull. It provides advanced portfolio management, AI-driven insights, and a beautiful, responsive UI built with Next.js, React, and TypeScript.

---

## 🚀 Features

### Real-Time Data & Analytics
- **Live Stock Quotes**: All data is fetched in real time from Alpha Vantage and Polygon APIs (no mock data).
- **Market Overview**: S&P 500, NASDAQ, DOW, and more with live price, change, and percent change.
- **Portfolio Overview**: See your total value, daily change, and total gain/loss at a glance.

### Portfolio Management
- **Manual Input**: Add, edit, and remove stocks, shares, and average cost directly in the dashboard.
- **CSV Upload**: Upload your portfolio as a CSV file (`symbol,shares,avgCost`) for instant population.
- **Persistent State**: Your portfolio is saved in localStorage for seamless experience.

### Advanced Analytics
- **AI-Powered Portfolio Optimizer**: Get optimal weights and risk/return stats for your portfolio.
- **Correlation Matrix**: Visualize correlations between your holdings with a heatmap.
- **Backtesting**: Simulate historical performance of your portfolio with real price data.
- **ML Predictions**: View AI-generated price predictions and confidence for selected stocks.
- **Technical Indicators**: See RSI, MACD, and moving averages for any stock.
- **Fundamental Analysis**: Get market cap, P/E, PEG, and more for your holdings.
- **Sentiment & Risk Analytics**: News sentiment and risk metrics for your portfolio and stocks.

### Modern UI/UX
- **Sticky Navigation Bar**: Fast tab switching, always accessible.
- **Responsive Design**: Works beautifully on desktop and mobile.
- **Colorful, Accessible Cards**: Clear, vibrant metrics for all dashboard sections.
- **User-Friendly Inputs**: Add stocks, upload CSV, and manage your portfolio with ease.
- **Welcome Message & Avatar**: Personalized dashboard experience.

### Tech Stack
- **Next.js 15, React 19, TypeScript**
- **shadcn/ui, Lucide Icons, Nivo Charts**
- **Alpha Vantage & Polygon APIs**

---

## 📦 Getting Started

1. **Clone the repo:**
	```bash
	git clone https://github.com/veersh31/MLStock.git
	cd MLStock
	```

2. **Install dependencies:**
	```bash
	npm install --legacy-peer-deps
	# or
	pnpm install
	```

3. **Start the historical data server (required for backtesting):**
	```bash
	# Install Python dependencies
	pip install fastapi uvicorn yfinance
	
	# Start the server
	./start-server.sh
	# or manually:
	# python -m uvicorn yfinance_api:app --host 127.0.0.1 --port 8000
	```

4. **Run the dev server:**
	```bash
	npm run dev
	# or
	pnpm run dev
	```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 📝 CSV Portfolio Format

Upload a CSV file with the following columns:

```
symbol,shares,avgCost
AAPL,10,175.50
TSLA,5,700.00
GOOGL,2,2800.00
```

**Sample CSV file**: Use `sample-portfolio.csv` in the project root as a template.

---

## 🛠️ Customization & API Keys
- Edit `/lib/data-service.ts` to set your Alpha Vantage and Polygon API keys.
- All data is fetched live; no mock data is used anywhere.

---

## 📄 License
MIT

---

## 👤 Author
- [@veersh31](https://github.com/veersh31)

---

## ⭐️ Star this repo if you like InsightFolio!
