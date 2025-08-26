"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Plus, TrendingUp, TrendingDown, X, Search } from "lucide-react"
import { dataService } from "@/lib/data-service"
import type { Stock } from "@/lib/types"

interface WatchlistProps {
  onSelectStock?: (symbol: string) => void
}

export const Watchlist = forwardRef<any, WatchlistProps>(({ onSelectStock }, ref) => {
  const [watchlistStocks, setWatchlistStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchSymbol, setSearchSymbol] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const loadWatchlist = async () => {
      setLoading(true)
      try {
        // Load default watchlist symbols
        const symbols = ["AAPL", "GOOGL", "TSLA", "MSFT", "NVDA", "META"]
        const stockPromises = symbols.map((symbol) => dataService.getStock(symbol))
        const stocks = await Promise.all(stockPromises)
        const validStocks = stocks.filter((stock) => stock !== null) as Stock[]
        setWatchlistStocks(validStocks)
      } catch (error) {
        console.error("Error loading watchlist:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWatchlist()
  }, [])

  const addToWatchlist = async () => {
    if (!searchSymbol.trim()) return

    setSearchLoading(true)
    try {
      const stock = await dataService.getStock(searchSymbol.toUpperCase())
      if (stock && !watchlistStocks.find((s) => s.symbol === stock.symbol)) {
        setWatchlistStocks((prev) => [...prev, stock])
        setSearchSymbol("")
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error adding stock to watchlist:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const addStockToWatchlist = async (symbol: string) => {
    try {
      const stock = await dataService.getStock(symbol)
      if (stock && !watchlistStocks.find((s) => s.symbol === stock.symbol)) {
        setWatchlistStocks((prev) => [...prev, stock])
      }
    } catch (error) {
      console.error("Error adding stock to watchlist:", error)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).addToWatchlist = addStockToWatchlist
    }
  }, [])

  useImperativeHandle(ref, () => ({
    addStockToWatchlist,
  }))

  const getPredictionColor = (change: number) => {
    if (change > 2) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (change < -2) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  }

  const getPredictionSignal = (change: number) => {
    if (change > 2) return "BUY"
    if (change < -2) return "SELL"
    return "HOLD"
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlistStocks((prev) => prev.filter((stock) => stock.symbol !== symbol))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Watchlist
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stock to Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter stock symbol (e.g., AAPL)"
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addToWatchlist()}
                  />
                  <Button onClick={addToWatchlist} disabled={searchLoading}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlistStocks.map((stock) => {
            const prediction = getPredictionSignal(stock.changePercent || 0)
            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelectStock?.(stock.symbol)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{stock.symbol}</p>
                    <Badge className={getPredictionColor(stock.changePercent || 0)}>{prediction}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold">${stock.price?.toFixed(2) || "0.00"}</p>
                    <div className="flex items-center gap-1">
                      {(stock.change || 0) > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-sm ${(stock.change || 0) > 0 ? "text-green-500" : "text-red-500"}`}>
                        {(stock.change || 0) > 0 ? "+" : ""}
                        {stock.change?.toFixed(2) || "0.00"} ({(stock.changePercent || 0) > 0 ? "+" : ""}
                        {stock.changePercent?.toFixed(2) || "0.00"}%)
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromWatchlist(stock.symbol)
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
})

Watchlist.displayName = "Watchlist"
