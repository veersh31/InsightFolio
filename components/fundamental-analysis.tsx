import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Calculator } from "lucide-react"

export function FundamentalAnalysis() {
  const fundamentalData = {
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
  }

  const earningsData = [
    { quarter: "Q4 2023", eps: 2.18, estimate: 2.1, beat: true, revenue: 119.58, revenueGrowth: 2.1 },
    { quarter: "Q1 2024", eps: 1.53, estimate: 1.5, beat: true, revenue: 90.75, revenueGrowth: -4.3 },
    { quarter: "Q2 2024", eps: 1.4, estimate: 1.35, beat: true, revenue: 85.78, revenueGrowth: 4.9 },
    { quarter: "Q3 2024", eps: 1.64, estimate: 1.6, beat: true, revenue: 94.93, revenueGrowth: 6.1 },
  ]

  const peerComparison = [
    { company: "AAPL", peRatio: 28.5, marketCap: 2750, revenue: 394.3, isTarget: true },
    { company: "MSFT", peRatio: 32.1, marketCap: 2890, revenue: 245.1, isTarget: false },
    { company: "GOOGL", peRatio: 24.8, marketCap: 1680, revenue: 307.4, isTarget: false },
    { company: "AMZN", peRatio: 45.2, marketCap: 1520, revenue: 574.8, isTarget: false },
  ]

  const getValuationRating = (peRatio: number) => {
    if (peRatio < 15)
      return { rating: "Undervalued", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" }
    if (peRatio < 25)
      return { rating: "Fair Value", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" }
    return { rating: "Overvalued", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Fundamental Analysis - AAPL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="valuation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="valuation">Valuation</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="financial">Financial Health</TabsTrigger>
            <TabsTrigger value="peers">Peer Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="valuation" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-lg font-bold">${(fundamentalData.marketCap / 1e12).toFixed(2)}T</p>
              </div>

              <div className="text-center p-4 rounded-lg border">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">P/E Ratio</p>
                <p className="text-lg font-bold">{fundamentalData.peRatio}</p>
                <Badge className={getValuationRating(fundamentalData.peRatio).color} size="sm">
                  {getValuationRating(fundamentalData.peRatio).rating}
                </Badge>
              </div>

              <div className="text-center p-4 rounded-lg border">
                <PieChart className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">PEG Ratio</p>
                <p className="text-lg font-bold">{fundamentalData.pegRatio}</p>
              </div>

              <div className="text-center p-4 rounded-lg border">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">P/B Ratio</p>
                <p className="text-lg font-bold">{fundamentalData.priceToBook}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Valuation Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price/Sales</span>
                    <span className="font-semibold">{fundamentalData.priceToSales}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Debt/Equity</span>
                    <span className="font-semibold">{fundamentalData.debtToEquity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Ratio</span>
                    <span className="font-semibold">{fundamentalData.currentRatio}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Profitability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROE</span>
                    <span className="font-semibold text-green-600">{fundamentalData.returnOnEquity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROA</span>
                    <span className="font-semibold text-green-600">{fundamentalData.returnOnAssets}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                    <span className="font-semibold text-green-600">{fundamentalData.profitMargin}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <div className="space-y-4">
              {earningsData.map((quarter, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{quarter.quarter}</h4>
                      <Badge
                        className={
                          quarter.beat
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {quarter.beat ? "Beat" : "Miss"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">EPS Actual</p>
                        <p className="font-semibold">${quarter.eps}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">EPS Estimate</p>
                        <p className="font-semibold">${quarter.estimate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue (B)</p>
                        <p className="font-semibold">${quarter.revenue}B</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue Growth</p>
                        <div className="flex items-center gap-1">
                          {quarter.revenueGrowth > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span
                            className={`font-semibold ${quarter.revenueGrowth > 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {quarter.revenueGrowth > 0 ? "+" : ""}
                            {quarter.revenueGrowth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Liquidity Ratios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Ratio</span>
                      <span className="font-semibold">{fundamentalData.currentRatio}</span>
                    </div>
                    <Progress value={fundamentalData.currentRatio * 50} className="h-2" />
                    <p className="text-xs text-muted-foreground">Ability to pay short-term obligations</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quick Ratio</span>
                      <span className="font-semibold">{fundamentalData.quickRatio}</span>
                    </div>
                    <Progress value={fundamentalData.quickRatio * 60} className="h-2" />
                    <p className="text-xs text-muted-foreground">Liquidity without inventory</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Efficiency Ratios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Operating Margin</span>
                      <span className="font-semibold text-green-600">{fundamentalData.operatingMargin}%</span>
                    </div>
                    <Progress value={fundamentalData.operatingMargin} className="h-2" />
                    <p className="text-xs text-muted-foreground">Operating efficiency</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Margin</span>
                      <span className="font-semibold text-green-600">{fundamentalData.profitMargin}%</span>
                    </div>
                    <Progress value={fundamentalData.profitMargin} className="h-2" />
                    <p className="text-xs text-muted-foreground">Overall profitability</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="peers" className="space-y-4">
            <div className="space-y-4">
              {peerComparison.map((company, index) => (
                <Card key={index} className={company.isTarget ? "border-primary" : ""}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{company.company}</h4>
                        {company.isTarget && <Badge variant="outline">Target</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">P/E Ratio</p>
                        <p className="font-semibold">{company.peRatio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Market Cap (B)</p>
                        <p className="font-semibold">${company.marketCap}B</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue (B)</p>
                        <p className="font-semibold">${company.revenue}B</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
