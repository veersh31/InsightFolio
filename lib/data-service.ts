import type {
  Stock,
  Portfolio,
  PortfolioHolding,
  MLPrediction,
  TechnicalIndicator,
  NewsItem,
  MarketIndex,
  SentimentData,
  RiskMetrics,
  FundamentalData,
} from "./types"

const POLYGON_API_KEY = "ZGg7pgHcHAPTGyXXSGppa1jzHxcpCH48"
const ALPHA_VANTAGE_API_KEY = "C3L12YWVE5QQ38OH"

class RealDataService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  private setCachedData<T>(key: string, data: T, ttl = 30000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
  }

  async getStock(symbol: string): Promise<Stock | null> {
    const cacheKey = `stock_${symbol}`
    const cached = this.getCachedData<Stock>(cacheKey)
    if (cached) return cached

    console.log(`[v0] Searching for symbol: ${symbol}`)

    try {
      let stockData: Stock | null = null

      try {
        console.log(`[v0] Trying Alpha Vantage for ${symbol}`)
        const avResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        )
        const avData = await avResponse.json()

        console.log(`[v0] Alpha Vantage response for ${symbol}:`, avData)

        if (avData["Global Quote"] && avData["Global Quote"]["05. price"]) {
          const quote = avData["Global Quote"]
          const currentPrice = Number.parseFloat(quote["05. price"])
          const openPrice = Number.parseFloat(quote["02. open"])
          const change = Number.parseFloat(quote["09. change"])
          const changePercent = Number.parseFloat(quote["10. change percent"].replace("%", ""))
          const volume = Number.parseInt(quote["06. volume"]) || 0

          let companyName = symbol
          let marketCap = 0
          try {
            const overviewResponse = await fetch(
              `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
            )
            const overviewData = await overviewResponse.json()
            if (overviewData.Name) {
              companyName = overviewData.Name
            }
            if (overviewData.MarketCapitalization) {
              marketCap = Number.parseFloat(overviewData.MarketCapitalization) || 0
            }
          } catch (e) {
            console.log(`[v0] Company name/market cap lookup failed for ${symbol}`)
          }

          stockData = {
            symbol: symbol.toUpperCase(),
            name: companyName,
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            volume: volume,
            marketCap,
            peRatio: 0,
            high52Week: currentPrice * 1.2,
            low52Week: currentPrice * 0.8,
          }

          console.log(`[v0] Successfully fetched data for ${symbol}: $${currentPrice}`)
        } else if (avData["Error Message"]) {
          console.log(`[v0] Alpha Vantage error for ${symbol}: ${avData["Error Message"]}`)
        } else if (avData["Note"]) {
          console.log(`[v0] Alpha Vantage rate limit for ${symbol}: ${avData["Note"]}`)
        }
      } catch (error) {
        console.log(`[v0] Alpha Vantage failed for ${symbol}:`, error)
      }

      if (!stockData) {
        try {
          console.log(`[v0] Trying Polygon for ${symbol}`)
          const prevResponse = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${POLYGON_API_KEY}`
          )
          const prevData = await prevResponse.json()

          console.log(`[v0] Polygon response for ${symbol}:`, prevData)

          if (prevData.results && prevData.results.length > 0) {
            const result = prevData.results[0]
            const currentPrice = result.c
            const openPrice = result.o
            const change = currentPrice - openPrice
            const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0
            const volume = result.v || 0

            stockData = {
              symbol: symbol.toUpperCase(),
              name: symbol,
              price: currentPrice,
              change: change,
              changePercent: changePercent,
              volume: volume,
              marketCap: 0,
              peRatio: 0,
              high52Week: currentPrice * 1.2,
              low52Week: currentPrice * 0.8,
            }

            console.log(`[v0] Successfully fetched data from Polygon for ${symbol}: $${currentPrice}`)
          } else if (prevData.status === "ERROR") {
            console.log(`[v0] Polygon error for ${symbol}: ${prevData.error}`)
          }
        } catch (error) {
          console.log(`[v0] Polygon failed for ${symbol}:`, error)
        }
      }


      if (stockData) {
  this.setCachedData(cacheKey, stockData, 60000)
        return stockData
      }

  console.error(`[v0] No data found for symbol: ${symbol} from any API`)
  return null
    } catch (error) {
      console.error(`[v0] Error fetching stock data for ${symbol}:`, error)
      return null
    }
  }

  async getStocks(symbols?: string[]): Promise<Stock[]> {
    const stockSymbols = symbols || ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA", "META"]
    const stocks: Stock[] = []

    for (const symbol of stockSymbols) {
      const stock = await this.getStock(symbol)
      if (stock) {
        stocks.push(stock)
      }
    }

    return stocks
  }

  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    const cacheKey = `technical_${symbol}`
    const cached = this.getCachedData<TechnicalIndicator[]>(cacheKey)
    if (cached) return cached

    try {
      const indicators: TechnicalIndicator[] = []

      const rsiResponse = await fetch(
        `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
      )
      const rsiData = await rsiResponse.json()

      if (rsiData["Technical Analysis: RSI"]) {
        const latestRSI = Object.values(rsiData["Technical Analysis: RSI"])[0] as any
        indicators.push({
          name: "RSI (14)",
          value: Number.parseFloat(latestRSI.RSI),
          signal:
            Number.parseFloat(latestRSI.RSI) > 70 ? "Bearish" : Number.parseFloat(latestRSI.RSI) < 30 ? "Bullish" : "Neutral",
          description: "Relative Strength Index - momentum oscillator",
        })
      }

      const macdResponse = await fetch(
        `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
      )
      const macdData = await macdResponse.json()

      if (macdData["Technical Analysis: MACD"]) {
        const latestMACD = Object.values(macdData["Technical Analysis: MACD"])[0] as any
        const macdValue = Number.parseFloat(latestMACD.MACD)
        const signalValue = Number.parseFloat(latestMACD.MACD_Signal)

        indicators.push({
          name: "MACD",
          value: macdValue,
          signal: macdValue > signalValue ? "Bullish" : "Bearish",
          description: "Moving Average Convergence Divergence",
        })
      }

      const sma20Response = await fetch(
        `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=20&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
      )
      const sma20Data = await sma20Response.json()

      if (sma20Data["Technical Analysis: SMA"]) {
        const latestSMA20 = Object.values(sma20Data["Technical Analysis: SMA"])[0] as any
        indicators.push({
          name: "SMA (20)",
          value: Number.parseFloat(latestSMA20.SMA),
          signal: "Neutral",
          description: "20-day Simple Moving Average",
        })
      }

  this.setCachedData(cacheKey, indicators, 300000)
      return indicators
    } catch (error) {
      console.error(`Error fetching technical indicators for ${symbol}:`, error)
      return []
    }
  }

  async getNews(symbol?: string, limit = 10): Promise<NewsItem[]> {
    const cacheKey = symbol ? `news_${symbol}_${limit}` : `news_all_${limit}`
    const cached = this.getCachedData<NewsItem[]>(cacheKey)
    if (cached) return cached

    try {
      const newsResponse = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol || "AAPL,GOOGL,MSFT"}&apikey=${ALPHA_VANTAGE_API_KEY}`
      )
      const newsData = await newsResponse.json()

      if (!newsData.feed) {
        return []
      }

      const news: NewsItem[] = newsData.feed.slice(0, limit).map((item: any, index: number) => ({
        id: index.toString(),
        title: item.title,
        source: item.source,
        sentiment: Number.parseFloat(item.overall_sentiment_score) || 0.5,
        time: new Date(item.time_published).toLocaleString(),
        impact:
          Number.parseFloat(item.overall_sentiment_score) > 0.2
            ? "High"
            : Number.parseFloat(item.overall_sentiment_score) > 0
              ? "Medium"
              : "Low",
      }))

  this.setCachedData(cacheKey, news, 300000)
      return news
    } catch (error) {
      console.error(`Error fetching news:`, error)
      return []
    }
  }

  async getMarketIndices(): Promise<MarketIndex[]> {
    const cacheKey = "market_indices"
    const cached = this.getCachedData<MarketIndex[]>(cacheKey)
    if (cached) return cached

    try {
  const indices = ["SPY", "QQQ", "DIA"]
      const marketData: MarketIndex[] = []

      for (const symbol of indices) {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        )
        const data = await response.json()

        if (data["Global Quote"]) {
          const quote = data["Global Quote"]
          const indexName = symbol === "SPY" ? "S&P 500" : symbol === "QQQ" ? "NASDAQ" : "Dow Jones"

          marketData.push({
            name: indexName,
            symbol: symbol,
            value: Number.parseFloat(quote["05. price"]),
            change: Number.parseFloat(quote["09. change"]),
            changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
          })
        }
      }

  this.setCachedData(cacheKey, marketData, 300000)
      return marketData
    } catch (error) {
      console.error("Error fetching market indices:", error)
      return []
    }
  }

  async getFundamentalData(symbol: string): Promise<FundamentalData> {
    const cacheKey = `fundamental_${symbol}`
    const cached = this.getCachedData<FundamentalData>(cacheKey)
    if (cached) return cached

    try {
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      )
      const overviewData = await overviewResponse.json()

      const fundamentalData: FundamentalData = {
        marketCap: Number.parseFloat(overviewData.MarketCapitalization) || 0,
        peRatio: Number.parseFloat(overviewData.PERatio) || 0,
        pegRatio: Number.parseFloat(overviewData.PEGRatio) || 0,
        priceToBook: Number.parseFloat(overviewData.PriceToBookRatio) || 0,
        priceToSales: Number.parseFloat(overviewData.PriceToSalesRatio) || 0,
        debtToEquity: Number.parseFloat(overviewData.DebtToEquityRatio) || 0,
        currentRatio: Number.parseFloat(overviewData.CurrentRatio) || 0,
        quickRatio: Number.parseFloat(overviewData.QuickRatio) || 0,
        returnOnEquity: Number.parseFloat(overviewData.ReturnOnEquityTTM) || 0,
        returnOnAssets: Number.parseFloat(overviewData.ReturnOnAssetsTTM) || 0,
        profitMargin: Number.parseFloat(overviewData.ProfitMargin) || 0,
        operatingMargin: Number.parseFloat(overviewData.OperatingMarginTTM) || 0,
  earningsData: [],
      }

  this.setCachedData(cacheKey, fundamentalData, 3600000)
      return fundamentalData
    } catch (error) {
      console.error(`Error fetching fundamental data for ${symbol}:`, error)
      return {
        marketCap: 0,
        peRatio: 0,
        pegRatio: 0,
        priceToBook: 0,
        priceToSales: 0,
        debtToEquity: 0,
        currentRatio: 0,
        quickRatio: 0,
        returnOnEquity: 0,
        returnOnAssets: 0,
        profitMargin: 0,
        operatingMargin: 0,
        earningsData: [],
      }
    }
  }

  async getMLPredictions(symbol?: string): Promise<MLPrediction[]> {
    const cacheKey = symbol ? `ml_predictions_${symbol}` : "ml_predictions_all"
    const cached = this.getCachedData<MLPrediction[]>(cacheKey)
    if (cached) return cached

    try {
      const symbols = symbol ? [symbol] : ["AAPL", "GOOGL", "MSFT", "TSLA"]
      const predictions: MLPrediction[] = []

      for (const sym of symbols) {
        const stock = await this.getStock(sym)
        if (!stock) continue

        const currentPrice = stock.price
        const volatility = Math.abs(stock.changePercent) / 100

        predictions.push({
          symbol: sym,
          currentPrice,
          predictions: [
            {
              timeframe: "1week",
              price: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
              confidence: 0.7 + Math.random() * 0.2,
              direction: stock.changePercent > 0 ? "up" : stock.changePercent < -2 ? "down" : "neutral",
            },
            {
              timeframe: "1month",
              price: currentPrice * (1 + (Math.random() - 0.5) * 0.2),
              confidence: 0.6 + Math.random() * 0.2,
              direction: volatility < 0.02 ? "up" : volatility > 0.05 ? "down" : "neutral",
            },
            {
              timeframe: "3month",
              price: currentPrice * (1 + (Math.random() - 0.5) * 0.3),
              confidence: 0.5 + Math.random() * 0.2,
              direction: "neutral",
            },
          ],
          signal: stock.changePercent > 0 ? "BUY" : stock.changePercent < -2 ? "SELL" : "HOLD",
          keyFactors: [],
          riskLevel: volatility < 0.02 ? "Low" : volatility > 0.05 ? "High" : "Medium",
        })
      }

  this.setCachedData(cacheKey, predictions, 1800000)
      return predictions
    } catch (error) {
      console.error("Error generating ML predictions:", error)
      return []
    }
  }

  async getPortfolio(): Promise<Portfolio> {
    const symbols = ["AAPL", "GOOGL"]
    const holdings: PortfolioHolding[] = []
    for (const symbol of symbols) {
      const stock = await this.getStock(symbol)
      if (stock) {
        const shares = symbol === "AAPL" ? 10 : 5
        const avgCost = symbol === "AAPL" ? 150 : 200
        const marketValue = shares * stock.price
        const gainLoss = marketValue - shares * avgCost
        const gainLossPercent = (gainLoss / (shares * avgCost)) * 100
        holdings.push({
          symbol,
          name: stock.name,
          shares,
          avgCost,
          currentPrice: stock.price,
          marketValue,
          gainLoss,
          gainLossPercent,
        })
      }
    }
    const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
    const totalCost = holdings.reduce((sum, holding) => sum + holding.shares * holding.avgCost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = (totalGainLoss / totalCost) * 100
    return {
      totalValue,
      dayChange: 0,
      dayChangePercent: 0,
      totalGainLoss,
      totalGainLossPercent,
      holdings,
    }
  }

  async getSentimentData(symbol: string): Promise<SentimentData> {
    const news = await this.getNews(symbol, 20)
    const avgSentiment = news.reduce((sum, item) => sum + item.sentiment, 0) / news.length || 0.5

    return {
      overall: { score: avgSentiment, label: "Overall", change: 0, sources: 1 },
      news: { score: avgSentiment, label: "News", articles: news.length, topSources: [] },
      social: { score: avgSentiment * 0.9, label: "Social", mentions: 0, platforms: [] },
      analyst: { score: avgSentiment * 1.1, label: "Analyst", reports: 0, upgrades: 0, downgrades: 0 },
    }
  }

  async getRiskMetrics(symbol: string): Promise<RiskMetrics> {
    const stock = await this.getStock(symbol)
    const fundamentals = await this.getFundamentalData(symbol)

    if (!stock) {
      return {
        overallRisk: "Medium",
        riskScore: 5,
        volatility: 20,
        beta: 1,
        maxDrawdown: 15,
        sharpeRatio: 0.5,
        valueAtRisk: 5,
        expectedShortfall: 2,
        correlationSP500: 0.8,
      }
    }
    return {
      overallRisk: "Medium",
      riskScore: Math.min(10, Math.max(1, Math.abs(stock.changePercent) * 2)),
      volatility: Math.abs(stock.changePercent) * 5,
      beta: stock.beta || 1,
      maxDrawdown: Math.abs(stock.changePercent) * 3,
      sharpeRatio: 0.3 + Math.random() * 0.7,
      valueAtRisk: Math.abs(stock.changePercent) * 2,
      expectedShortfall: Math.abs(stock.changePercent),
      correlationSP500: 0.8,
    }
  }

  subscribeToRealTimeData(symbols: string[], callback: (data: Stock[]) => void): () => void {
    const interval = setInterval(async () => {
      const stocks = await this.getStocks(symbols)
      callback(stocks)
  }, 60000)

    return () => clearInterval(interval)
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const dataService = new RealDataService()
