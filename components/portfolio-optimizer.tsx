import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Shield, AlertTriangle, Target, ArrowUpDown } from "lucide-react"
import { usePortfolioOptimizer } from "@/hooks/use-portfolio-optimizer"
import { PortfolioOptimizerChart } from "@/components/portfolio-optimizer-chart"
import { useState } from "react"

export function PortfolioOptimizer({ portfolio }: { portfolio: { symbol: string; shares: string; avgCost: string }[] }) {
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate')
  const { optimize, result, loading, error } = usePortfolioOptimizer(portfolio)
  
  const handleOptimize = () => {
    optimize(riskTolerance)
  }

  const getRiskToleranceColor = (tolerance: string) => {
    switch (tolerance) {
      case 'Conservative': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Aggressive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getRiskToleranceIcon = (tolerance: string) => {
    switch (tolerance) {
      case 'Conservative': return <Shield className="h-4 w-4" />
      case 'Moderate': return <Target className="h-4 w-4" />
      case 'Aggressive': return <TrendingUp className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  return (
    <Card className="shadow-lg border-2 border-primary/30">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <CardTitle className="text-xl">AI Portfolio Optimizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-muted-foreground">
          Industry-standard portfolio optimization using Modern Portfolio Theory, Minimum Variance, and Maximum Sharpe Ratio algorithms.
        </div>
        
        {/* Risk Tolerance Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
          <Select value={riskTolerance} onValueChange={(value: 'Conservative' | 'Moderate' | 'Aggressive') => setRiskTolerance(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Conservative">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Conservative - Minimum Variance</span>
                </div>
              </SelectItem>
              <SelectItem value="Moderate">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Moderate - Mean-Variance</span>
                </div>
              </SelectItem>
              <SelectItem value="Aggressive">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Aggressive - Maximum Sharpe</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="default" onClick={handleOptimize} disabled={loading} className="w-full">
          {loading ? "Optimizing..." : "Optimize Portfolio"}
        </Button>
        
        {error && <div className="text-red-500 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}
        
        {result && (
          <div className="mt-6 space-y-6">
            {/* Portfolio Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground mb-1">Expected Return</p>
                  <p className="text-xl font-bold text-green-600">{(result.expectedReturn * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 text-center">
                  <TrendingDown className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <p className="text-sm text-muted-foreground mb-1">Expected Risk</p>
                  <p className="text-xl font-bold text-red-600">{(result.expectedRisk * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
                  <p className="text-xl font-bold text-blue-600">{result.sharpeRatio.toFixed(2)}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4 text-center">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
                  <p className="text-xl font-bold text-orange-600">{(result.maxDrawdown * 100).toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">VaR (95%)</span>
                    <span className="font-semibold">{(result.var95 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Concentration</span>
                    <span className="font-semibold">{(result.concentrationRisk * 100).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Diversification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Diversification Ratio</span>
                    <span className="font-semibold">{result.diversificationRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risk Tolerance</span>
                    <Badge className={getRiskToleranceColor(riskTolerance)}>
                      {getRiskToleranceIcon(riskTolerance)}
                      <span className="ml-1">{riskTolerance}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Optimization Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {riskTolerance === 'Conservative' && 'Minimum variance optimization for capital preservation'}
                    {riskTolerance === 'Moderate' && 'Mean-variance optimization for balanced risk-return'}
                    {riskTolerance === 'Aggressive' && 'Maximum Sharpe ratio optimization for growth'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Chart */}
            <PortfolioOptimizerChart weights={result.weights} />
            
            {/* Suggested Weights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(result.weights)
                    .sort(([,a], [,b]) => b - a)
                    .map(([symbol, weight]) => (
                    <div key={symbol} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="font-medium">{symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(weight * 100).toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">
                          {weight > 0.3 ? 'High' : weight > 0.1 ? 'Medium' : 'Low'} allocation
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rebalancing Recommendations */}
            {result.rebalancingRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5" />
                    Rebalancing Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.rebalancingRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{rec.symbol}</span>
                            <Badge variant={rec.action === 'BUY' ? 'default' : 'destructive'}>
                              {rec.action}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${rec.amount.toFixed(0)}</div>
                          <div className="text-sm text-muted-foreground">
                            {rec.currentWeight.toFixed(1)}% → {rec.targetWeight.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
