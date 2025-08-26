import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, TrendingDown, Target, AlertTriangle, BarChart3, Zap } from "lucide-react"

interface PredictionDetailsProps {
  symbol: string
}

export function MLPredictionDetails({ symbol }: PredictionDetailsProps) {
  const modelPerformance = {
    accuracy: 73.5,
    precision: 71.2,
    recall: 68.9,
    f1Score: 70.0,
    backtestPeriod: "12 months",
    totalPredictions: 2847,
    correctPredictions: 2092,
  }

  const scenarioAnalysis = [
    {
      scenario: "Market Crash (-20%)",
      impact: -15.2,
      probability: 0.15,
      description: "Broad market decline scenario",
    },
    {
      scenario: "Interest Rate Hike (+0.5%)",
      impact: -8.7,
      probability: 0.35,
      description: "Federal Reserve policy change",
    },
    {
      scenario: "Earnings Beat (+10%)",
      impact: 12.4,
      probability: 0.45,
      description: "Company exceeds earnings expectations",
    },
    {
      scenario: "Sector Rotation",
      impact: -3.2,
      probability: 0.25,
      description: "Capital flows to other sectors",
    },
  ]

  const featureImportance = [
    { feature: "Price Momentum", importance: 0.24, description: "Recent price trend analysis" },
    { feature: "Volume Pattern", importance: 0.19, description: "Trading volume characteristics" },
    { feature: "Market Sentiment", importance: 0.16, description: "News and social media sentiment" },
    { feature: "Technical Indicators", importance: 0.15, description: "RSI, MACD, Moving Averages" },
    { feature: "Earnings Trend", importance: 0.12, description: "Historical earnings performance" },
    { feature: "Sector Performance", importance: 0.09, description: "Relative sector strength" },
    { feature: "Volatility Index", importance: 0.05, description: "Market volatility measures" },
  ]

  const riskMetrics = {
    volatility: 28.5,
    beta: 1.34,
    maxDrawdown: -12.7,
    sharpeRatio: 1.42,
    valueAtRisk: -4.2,
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Advanced ML Analysis - {symbol}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="explainability">Explainability</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Price Targets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bull Case</span>
                    <span className="font-semibold text-green-600">$195.40</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Base Case</span>
                    <span className="font-semibold">$182.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bear Case</span>
                    <span className="font-semibold text-red-600">$168.20</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volatility</span>
                    <Badge variant="outline">{riskMetrics.volatility}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Beta</span>
                    <Badge variant="outline">{riskMetrics.beta}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Max Drawdown</span>
                    <Badge variant="destructive">{riskMetrics.maxDrawdown}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                    <Badge variant="secondary">{riskMetrics.sharpeRatio}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4" />
                <h3 className="font-semibold">Scenario Impact Analysis</h3>
              </div>
              {scenarioAnalysis.map((scenario, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{scenario.scenario}</h4>
                      <div className="flex items-center gap-2">
                        {scenario.impact > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${scenario.impact > 0 ? "text-green-500" : "text-red-500"}`}>
                          {scenario.impact > 0 ? "+" : ""}
                          {scenario.impact}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Probability:</span>
                      <Progress value={scenario.probability * 100} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{Math.round(scenario.probability * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explainability" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4" />
                <h3 className="font-semibold">Feature Importance</h3>
              </div>
              {featureImportance.map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{feature.feature}</span>
                    <span className="text-sm font-semibold">{Math.round(feature.importance * 100)}%</span>
                  </div>
                  <Progress value={feature.importance * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <Card className="mt-6">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <h4 className="font-medium">Model Interpretation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  The current BUY signal is primarily driven by strong price momentum (24% influence) and positive
                  volume patterns (19% influence). Market sentiment analysis shows bullish indicators, while technical
                  indicators support the upward trend. The model confidence is high due to consistent earnings growth
                  and favorable sector performance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Model Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <div className="flex items-center gap-2">
                      <Progress value={modelPerformance.accuracy} className="w-16 h-2" />
                      <span className="font-semibold">{modelPerformance.accuracy}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precision</span>
                    <div className="flex items-center gap-2">
                      <Progress value={modelPerformance.precision} className="w-16 h-2" />
                      <span className="font-semibold">{modelPerformance.precision}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Recall</span>
                    <div className="flex items-center gap-2">
                      <Progress value={modelPerformance.recall} className="w-16 h-2" />
                      <span className="font-semibold">{modelPerformance.recall}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">F1 Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={modelPerformance.f1Score} className="w-16 h-2" />
                      <span className="font-semibold">{modelPerformance.f1Score}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Backtesting Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Test Period</span>
                    <span className="font-semibold">{modelPerformance.backtestPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Predictions</span>
                    <span className="font-semibold">{modelPerformance.totalPredictions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Correct Predictions</span>
                    <span className="font-semibold text-green-600">
                      {modelPerformance.correctPredictions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {Math.round((modelPerformance.correctPredictions / modelPerformance.totalPredictions) * 100)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Disclaimer</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  These predictions are probabilistic estimates based on historical data and machine learning models.
                  Past performance does not guarantee future results. All investments carry risk, and you should conduct
                  your own research before making investment decisions. Model performance metrics are based on
                  backtesting and may not reflect future performance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
