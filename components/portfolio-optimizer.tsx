import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { usePortfolioOptimizer } from "@/hooks/use-portfolio-optimizer"
import { PortfolioOptimizerChart } from "@/components/portfolio-optimizer-chart"

export function PortfolioOptimizer({ portfolio }: { portfolio: { symbol: string; shares: string; avgCost: string }[] }) {
  const { optimize, result, loading, error } = usePortfolioOptimizer(portfolio)
  return (
    <Card className="shadow-lg border-2 border-primary/30">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <CardTitle className="text-xl">AI Portfolio Optimizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-muted-foreground">
          Get AI-driven suggestions to optimize your portfolio for risk and return.
        </div>
        <Button variant="default" onClick={optimize} disabled={loading}>
          {loading ? "Optimizing..." : "Optimize Portfolio"}
        </Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {result && (
          <div className="mt-4">
            <PortfolioOptimizerChart weights={result.weights} />
            <div className="font-semibold mb-2">Suggested Weights:</div>
            <ul className="mb-2">
              {Object.entries(result.weights).map(([symbol, weight]) => (
                <li key={symbol}>{symbol}: {(weight * 100).toFixed(1)}%</li>
              ))}
            </ul>
            <div>Expected Return: <span className="font-semibold">{(result.expectedReturn * 100).toFixed(2)}%</span></div>
            <div>Expected Risk: <span className="font-semibold">{(result.expectedRisk * 100).toFixed(2)}%</span></div>
            <div>Sharpe Ratio: <span className="font-semibold">{result.sharpeRatio.toFixed(2)}</span></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
