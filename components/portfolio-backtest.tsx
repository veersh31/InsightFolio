import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History } from "lucide-react"
import { useState } from "react"
import { usePortfolioBacktest } from "@/hooks/use-portfolio-backtest"
import { BacktestChart } from "./backtest-chart"

export function PortfolioBacktest({ portfolio }: { portfolio: { symbol: string; shares: string; avgCost: string }[] }) {
  const [startDate, setStartDate] = useState<string>("2022-01-01")
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [run, setRun] = useState(false)
  
  // Only run backtest when run is true
  const { result, loading, error } = usePortfolioBacktest(
    run ? portfolio : [], 
    run ? startDate : "", 
    run ? endDate : ""
  )

  return (
    <Card className="shadow-lg border-2 border-primary/30">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <History className="h-6 w-6 text-primary" />
        <CardTitle className="text-xl">Portfolio Backtesting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-muted-foreground">
          Test your portfolio strategies on historical data and see simulated results.
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          <div>
            <label className="block text-xs mb-1">Start Date</label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} max={endDate} />
          </div>
          <div>
            <label className="block text-xs mb-1">End Date</label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} max={new Date().toISOString().slice(0, 10)} />
          </div>
          <Button onClick={() => setRun(r => !r)} disabled={loading || !portfolio.length} className="mt-4 md:mt-6">
            {loading ? "Running..." : "Run Backtest"}
          </Button>
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-2">
            <strong>Error:</strong> {error}
            <br />
            <span className="text-xs text-muted-foreground">Check the browser console for more details if available.</span>
          </div>
        )}
        {result && (
          <>
            <div className="mb-2 text-sm">
              <strong>Total Return:</strong> {(result.totalReturn * 100).toFixed(2)}% &nbsp;|
              <strong> Annualized:</strong> {(result.annualizedReturn * 100).toFixed(2)}% &nbsp;|
              <strong> Max Drawdown:</strong> {(result.maxDrawdown * 100).toFixed(2)}%
            </div>
            <BacktestChart dates={result.dates} values={result.portfolioValues} />
          </>
        )}
        {!result && !loading && <div className="text-center text-muted-foreground">Run a backtest to see results.</div>}
      </CardContent>
    </Card>
  )
}
