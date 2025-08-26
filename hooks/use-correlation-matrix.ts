import { useState } from "react"

export interface CorrelationResult {
  matrix: number[][]
  symbols: string[]
}

// Helper: Pearson correlation
function pearson(a: number[], b: number[]) {
  const n = a.length
  const meanA = a.reduce((s, v) => s + v, 0) / n
  const meanB = b.reduce((s, v) => s + v, 0) / n
  const num = a.reduce((sum, v, i) => sum + (v - meanA) * (b[i] - meanB), 0)
  const denA = Math.sqrt(a.reduce((sum, v) => sum + (v - meanA) ** 2, 0))
  const denB = Math.sqrt(b.reduce((sum, v) => sum + (v - meanB) ** 2, 0))
  return denA && denB ? num / (denA * denB) : 0
}

export function useCorrelationMatrix(portfolio: { symbol: string }[]) {
  const [result, setResult] = useState<CorrelationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Placeholder: Simulate random correlations
  const calculate = async () => {
    setLoading(true)
    setError(null)
    try {
      const symbols = portfolio.filter(row => row.symbol).map(row => row.symbol)
      if (symbols.length < 2) throw new Error("Need at least 2 stocks.")
      // In production, fetch real price series and compute correlations
      const matrix = symbols.map(() => symbols.map(() => 0))
      for (let i = 0; i < symbols.length; i++) {
        for (let j = 0; j < symbols.length; j++) {
          matrix[i][j] = i === j ? 1 : Math.round((Math.random() * 2 - 1) * 100) / 100
        }
      }
      setResult({ matrix, symbols })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { calculate, result, loading, error }
}
