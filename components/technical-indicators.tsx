import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

export function TechnicalIndicators() {
  const indicators = [
    { name: "RSI (14)", value: 68.5, signal: "Neutral", description: "Relative Strength Index" },
    { name: "MACD", value: 2.34, signal: "Bullish", description: "Moving Average Convergence Divergence" },
    { name: "SMA (50)", value: 172.45, signal: "Bullish", description: "50-day Simple Moving Average" },
    { name: "SMA (200)", value: 165.78, signal: "Bullish", description: "200-day Simple Moving Average" },
    { name: "Bollinger Bands", value: 0.75, signal: "Neutral", description: "Price relative to bands" },
    { name: "Volume", value: 1.2, signal: "High", description: "Relative to average volume" },
  ]

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case "bullish":
      case "buy":
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "bearish":
      case "sell":
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal.toLowerCase()) {
      case "bullish":
      case "buy":
      case "high":
        return <TrendingUp className="h-3 w-3" />
      case "bearish":
      case "sell":
      case "low":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Technical Indicators - AAPL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{indicator.name}</h4>
                <Badge className={getSignalColor(indicator.signal)}>
                  <div className="flex items-center gap-1">
                    {getSignalIcon(indicator.signal)}
                    {indicator.signal}
                  </div>
                </Badge>
              </div>

              <p className="text-2xl font-bold mb-1">
                {typeof indicator.value === "number" ? indicator.value.toFixed(2) : indicator.value}
              </p>

              <p className="text-sm text-muted-foreground">{indicator.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Technical Summary</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Overall technical outlook is <strong>Bullish</strong> with 4 out of 6 indicators showing positive signals.
            RSI indicates the stock is approaching overbought territory but hasn't crossed the threshold yet.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
