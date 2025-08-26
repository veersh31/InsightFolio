"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import Head from "next/head"
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
import { PortfolioInputTab } from "@/components/portfolio-input-tab"
import { PortfolioOptimizer } from "@/components/portfolio-optimizer"
import { CorrelationMatrix } from "@/components/correlation-matrix"
import { PortfolioBacktest } from "@/components/portfolio-backtest"

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState<{ symbol: string; shares: string; avgCost: string }[]>([])
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
    <>
      <Head>
        <title>InsightFolio</title>
        <meta name="description" content="InsightFolio: AI-powered stock analytics and portfolio intelligence" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
        <DashboardHeader onStockSelect={handleStockSelect} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              Welcome back, Investor!
            </h2>
            <span className="rounded-full bg-white/80 px-4 py-2 text-base font-medium shadow border border-gray-200 flex items-center gap-2">
              <img src="/placeholder-user.jpg" alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
              <span className="hidden md:inline">Your Account</span>
            </span>
          </div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 sticky top-0 z-30 bg-white/80 border-b border-gray-200 shadow-sm rounded-xl mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Input</TabsTrigger>
            <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
            <TabsTrigger value="correlation">Correlation Matrix</TabsTrigger>
            <TabsTrigger value="backtest">Backtesting</TabsTrigger>
            <TabsTrigger value="insights">Stock Insights</TabsTrigger>
            <TabsTrigger value="predictions">ML Predictions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="risk">Risk & Sentiment</TabsTrigger>
          </TabsList>
          <TabsContent value="optimizer" className="space-y-6">
            <PortfolioOptimizer portfolio={portfolio} />
          </TabsContent>
          <TabsContent value="correlation" className="space-y-6">
            <CorrelationMatrix portfolio={portfolio} />
          </TabsContent>
          <TabsContent value="backtest" className="space-y-6">
            <PortfolioBacktest portfolio={portfolio} />
          </TabsContent>
          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioInputTab onPortfolioChange={setPortfolio} />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PortfolioOverview />
              </div>
              <div>
                <MarketOverview />
              </div>
            </div>

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
    </>
  )
}
