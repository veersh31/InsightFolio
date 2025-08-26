
import { useState, ChangeEvent } from "react"
  // Handle CSV upload
  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      // Simple CSV parse: symbol,shares,avgCost (header row required)
      const lines = text.split(/\r?\n/).filter(Boolean)
      if (lines.length < 2) return
      const header = lines[0].split(",").map(h => h.trim().toLowerCase())
      const symbolIdx = header.indexOf("symbol")
      const sharesIdx = header.indexOf("shares")
      const avgCostIdx = header.indexOf("avgcost")
      if (symbolIdx === -1 || sharesIdx === -1 || avgCostIdx === -1) return
      const parsedRows = lines.slice(1).map(line => {
        const cols = line.split(",")
        return {
          symbol: cols[symbolIdx]?.trim() || "",
          shares: cols[sharesIdx]?.trim() || "",
          avgCost: cols[avgCostIdx]?.trim() || "",
        }
      })
      setRows(parsedRows)
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolioInputRows', JSON.stringify(parsedRows))
      }
      onPortfolioChange?.(parsedRows)
    }
    reader.readAsText(file)
  }

type PortfolioRow = { symbol: string; shares: string; avgCost: string }
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, PlusCircle, BarChart2 } from "lucide-react"

export function PortfolioInputTab({ onPortfolioChange }: { onPortfolioChange?: (portfolio: any) => void }) {
  // Handle CSV upload
  const handleCSVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      // Simple CSV parse: symbol,shares,avgCost (header row required)
      const lines = text.split(/\r?\n/).filter(Boolean)
      if (lines.length < 2) return
      const header = lines[0].split(",").map(h => h.trim().toLowerCase())
      const symbolIdx = header.indexOf("symbol")
      const sharesIdx = header.indexOf("shares")
      const avgCostIdx = header.indexOf("avgcost")
      if (symbolIdx === -1 || sharesIdx === -1 || avgCostIdx === -1) return
      const parsedRows = lines.slice(1).map(line => {
        const cols = line.split(",")
        return {
          symbol: cols[symbolIdx]?.trim() || "",
          shares: cols[sharesIdx]?.trim() || "",
          avgCost: cols[avgCostIdx]?.trim() || "",
        }
      })
      setRows(parsedRows)
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolioInputRows', JSON.stringify(parsedRows))
      }
      onPortfolioChange?.(parsedRows)
    }
    reader.readAsText(file)
  }
  // Load from localStorage if available
  const getInitialRows = (): PortfolioRow[] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioInputRows')
      if (saved) {
        try {
          return JSON.parse(saved) as PortfolioRow[]
        } catch {
          return [{ symbol: "", shares: "", avgCost: "" }]
        }
      }
    }
    return [{ symbol: "", shares: "", avgCost: "" }]
  }
  const [rows, setRows] = useState<PortfolioRow[]>(getInitialRows)

  const handleChange = (idx: number, field: string, value: string) => {
    const updated = rows.map((row: PortfolioRow, i: number) =>
      i === idx ? { ...row, [field]: value } : row
    )
    setRows(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioInputRows', JSON.stringify(updated))
    }
    onPortfolioChange?.(updated)
  }

  const handleAddRow = () => {
    const updated = [...rows, { symbol: "", shares: "", avgCost: "" }]
    setRows(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioInputRows', JSON.stringify(updated))
    }
    onPortfolioChange?.(updated)
  }

  const handleRemoveRow = (idx: number) => {
    const updated = rows.filter((_: PortfolioRow, i: number) => i !== idx)
    setRows(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioInputRows', JSON.stringify(updated))
    }
    onPortfolioChange?.(updated)
  }

  // Portfolio summary
  const totalValue = rows.reduce((sum: number, row: PortfolioRow) => {
    const shares = parseFloat(row.shares)
    const avgCost = parseFloat(row.avgCost)
    if (!isNaN(shares) && !isNaN(avgCost)) {
      return sum + shares * avgCost
    }
    return sum
  }, 0)
  const totalStocks = rows.filter((row: PortfolioRow) => row.symbol && row.shares && row.avgCost).length

  return (
    <Card className="shadow-lg border-2 border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart2 className="h-6 w-6 text-primary" />
            Your Portfolio
          </CardTitle>
          <label className="ml-2 inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-primary">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            <span className="bg-primary/10 border border-primary/20 rounded px-2 py-1 hover:bg-primary/20 transition">Upload CSV</span>
          </label>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddRow} className="gap-1">
          <PlusCircle className="h-4 w-4" /> Add Row
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border bg-muted/40">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/60">
                <th className="p-2 text-left">Symbol</th>
                <th className="p-2 text-left">Shares</th>
                <th className="p-2 text-left">Avg Cost</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: PortfolioRow, idx: number) => (
                <tr key={idx} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="p-2">
                    <Input
                      value={row.symbol}
                      onChange={e => handleChange(idx, "symbol", e.target.value.toUpperCase())}
                      placeholder="AAPL"
                      className="w-24 font-mono"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={row.shares}
                      onChange={e => handleChange(idx, "shares", e.target.value)}
                      type="number"
                      min="0"
                      className="w-20"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={row.avgCost}
                      onChange={e => handleChange(idx, "avgCost", e.target.value)}
                      type="number"
                      min="0"
                      className="w-24"
                    />
                  </td>
                  <td className="p-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveRow(idx)} disabled={rows.length === 1}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Total Portfolio Value</span>
            <span className="font-bold text-2xl text-primary">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">Total Stocks</span>
            <span className="font-bold text-lg">{totalStocks}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
