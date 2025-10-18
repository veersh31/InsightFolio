import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, TrendingDown, BarChart3, Target, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import { dataService } from "@/lib/data-service"
import { RiskMetrics } from "@/lib/types"

interface RiskAnalyticsProps {
  selectedStock?: string | null
}

export function RiskAnalytics({ selectedStock }: RiskAnalyticsProps) {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedStock) {
      setRiskMetrics(null)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const risk = await dataService.getRiskMetrics(selectedStock)
        setRiskMetrics(risk)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch risk data')
        console.error('Error fetching risk data:', err)
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
            <Shield className="h-5 w-5" />
            Risk Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Select a stock to view risk analytics
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
            <Shield className="h-5 w-5" />
            Risk Analytics - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading risk data...</p>
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
            <Shield className="h-5 w-5" />
            Risk Analytics - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600 mb-2">Error loading risk data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!riskMetrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Analytics - {selectedStock}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No risk data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  // Use real data from the API

  // Mock risk factors (this would ideally come from a separate API call)
  const riskFactors = [
    {
      factor: "Market Risk",
      level: riskMetrics.overallRisk,
      score: riskMetrics.riskScore,
      description: "Exposure to broad market movements",
      impact: `Correlation with S&P 500: ${(riskMetrics.correlationSP500 * 100).toFixed(1)}%`,
    },
    {
      factor: "Volatility Risk",
      level: riskMetrics.volatility > 30 ? "High" : riskMetrics.volatility > 20 ? "Medium" : "Low",
      score: Math.min(10, riskMetrics.volatility / 3),
      description: "Price volatility risk",
      impact: `Current volatility: ${riskMetrics.volatility.toFixed(1)}%`,
    },
    {
      factor: "Drawdown Risk",
      level: Math.abs(riskMetrics.maxDrawdown) > 20 ? "High" : Math.abs(riskMetrics.maxDrawdown) > 10 ? "Medium" : "Low",
      score: Math.min(10, Math.abs(riskMetrics.maxDrawdown) / 2),
      description: "Maximum potential loss",
      impact: `Max drawdown: ${riskMetrics.maxDrawdown.toFixed(1)}%`,
    },
  ]

  // Mock stress tests (this would ideally come from a separate API call)
  const stressTests = [
    {
      scenario: "Market Crash (-30%)",
      impact: riskMetrics.maxDrawdown * 1.5,
      duration: "6 months",
      recovery: "12 months",
    },
    {
      scenario: "Sector Downturn (-20%)",
      impact: riskMetrics.maxDrawdown,
      duration: "3 months",
      recovery: "6 months",
    },
    {
      scenario: "Volatility Spike",
      impact: riskMetrics.maxDrawdown * 0.8,
      duration: "2 months",
      recovery: "4 months",
    },
  ]

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getRiskScore = (score: number) => {
    if (score <= 3) return "Low"
    if (score <= 7) return "Medium"
    return "High"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Analytics - {selectedStock}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Overall Risk</p>
              <p className="text-2xl font-bold mb-2">{riskMetrics.riskScore}/10</p>
              <Badge className={getRiskColor(riskMetrics.overallRisk)}>{riskMetrics.overallRisk}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Volatility</p>
              <p className="text-2xl font-bold mb-2">{riskMetrics.volatility}%</p>
              <Badge className={getRiskColor(getRiskScore(riskMetrics.volatility / 5))}>
                {getRiskScore(riskMetrics.volatility / 5)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <TrendingDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold mb-2">{riskMetrics.maxDrawdown}%</p>
              <Badge className={getRiskColor(getRiskScore(Math.abs(riskMetrics.maxDrawdown) / 2))}>
                {getRiskScore(Math.abs(riskMetrics.maxDrawdown) / 2)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-bold mb-2">{riskMetrics.sharpeRatio}</p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Good</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Factor Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{factor.factor}</h4>
                      <Badge className={getRiskColor(factor.level)} size="sm">
                        {factor.level}
                      </Badge>
                    </div>
                    <span className="font-semibold">{factor.score}/10</span>
                  </div>
                  <Progress value={factor.score * 10} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-1">{factor.description}</p>
                    <p className="text-xs">{factor.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Beta (vs S&P 500)</span>
                <span className="font-semibold">{riskMetrics.beta}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Value at Risk (1%)</span>
                <span className="font-semibold text-red-600">{riskMetrics.valueAtRisk}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expected Shortfall</span>
                <span className="font-semibold text-red-600">{riskMetrics.expectedShortfall}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Correlation (S&P 500)</span>
                <span className="font-semibold">{riskMetrics.correlationSP500}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk-Adjusted Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                <span className="font-semibold text-green-600">{riskMetrics.sharpeRatio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Information Ratio</span>
                <span className="font-semibold">1.18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sortino Ratio</span>
                <span className="font-semibold">1.67</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Calmar Ratio</span>
                <span className="font-semibold">0.89</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stress Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Historical Stress Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stressTests.map((test, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{test.scenario}</h4>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">{test.impact}%</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span>Impact Duration: </span>
                      <span className="font-medium">{test.duration}</span>
                    </div>
                    <div>
                      <span>Recovery Time: </span>
                      <span className="font-medium">{test.recovery}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Summary */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <h4 className="font-medium">Risk Assessment Summary</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              AAPL presents a <strong>medium risk</strong> profile with above-average volatility but strong
              risk-adjusted returns. The stock shows high correlation with the broader market and moderate sector
              concentration risk. Historical stress tests indicate resilience during market downturns with relatively
              quick recovery periods. Current risk metrics suggest the stock is suitable for moderate to aggressive risk
              tolerance investors.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
