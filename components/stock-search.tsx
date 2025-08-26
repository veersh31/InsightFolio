"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dataService } from "@/lib/data-service"
import type { Stock } from "@/lib/types"

interface StockSearchProps {
  onStockSelect: (symbol: string) => void
}

export function StockSearch({ onStockSelect }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const searchStocks = async () => {
      if (searchTerm.length < 1) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const searchTermUpper = searchTerm.toUpperCase()
        console.log(`[v0] Searching for symbol: ${searchTermUpper}`)

        const stockData = await dataService.getStock(searchTermUpper)
        if (stockData) {
          console.log(`[v0] Found stock data for ${searchTermUpper}: $${stockData.price}`)
          setSearchResults([stockData])
        } else {
          console.log(`[v0] No data found for ${searchTermUpper}`)
          setSearchResults([])
        }

        setShowResults(true)
      } catch (error) {
        console.error("[v0] Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchStocks, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleStockSelect = (symbol: string) => {
    onStockSelect(symbol)
    setSearchTerm("")
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Enter stock symbol (e.g., NVDA, PLTR, AAPL)..."
          className="pl-10 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 1 && setShowResults(true)}
        />
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((stock) => (
                  <Button
                    key={stock.symbol}
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto"
                    onClick={() => handleStockSelect(stock.symbol)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-40">{stock.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">${stock.price?.toFixed(2) || "N/A"}</span>
                      <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="text-xs">
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {stock.changePercent?.toFixed(2) || "0.00"}%
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm.length >= 1 ? `No data found for "${searchTerm}"` : "Enter a stock symbol to search..."}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
