import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table } from "lucide-react"
import { useCorrelationMatrix } from "@/hooks/use-correlation-matrix"
import { PortfolioOptimizerChart } from "@/components/portfolio-optimizer-chart"
import { CorrelationMatrixHeatmap } from "@/components/correlation-matrix-heatmap"

export function CorrelationMatrix({ portfolio }: { portfolio: { symbol: string; shares: string; avgCost: string }[] }) {
  const { calculate, result, loading, error } = useCorrelationMatrix(portfolio)
  return (
    <Card className="shadow-lg border-2 border-primary/30">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Table className="h-6 w-6 text-primary" />
        <CardTitle className="text-xl">Portfolio Correlation Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-muted-foreground">
          Visualize the correlation between your portfolio assets.
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded mb-4" onClick={calculate} disabled={loading}>
          {loading ? "Calculating..." : "Calculate Correlation Matrix"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {result && result.matrix.length > 0 && result.symbols.length > 0 && (
          <CorrelationMatrixHeatmap matrix={result.matrix} symbols={result.symbols} />
        )}
      </CardContent>
    </Card>
  )
}
