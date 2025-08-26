import { useState } from "react"

export interface OptimizedPortfolio {
  weights: { [symbol: string]: number }
  expectedReturn: number
  expectedRisk: number
  sharpeRatio: number
}

export function usePortfolioOptimizer(portfolio: { symbol: string; shares: string; avgCost: string }[]) {
  const [result, setResult] = useState<OptimizedPortfolio | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Placeholder: In production, call a backend or Python service for real optimization
  const optimize = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fake logic: equal weights, random stats
      const valid = portfolio.filter(row => row.symbol && row.shares && row.avgCost)
      const n = valid.length
      if (n === 0) throw new Error("No valid stocks in portfolio.")
      const weights: { [symbol: string]: number } = {}
      valid.forEach(row => { weights[row.symbol] = 1 / n })
      setResult({
        weights,
        expectedReturn: 0.08 + Math.random() * 0.04,
        expectedRisk: 0.12 + Math.random() * 0.05,
        sharpeRatio: 0.7 + Math.random() * 0.5,
      })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { optimize, result, loading, error }
}
