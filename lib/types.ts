export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  high52Week: number
  low52Week: number
  peRatio?: number
  dividend?: number
  beta?: number
}

export interface Portfolio {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: PortfolioHolding[]
}

export interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  marketValue: number
  gainLoss: number
  gainLossPercent: number
}

export interface MLPrediction {
  symbol: string
  currentPrice: number
  predictions: {
    timeframe: "1day" | "1week" | "1month" | "3month"
    price: number
    confidence: number
    direction: "up" | "down" | "neutral"
  }[]
  signal: "BUY" | "SELL" | "HOLD"
  keyFactors: string[]
  riskLevel: "Low" | "Medium" | "High"
}

export interface TechnicalIndicator {
  name: string
  value: number
  signal: "Bullish" | "Bearish" | "Neutral"
  description: string
}

export interface NewsItem {
  id: string
  title: string
  source: string
  sentiment: number
  time: string
  impact: "High" | "Medium" | "Low"
  url?: string
}

export interface Alert {
  id: string
  type: "price" | "prediction" | "news" | "technical"
  symbol: string
  condition: string
  value: number | string
  isActive: boolean
  created: string
  triggered?: boolean
  message?: string
}

export interface MarketIndex {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
}

export interface SentimentData {
  overall: {
    score: number
    label: string
    change: number
    sources: number
  }
  news: {
    score: number
    label: string
    articles: number
    topSources: string[]
  }
  social: {
    score: number
    label: string
    mentions: number
    platforms: string[]
  }
  analyst: {
    score: number
    label: string
    reports: number
    upgrades: number
    downgrades: number
  }
}

export interface RiskMetrics {
  overallRisk: string
  riskScore: number
  volatility: number
  beta: number
  maxDrawdown: number
  sharpeRatio: number
  valueAtRisk: number
  expectedShortfall: number
  correlationSP500: number
}

export interface FundamentalData {
  marketCap: number
  peRatio: number
  pegRatio: number
  priceToBook: number
  priceToSales: number
  debtToEquity: number
  currentRatio: number
  quickRatio: number
  returnOnEquity: number
  returnOnAssets: number
  profitMargin: number
  operatingMargin: number
  earningsData: EarningsQuarter[]
}

export interface EarningsQuarter {
  quarter: string
  eps: number
  estimate: number
  beat: boolean
  revenue: number
  revenueGrowth: number
}
