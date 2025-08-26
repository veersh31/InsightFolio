"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, BarChart3, DollarSign, Plus } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { dataService } from "@/lib/data-service"
import type { Stock, TechnicalIndicator, FundamentalData } from "@/lib/types"

interface StockInsightsProps {
  symbol: string
  onAddToWatchlist?: (symbol: string) => void
}

export function StockInsights({ symbol, onAddToWatchlist }: StockInsightsProps) {
  const [stock, setStock] = useState<Stock | null>(null)
  const [technicals, setTechnicals] = useState<TechnicalIndicator[]>([])
  const [fundamentals, setFundamentals] = useState<FundamentalData | null>(null)
  const [loading, setLoading] = useState(true)

  const generateTechnicalIndicators = (currentPrice: number): TechnicalIndicator[] => {
    return [
      { name: "SMA 20", value: currentPrice * (0.95 + Math.random() * 0.1), signal: "neutral" },
      { name: "SMA 50", value: currentPrice * (0.92 + Math.random() * 0.16), signal: "neutral" },
      { name: "EMA 12", value: currentPrice * (0.96 + Math.random() * 0.08), signal: "neutral" },
      { name: "RSI", value: 30 + Math.random() * 40, signal: "neutral" },
      { name: "MACD", value: -2 + Math.random() * 4, signal: "neutral" },
      { name: "Stochastic", value: 20 + Math.random() * 60, signal: "neutral" },
    ]
  }

  const generateFundamentalData = (): FundamentalData => {
    return {
      peRatio: 15 + Math.random() * 25,
      revenueGrowth: -5 + Math.random() * 20,
      profitMargin: 5 + Math.random() * 15,
      roe: 8 + Math.random() * 12,
      debtToEquity: 0.2 + Math.random() * 1.5,
      currentRatio: 1.0 + Math.random() * 2.0,
      epsGrowth: -10 + Math.random() * 30,
    }
  }

  const generatePriceChartData = (currentPrice: number) => {
    const data = []
    let price = currentPrice * 0.9
    for (let i = 0; i < 30; i++) {
      price += (Math.random() - 0.5) * currentPrice * 0.02
      data.push({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: Math.max(price, currentPrice * 0.8),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      })
    }
    data[data.length - 1].price = currentPrice // Ensure last price matches current
    return data
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const stockData = await dataService.getStock(symbol)

        if (stockData) {
          setStock(stockData)
          setTechnicals(generateTechnicalIndicators(stockData.price || 100))
          setFundamentals(generateFundamentalData())
        }
      } catch (error) {
        console.error("Error fetching stock insights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [symbol])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stock) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Stock data not available for {symbol}</p>
        </CardContent>
      </Card>
    )
  }

  const movingAverages = technicals.filter((t) => t.name.includes("MA") || t.name.includes("Moving Average"))
  const momentum = technicals.filter((t) => ["RSI", "MACD", "Stochastic"].includes(t.name))
  const priceChartData = generatePriceChartData(stock.price || 100)

  return (
    <div className="space-y-6">
      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-2xl font-bold">{stock.symbol}</h3>
                <p className="text-muted-foreground">{stock.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-bold">${stock.price?.toFixed(2) || "0.00"}</div>
                <Badge variant={(stock.change || 0) >= 0 ? "default" : "destructive"} className="mt-1">
                  {(stock.change || 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {(stock.change || 0) >= 0 ? "+" : ""}
                  {stock.change?.toFixed(2) || "0.00"} ({stock.changePercent?.toFixed(2) || "0.00"}%)
                </Badge>
              </div>
              <Button onClick={() => onAddToWatchlist?.(stock.symbol)} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add to Watchlist
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Volume</div>
              <div className="font-semibold">{((stock.volume || 0) / 1000000).toFixed(1)}M</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Market Cap</div>
              <div className="font-semibold">{stock.marketCap || "N/A"}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">P/E Ratio</div>
              <div className="font-semibold">{fundamentals?.peRatio?.toFixed(1) || "N/A"}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">52W High</div>
              <div className="font-semibold">${stock.high52w?.toFixed(2) || "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            30-Day Price Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="var(--color-price)"
                  fill="var(--color-price)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Moving Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Moving Averages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movingAverages.map((ma) => {
              const currentPrice = stock.price || 0
              const maValue = ma.value || 0
              const percentDiff = maValue !== 0 ? ((currentPrice - maValue) / maValue) * 100 : 0
              const isAbove = currentPrice > maValue

              return (
                <div key={ma.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{ma.name}</span>
                    <Badge variant={isAbove ? "default" : "secondary"} className="text-xs">
                      {isAbove ? "Above" : "Below"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${maValue.toFixed(2)}</div>
                    <div className={`text-sm ${isAbove ? "text-green-600" : "text-red-600"}`}>
                      {percentDiff >= 0 ? "+" : ""}
                      {percentDiff.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Momentum Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Momentum Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {momentum.map((indicator) => {
              let signal = "Neutral"
              let signalColor = "text-muted-foreground"
              const indicatorValue = indicator.value || 0

              if (indicator.name === "RSI") {
                if (indicatorValue > 70) {
                  signal = "Overbought"
                  signalColor = "text-red-600"
                } else if (indicatorValue < 30) {
                  signal = "Oversold"
                  signalColor = "text-green-600"
                }
              } else if (indicator.name === "MACD") {
                if (indicatorValue > 0) {
                  signal = "Bullish"
                  signalColor = "text-green-600"
                } else {
                  signal = "Bearish"
                  signalColor = "text-red-600"
                }
              }

              return (
                <div key={indicator.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{indicator.name}</span>
                    <div className="text-right">
                      <div className="font-semibold">{indicatorValue.toFixed(2)}</div>
                      <div className={`text-sm ${signalColor}`}>{signal}</div>
                    </div>
                  </div>
                  {indicator.name === "RSI" && <Progress value={indicatorValue} className="h-2" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {fundamentals && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Key Financial Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span
                    className={`font-semibold ${(fundamentals.revenueGrowth || 0) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(fundamentals.revenueGrowth || 0) > 0 ? "+" : ""}
                    {fundamentals.revenueGrowth?.toFixed(1) || "0.0"}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className="font-semibold">{fundamentals.profitMargin?.toFixed(1) || "0.0"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROE</span>
                  <span className="font-semibold">{fundamentals.roe?.toFixed(1) || "0.0"}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Debt to Equity</span>
                  <span className="font-semibold">{fundamentals.debtToEquity?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Ratio</span>
                  <span className="font-semibold">{fundamentals.currentRatio?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EPS Growth</span>
                  <span
                    className={`font-semibold ${(fundamentals.epsGrowth || 0) > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {(fundamentals.epsGrowth || 0) > 0 ? "+" : ""}
                    {fundamentals.epsGrowth?.toFixed(1) || "0.0"}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
