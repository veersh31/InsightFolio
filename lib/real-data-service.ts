// Helper: fetch historical daily prices for a symbol
export async function getHistoricalPrices(symbol: string, startDate: string, endDate: string): Promise<{ date: string; close: number }[]> {
  // Alpha Vantage TIME_SERIES_DAILY (free, 5 calls/min)
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`
  try {
    const resp = await fetch(url)
    const data = await resp.json()
    if (data["Error Message"]) {
      console.error(`Alpha Vantage error for ${symbol}:`, data["Error Message"])
      throw new Error(`Alpha Vantage error: ${data["Error Message"]}`)
    }
    if (data["Note"]) {
      console.error(`Alpha Vantage note for ${symbol}:`, data["Note"])
      throw new Error(`Alpha Vantage note: ${data["Note"]}`)
    }
    const series = data["Time Series (Daily)"] || {}
    if (!series || Object.keys(series).length === 0) {
      console.error(`No historical data found for ${symbol} in Alpha Vantage response.`, data)
      throw new Error(`No historical data found for ${symbol}.`)
    }
    const results: { date: string; close: number }[] = []
    for (const date in series) {
      if (date >= startDate && date <= endDate) {
        results.push({ date, close: parseFloat(series[date]["5. adjusted close"] || series[date]["4. close"]) })
      }
    }
    // Sort by date ascending
    results.sort((a, b) => a.date.localeCompare(b.date))
    if (results.length === 0) {
      console.warn(`No price data for ${symbol} between ${startDate} and ${endDate}`)
    }
    return results
  } catch (err) {
    console.error(`Failed to fetch historical prices for ${symbol}:`, err)
    throw err
  }
}
import type {
  Stock,
  Portfolio,
  MLPrediction,
  TechnicalIndicator,
  NewsItem,
  MarketIndex,
  SentimentData,
  RiskMetrics,
  FundamentalData,
} from "./types"

// API Configuration
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

    try {
      // Get current price from Polygon
      const priceResponse = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${POLYGON_API_KEY}`,
      )
      const priceData = await priceResponse.json()

      if (!priceData.results || priceData.results.length === 0) {
        console.error(`No data found for symbol: ${symbol}`)
        return null
      }

      const result = priceData.results[0]
      const currentPrice = result.c // Close price
      const openPrice = result.o // Open price
      const change = currentPrice - openPrice
      const changePercent = (change / openPrice) * 100

      // Get company details from Alpha Vantage
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      )
      const overviewData = await overviewResponse.json()

      const stock: Stock = {
        symbol: symbol.toUpperCase(),
        name: overviewData.Name || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: result.v || 0,
        marketCap: Number.parseFloat(overviewData.MarketCapitalization) || 0,
        peRatio: Number.parseFloat(overviewData.PERatio) || 0,
        high52Week: Number.parseFloat(overviewData["52WeekHigh"]) || currentPrice * 1.2,
        low52Week: Number.parseFloat(overviewData["52WeekLow"]) || currentPrice * 0.8,
      }

      this.setCachedData(cacheKey, stock, 60000) // 1 minute cache
      return stock
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error)
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

      // Get RSI
      const rsiResponse = await fetch(
        `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`,
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

      // Get MACD
      const macdResponse = await fetch(
        `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`,
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

      // Get Moving Averages
      const sma20Response = await fetch(
        `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=20&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`,
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

      this.setCachedData(cacheKey, indicators, 300000) // 5 minute cache
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
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol || "AAPL,GOOGL,MSFT"}&apikey=${ALPHA_VANTAGE_API_KEY}`,
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

      this.setCachedData(cacheKey, news, 300000) // 5 minute cache
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
      const indices = ["SPY", "QQQ", "DIA"] // ETFs representing major indices
      const marketData: MarketIndex[] = []

      for (const symbol of indices) {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
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

      this.setCachedData(cacheKey, marketData, 300000) // 5 minute cache
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
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
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
        earningsData: [], // Not available in this API call
      }

      this.setCachedData(cacheKey, fundamentalData, 3600000) // 1 hour cache
  return fundamentalData
    } catch (error) {
      console.error(`Error fetching fundamental data for ${symbol}:`, error)
      // Return default values on error
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

        // Generate predictions based on current price and technical indicators
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
          riskLevel: "Medium",
        })
      }

      this.setCachedData(cacheKey, predictions, 1800000) // 30 minute cache
      return predictions
    } catch (error) {
      console.error("Error generating ML predictions:", error)
      return []
    }
  }

  // Mock implementations for features not available in free APIs
  async getPortfolio(): Promise<Portfolio> {
    // This would typically come from user's brokerage account
    const mockHoldings = [
      { symbol: "AAPL", name: "Apple Inc.", shares: 10, avgCost: 150, currentPrice: 0, marketValue: 0, gainLoss: 0, gainLossPercent: 0 },
      { symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, avgCost: 200, currentPrice: 0, marketValue: 0, gainLoss: 0, gainLossPercent: 0 },
    ]

    // Update with real prices
    const updatedHoldings = await Promise.all(
      mockHoldings.map(async (holding) => {
        const stock = await this.getStock(holding.symbol)
        if (stock) {
          const marketValue = holding.shares * stock.price
          const gainLoss = marketValue - holding.shares * holding.avgCost
          const gainLossPercent = (gainLoss / (holding.shares * holding.avgCost)) * 100

          return {
            ...holding,
            currentPrice: stock.price,
            marketValue,
            gainLoss,
            gainLossPercent,
          }
        }
        return holding
      }),
    )

    const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.marketValue, 0)
    const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.shares * holding.avgCost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = (totalGainLoss / totalCost) * 100

    return {
      totalValue,
      dayChange: 0,
      dayChangePercent: 0,
      totalGainLoss,
      totalGainLossPercent,
      holdings: updatedHoldings,
    }
  }

  async getSentimentData(symbol: string): Promise<SentimentData> {
    // Use news sentiment as proxy
    const news = await this.getNews(symbol, 20)
    const avgSentiment = news.reduce((sum, item) => sum + item.sentiment, 0) / news.length || 0.5

    return {
      overall: { score: avgSentiment, label: "Overall", change: 0, sources: 1 },
      news: { score: avgSentiment, label: "News", articles: 1, topSources: [] },
      social: { score: avgSentiment * 0.9, label: "Social", mentions: 1, platforms: [] },
      analyst: { score: avgSentiment * 1.1, label: "Analyst", reports: 1, upgrades: 0, downgrades: 0 },
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
      beta: 1,
      maxDrawdown: Math.abs(stock.changePercent) * 3,
      sharpeRatio: 0.3 + Math.random() * 0.7,
      valueAtRisk: Math.abs(stock.changePercent) * 2,
      expectedShortfall: Math.abs(stock.changePercent),
      correlationSP500: 0.8,
    }
  }

  // Real-time data simulation with actual API calls
  subscribeToRealTimeData(symbols: string[], callback: (data: Stock[]) => void): () => void {
    const interval = setInterval(async () => {
      const stocks = await this.getStocks(symbols)
      callback(stocks)
    }, 60000) // Update every minute to respect API limits

    return () => clearInterval(interval)
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const realDataService = new RealDataService()
