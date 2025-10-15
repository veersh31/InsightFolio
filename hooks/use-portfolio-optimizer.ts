import { useState } from "react"
import { portfolioOptimizer, OptimizedPortfolio } from "@/lib/portfolio-optimizer"
import { realDataService } from "@/lib/real-data-service"

export { OptimizedPortfolio }

export function usePortfolioOptimizer(portfolio: { symbol: string; shares: string; avgCost: string }[]) {
  const [result, setResult] = useState<OptimizedPortfolio | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const optimize = async (riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive' = 'Moderate') => {
    setLoading(true)
    setError(null)
    try {
      const valid = portfolio.filter(row => row.symbol && row.shares && row.avgCost)
      if (valid.length === 0) {
        throw new Error("No valid stocks in portfolio.")
      }

      // Convert portfolio to holdings format with current prices
      const holdings = await Promise.all(
        valid.map(async (row) => {
          const stock = await realDataService.getStock(row.symbol)
          if (!stock) {
            throw new Error(`Could not fetch data for ${row.symbol}`)
          }
          
          const shares = parseFloat(row.shares)
          const avgCost = parseFloat(row.avgCost)
          const marketValue = shares * stock.price
          const gainLoss = marketValue - shares * avgCost
          const gainLossPercent = (gainLoss / (shares * avgCost)) * 100
          
          return {
            symbol: row.symbol,
            name: stock.name,
            shares,
            avgCost,
            currentPrice: stock.price,
            marketValue,
            gainLoss,
            gainLossPercent
          }
        })
      )

      // Use the enhanced portfolio optimizer
      const optimizedResult = await portfolioOptimizer.optimizePortfolio(holdings, riskTolerance)
      setResult(optimizedResult)
    } catch (e: any) {
      setError(e.message)
      console.error('Portfolio optimization error:', e)
    } finally {
      setLoading(false)
    }
  }

  return { optimize, result, loading, error }
}
