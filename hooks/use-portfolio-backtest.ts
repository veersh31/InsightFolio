import { useState, useEffect } from "react"
import { PortfolioHolding } from "@/lib/types"
import { getHistoricalPrices } from "@/lib/real-data-service"

export interface BacktestResult {
  dates: string[]
  portfolioValues: number[]
  returns: number[]
  totalReturn: number
  annualizedReturn: number
  maxDrawdown: number
}

export function usePortfolioBacktest(portfolio: { symbol: string; shares: string; avgCost: string }[], startDate: string, endDate: string) {
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!portfolio.length) return
    setLoading(true)
    setError(null)

    async function runBacktest() {
      try {
        // Fetch historical prices for each symbol
        const allPrices = await Promise.all(
          portfolio.map(async (holding) => {
            try {
              const prices = await getHistoricalPrices(holding.symbol, startDate, endDate)
              return { symbol: holding.symbol, prices }
            } catch (err: any) {
              return { symbol: holding.symbol, prices: [], error: err?.message || String(err) }
            }
          })
        )
        // Check for errors or empty data
        const anyError = allPrices.find((p) => p.error)
        if (anyError) {
          setError(`Error fetching data for ${anyError.symbol}: ${anyError.error}`)
          setResult(null)
          setLoading(false)
          return
        }
        
        // Check if we have any valid price data
        const validPrices = allPrices.filter(p => p.prices && p.prices.length > 0)
        if (validPrices.length === 0) {
          setError("No historical price data found for the selected date range. Please try a different date range or check if the stocks are valid.")
          setResult(null)
          setLoading(false)
          return
        }
        
        // If some stocks have data but others don't, continue with available data
        const stocksWithData = validPrices.map(p => p.symbol)
        const stocksWithoutData = portfolio.filter(p => !stocksWithData.includes(p.symbol))
        
        if (stocksWithoutData.length > 0) {
          console.warn(`No data available for: ${stocksWithoutData.map(s => s.symbol).join(', ')}. Continuing with available data.`)
        }
        // Use the first stock with data as reference for dates
        const referencePrices = validPrices[0]
        const dates = referencePrices.prices.map((p: any) => p.date)
        const portfolioValues: number[] = []
        
        for (let i = 0; i < dates.length; i++) {
          let value = 0
          for (const holding of portfolio) {
            // Only include stocks that have data
            if (stocksWithData.includes(holding.symbol)) {
              const symbolPrices = allPrices.find((p) => p.symbol === holding.symbol)?.prices
              if (symbolPrices && symbolPrices[i]) {
                value += parseFloat(holding.shares) * symbolPrices[i].close
              }
            }
          }
          portfolioValues.push(value)
        }
        // Calculate returns
        const returns = portfolioValues.map((v, i) =>
          i === 0 ? 0 : (v - portfolioValues[i - 1]) / portfolioValues[i - 1]
        )
        const totalReturn = (portfolioValues[portfolioValues.length - 1] - portfolioValues[0]) / portfolioValues[0]
        const years = (new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / (365 * 24 * 60 * 60 * 1000)
        const annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1
        // Max drawdown
        let peak = portfolioValues[0]
        let maxDrawdown = 0
        for (const v of portfolioValues) {
          if (v > peak) peak = v
          const drawdown = (peak - v) / peak
          if (drawdown > maxDrawdown) maxDrawdown = drawdown
        }
        setResult({ dates, portfolioValues, returns, totalReturn, annualizedReturn, maxDrawdown })
      } catch (err: any) {
        setError(err?.message || "Failed to run backtest")
        setResult(null)
      } finally {
        setLoading(false)
      }
    }
    runBacktest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(portfolio), startDate, endDate])

  return { result, loading, error }
}
