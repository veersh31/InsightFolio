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

export const mockStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: 45678900,
    marketCap: 2750000000000,
    high52Week: 198.23,
    low52Week: 124.17,
    peRatio: 28.5,
    dividend: 0.96,
    beta: 1.24,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 207.8,
    change: -1.15,
    changePercent: -0.55,
    volume: 1234567,
    marketCap: 2580000000000,
    high52Week: 193.31,
    low52Week: 83.34,
    peRatio: 24.8,
    beta: 1.05,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 245.78,
    change: 8.92,
    changePercent: 3.77,
    volume: 23456789,
    marketCap: 780000000000,
    high52Week: 414.5,
    low52Week: 152.37,
    peRatio: 45.2,
    beta: 2.11,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.92,
    change: -2.45,
    changePercent: -0.64,
    volume: 12345678,
    marketCap: 2890000000000,
    high52Week: 384.3,
    low52Week: 213.43,
    peRatio: 32.1,
    dividend: 2.72,
    beta: 0.89,
  },
]

export const mockPortfolio: Portfolio = {
  totalValue: 125420.5,
  dayChange: 2340.25,
  dayChangePercent: 1.9,
  totalGainLoss: 15420.5,
  totalGainLossPercent: 14.0,
  holdings: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 100,
      avgCost: 150.25,
      currentPrice: 175.43,
      marketValue: 17543,
      gainLoss: 2518,
      gainLossPercent: 16.76,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 50,
      avgCost: 195.0,
      currentPrice: 207.8,
      marketValue: 10390,
      gainLoss: 640,
      gainLossPercent: 6.56,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      shares: 50,
      avgCost: 220.0,
      currentPrice: 245.78,
      marketValue: 12289,
      gainLoss: 1289,
      gainLossPercent: 11.72,
    },
  ],
}

export const mockMLPredictions: MLPrediction[] = [
  {
    symbol: "AAPL",
    currentPrice: 175.43,
    predictions: [
      { timeframe: "1day", price: 178.2, confidence: 0.85, direction: "up" },
      { timeframe: "1week", price: 182.5, confidence: 0.72, direction: "up" },
      { timeframe: "1month", price: 185.3, confidence: 0.68, direction: "up" },
      { timeframe: "3month", price: 188.7, confidence: 0.58, direction: "up" },
    ],
    signal: "BUY",
    keyFactors: ["Strong earnings trend", "Positive sentiment", "Technical breakout"],
    riskLevel: "Medium",
  },
  {
    symbol: "TSLA",
    currentPrice: 245.78,
    predictions: [
      { timeframe: "1day", price: 242.1, confidence: 0.78, direction: "down" },
      { timeframe: "1week", price: 255.4, confidence: 0.65, direction: "up" },
      { timeframe: "1month", price: 268.9, confidence: 0.58, direction: "up" },
      { timeframe: "3month", price: 275.2, confidence: 0.52, direction: "up" },
    ],
    signal: "HOLD",
    keyFactors: ["Volatile market conditions", "Mixed analyst sentiment", "High beta exposure"],
    riskLevel: "High",
  },
  {
    symbol: "GOOGL",
    currentPrice: 207.8,
    predictions: [
      { timeframe: "1day", price: 209.5, confidence: 0.82, direction: "up" },
      { timeframe: "1week", price: 215.3, confidence: 0.75, direction: "up" },
      { timeframe: "1month", price: 225.8, confidence: 0.69, direction: "up" },
      { timeframe: "3month", price: 240.2, confidence: 0.61, direction: "up" },
    ],
    signal: "BUY",
    keyFactors: ["AI revenue growth", "Cloud expansion", "Search dominance"],
    riskLevel: "Medium",
  },
  {
    symbol: "MSFT",
    currentPrice: 378.92,
    predictions: [
      { timeframe: "1day", price: 381.2, confidence: 0.79, direction: "up" },
      { timeframe: "1week", price: 385.7, confidence: 0.71, direction: "up" },
      { timeframe: "1month", price: 395.4, confidence: 0.66, direction: "up" },
      { timeframe: "3month", price: 410.8, confidence: 0.59, direction: "up" },
    ],
    signal: "BUY",
    keyFactors: ["Azure growth", "AI integration", "Enterprise demand"],
    riskLevel: "Low",
  },
]

export const mockTechnicalIndicators: TechnicalIndicator[] = [
  { name: "RSI (14)", value: 68.5, signal: "Neutral", description: "Relative Strength Index" },
  { name: "MACD", value: 2.34, signal: "Bullish", description: "Moving Average Convergence Divergence" },
  { name: "SMA (50)", value: 172.45, signal: "Bullish", description: "50-day Simple Moving Average" },
  { name: "SMA (200)", value: 165.78, signal: "Bullish", description: "200-day Simple Moving Average" },
  { name: "Bollinger Bands", value: 0.75, signal: "Neutral", description: "Price relative to bands" },
  { name: "Volume", value: 1.2, signal: "Bullish", description: "Relative to average volume" },
]

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Apple Reports Strong Q3 Earnings, Beats Expectations",
    source: "Reuters",
    sentiment: 0.85,
    time: "2 hours ago",
    impact: "High",
  },
  {
    id: "2",
    title: "iPhone 15 Sales Exceed Analyst Projections",
    source: "Bloomberg",
    sentiment: 0.78,
    time: "4 hours ago",
    impact: "Medium",
  },
  {
    id: "3",
    title: "Apple Services Revenue Continues Growth Trajectory",
    source: "CNBC",
    sentiment: 0.72,
    time: "6 hours ago",
    impact: "Medium",
  },
  {
    id: "4",
    title: "Concerns Over China Market Headwinds",
    source: "Financial Times",
    sentiment: 0.35,
    time: "8 hours ago",
    impact: "Medium",
  },
]

export const mockMarketIndices: MarketIndex[] = [
  { name: "S&P 500", symbol: "SPX", value: 4185.47, change: 23.45, changePercent: 0.56 },
  { name: "NASDAQ", symbol: "IXIC", value: 12845.78, change: -45.23, changePercent: -0.35 },
  { name: "DOW", symbol: "DJI", value: 33456.89, change: 156.78, changePercent: 0.47 },
]

export const mockSentimentData: SentimentData = {
  overall: {
    score: 0.72,
    label: "Bullish",
    change: 0.08,
    sources: 1247,
  },
  news: {
    score: 0.68,
    label: "Positive",
    articles: 156,
    topSources: ["Reuters", "Bloomberg", "CNBC"],
  },
  social: {
    score: 0.76,
    label: "Very Positive",
    mentions: 8924,
    platforms: ["Twitter", "Reddit", "StockTwits"],
  },
  analyst: {
    score: 0.71,
    label: "Positive",
    reports: 23,
    upgrades: 8,
    downgrades: 2,
  },
}

export const mockRiskMetrics: RiskMetrics = {
  overallRisk: "Medium",
  riskScore: 6.2,
  volatility: 28.5,
  beta: 1.34,
  maxDrawdown: -12.7,
  sharpeRatio: 1.42,
  valueAtRisk: -4.2,
  expectedShortfall: -6.8,
  correlationSP500: 0.78,
}

export const mockFundamentalData: FundamentalData = {
  marketCap: 2.75e12,
  peRatio: 28.5,
  pegRatio: 1.8,
  priceToBook: 45.2,
  priceToSales: 7.3,
  debtToEquity: 1.73,
  currentRatio: 0.94,
  quickRatio: 0.81,
  returnOnEquity: 147.4,
  returnOnAssets: 22.6,
  profitMargin: 25.3,
  operatingMargin: 29.8,
  earningsData: [
    { quarter: "Q4 2023", eps: 2.18, estimate: 2.1, beat: true, revenue: 119.58, revenueGrowth: 2.1 },
    { quarter: "Q1 2024", eps: 1.53, estimate: 1.5, beat: true, revenue: 90.75, revenueGrowth: -4.3 },
    { quarter: "Q2 2024", eps: 1.4, estimate: 1.35, beat: true, revenue: 85.78, revenueGrowth: 4.9 },
    { quarter: "Q3 2024", eps: 1.64, estimate: 1.6, beat: true, revenue: 94.93, revenueGrowth: 6.1 },
  ],
}
