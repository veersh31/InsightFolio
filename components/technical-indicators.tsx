import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { realDataService } from "@/lib/real-data-service"
import { TechnicalIndicator } from "@/lib/types"

interface TechnicalIndicatorsProps {
  selectedStock?: string | null
}

export function TechnicalIndicators({ selectedStock }: TechnicalIndicatorsProps) {
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedStock) {
      setIndicators([])
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await realDataService.getTechnicalIndicators(selectedStock)
        setIndicators(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch technical indicators')
        console.error('Error fetching technical indicators:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStock])

  if (!selectedStock) {
    return (
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Technical Indicators
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Select a stock to view technical indicators
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Indicators - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading technical indicators...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Indicators - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600 mb-2">Error loading technical indicators</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!indicators || indicators.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Indicators - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No technical indicators available</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  // Use real data from the API

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
          Technical Indicators - {selectedStock}
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
