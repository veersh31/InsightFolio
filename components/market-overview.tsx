import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

export function MarketOverview() {
  const marketData = [
    { name: "S&P 500", value: 4185.47, change: 23.45, changePercent: 0.56 },
    { name: "NASDAQ", value: 12845.78, change: -45.23, changePercent: -0.35 },
    { name: "DOW", value: 33456.89, change: 156.78, changePercent: 0.47 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((index, i) => (
            <div key={index.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{index.name}</p>
                <p className="text-sm text-muted-foreground">{index.value.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {index.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${index.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {index.change > 0 ? "+" : ""}
                    {index.change}
                  </span>
                </div>
                <p className={`text-xs ${index.changePercent > 0 ? "text-green-500" : "text-red-500"}`}>
                  {index.changePercent > 0 ? "+" : ""}
                  {index.changePercent}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
