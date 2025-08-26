"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { MarketOverview } from "@/components/market-overview"
import { Watchlist } from "@/components/watchlist"
import { MLPredictions } from "@/components/ml-predictions"
import { TechnicalIndicators } from "@/components/technical-indicators"
import { PredictionConfidenceChart } from "@/components/prediction-confidence-chart"
import { FundamentalAnalysis } from "@/components/fundamental-analysis"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { RiskAnalytics } from "@/components/risk-analytics"
import { StockInsights } from "@/components/stock-insights"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const watchlistRef = useRef<any>(null)

  const handleStockSelect = (symbol: string) => {
    console.log("[v0] Selected stock for analysis:", symbol)
    setSelectedStock(symbol)
  }

  const handleAddToWatchlist = async (symbol: string) => {
    if (watchlistRef.current?.addStockToWatchlist) {
      await watchlistRef.current.addStockToWatchlist(symbol)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onStockSelect={handleStockSelect} />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Stock Insights</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="risk">Risk & Sentiment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Row - Key Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PortfolioOverview />
              </div>
              <div>
                <MarketOverview />
              </div>
            </div>

            {/* Middle Row - Predictions and Watchlist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MLPredictions selectedStock={selectedStock} />
              <Watchlist ref={watchlistRef} onSelectStock={handleStockSelect} />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {selectedStock ? (
              <StockInsights symbol={selectedStock} onAddToWatchlist={handleAddToWatchlist} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Search and select a stock to view detailed insights, moving averages, and technical analysis.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Use the search bar in the header to find stocks by symbol or company name.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <MLPredictions selectedStock={selectedStock} />
              <PredictionConfidenceChart />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FundamentalAnalysis />
              <TechnicalIndicators />
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <SentimentAnalysis />
              <RiskAnalytics />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
