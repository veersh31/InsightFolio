import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Calculator } from "lucide-react"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { FundamentalData } from "@/lib/types"

interface FundamentalAnalysisProps {
  selectedStock?: string | null
}

export function FundamentalAnalysis({ selectedStock }: FundamentalAnalysisProps) {
  const [fundamentalData, setFundamentalData] = useState<FundamentalData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedStock) {
      setFundamentalData(null)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await dataService.getFundamentalData(selectedStock)
        setFundamentalData(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch fundamental data')
        console.error('Error fetching fundamental data:', err)
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
            <Calculator className="h-5 w-5" />
            Fundamental Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Select a stock to view fundamental analysis
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
            <Calculator className="h-5 w-5" />
            Fundamental Analysis - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading fundamental data...</p>
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
            <Calculator className="h-5 w-5" />
            Fundamental Analysis - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600 mb-2">Error loading fundamental data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!fundamentalData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Fundamental Analysis - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No fundamental data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  // Use real data from the API

  // Use real data from the API - earnings data would come from fundamentalData.earningsData
  const earningsData = fundamentalData.earningsData || []
  
  // Mock peer comparison data (this would ideally come from a separate API call)
  const peerComparison = [
    { company: selectedStock, peRatio: fundamentalData.peRatio, marketCap: fundamentalData.marketCap / 1e9, revenue: 0, isTarget: true },
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
          Fundamental Analysis - {selectedStock}
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
