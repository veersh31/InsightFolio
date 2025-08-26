import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, TrendingDown, BarChart3, Target, Zap } from "lucide-react"

export function RiskAnalytics() {
  const riskMetrics = {
    overallRisk: "Medium",
    riskScore: 6.2,
    volatility: 28.5,
    beta: 1.34,
    maxDrawdown: -12.7,
    sharpeRatio: 1.42,
    valueAtRisk: -4.2,
    expectedShortfall: -6.8,
    correlationSP500: 0.78,
    liquidityRisk: "Low",
  }

  const riskFactors = [
    {
      factor: "Market Risk",
      level: "Medium",
      score: 6.5,
      description: "Exposure to broad market movements",
      impact: "High correlation with S&P 500",
    },
    {
      factor: "Sector Risk",
      level: "Medium",
      score: 5.8,
      description: "Technology sector concentration",
      impact: "Dependent on tech sector performance",
    },
    {
      factor: "Company Risk",
      level: "Low",
      score: 3.2,
      description: "Company-specific factors",
      impact: "Strong fundamentals, diversified revenue",
    },
    {
      factor: "Liquidity Risk",
      level: "Low",
      score: 2.1,
      description: "Ability to trade without price impact",
      impact: "High trading volume, tight spreads",
    },
    {
      factor: "Currency Risk",
      level: "Medium",
      score: 6.0,
      description: "Foreign exchange exposure",
      impact: "Significant international revenue",
    },
  ]

  const stressTests = [
    {
      scenario: "2008 Financial Crisis",
      impact: -45.2,
      duration: "18 months",
      recovery: "24 months",
    },
    {
      scenario: "COVID-19 Pandemic",
      impact: -23.1,
      duration: "3 months",
      recovery: "6 months",
    },
    {
      scenario: "Tech Bubble Burst",
      impact: -52.8,
      duration: "24 months",
      recovery: "36 months",
    },
    {
      scenario: "Interest Rate Shock",
      impact: -18.5,
      duration: "6 months",
      recovery: "12 months",
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
          Risk Analytics - AAPL
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
