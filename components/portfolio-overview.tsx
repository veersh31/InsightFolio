import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"

export function PortfolioOverview() {
  const portfolioData = {
    totalValue: 125420.5,
    dayChange: 2340.25,
    dayChangePercent: 1.9,
    totalGainLoss: 15420.5,
    totalGainLossPercent: 14.0,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Today's Change</p>
            <div className="flex items-center gap-1">
              {portfolioData.dayChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className={`text-lg font-semibold ${portfolioData.dayChange > 0 ? "text-green-500" : "text-red-500"}`}>
                ${Math.abs(portfolioData.dayChange).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Day Change %</p>
            <div className="flex items-center gap-1">
              <Percent className="h-4 w-4" />
              <p
                className={`text-lg font-semibold ${
                  portfolioData.dayChangePercent > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {portfolioData.dayChangePercent > 0 ? "+" : ""}
                {portfolioData.dayChangePercent}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
            <div className="flex items-center gap-1">
              {portfolioData.totalGainLoss > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p
                className={`text-lg font-semibold ${
                  portfolioData.totalGainLoss > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ${Math.abs(portfolioData.totalGainLoss).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
