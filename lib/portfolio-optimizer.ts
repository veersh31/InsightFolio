import { PortfolioHolding } from "./types"

export interface OptimizedPortfolio {
  weights: { [symbol: string]: number }
  expectedReturn: number
  expectedRisk: number
  sharpeRatio: number
  maxDrawdown: number
  var95: number
  diversificationRatio: number
  concentrationRisk: number
  rebalancingRecommendations: RebalancingRecommendation[]
}

export interface RebalancingRecommendation {
  symbol: string
  currentWeight: number
  targetWeight: number
  action: 'BUY' | 'SELL' | 'HOLD'
  amount: number
  reason: string
}

export interface StockMetrics {
  symbol: string
  expectedReturn: number
  volatility: number
  beta: number
  sharpe: number
  correlationMatrix: { [symbol: string]: number }
}

export class PortfolioOptimizer {
  private readonly RISK_FREE_RATE = 0.02 // 2% annual risk-free rate
  
  // Industry-standard optimization algorithms
  async optimizePortfolio(
    holdings: PortfolioHolding[],
    riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive' = 'Moderate',
    targetReturn?: number
  ): Promise<OptimizedPortfolio> {
    if (holdings.length === 0) {
      throw new Error('No holdings provided for optimization')
    }

    // Calculate stock metrics
    const stockMetrics = await this.calculateStockMetrics(holdings)
    
    // Calculate correlation matrix
    const correlationMatrix = this.calculateCorrelationMatrix(stockMetrics)
    
    // Apply different optimization strategies based on risk tolerance
    let weights: { [symbol: string]: number }
    
    switch (riskTolerance) {
      case 'Conservative':
        weights = this.minimumVarianceOptimization(stockMetrics, correlationMatrix)
        break
      case 'Aggressive':
        weights = this.maximumSharpeOptimization(stockMetrics, correlationMatrix, targetReturn)
        break
      default: // Moderate
        weights = this.meanVarianceOptimization(stockMetrics, correlationMatrix, targetReturn)
        break
    }
    
    // Calculate portfolio metrics
    const portfolioMetrics = this.calculatePortfolioMetrics(weights, stockMetrics, correlationMatrix)
    
    // Generate rebalancing recommendations
    const rebalancingRecommendations = this.generateRebalancingRecommendations(
      holdings, weights, stockMetrics
    )
    
    return {
      weights,
      expectedReturn: portfolioMetrics.expectedReturn,
      expectedRisk: portfolioMetrics.volatility,
      sharpeRatio: portfolioMetrics.sharpeRatio,
      maxDrawdown: portfolioMetrics.maxDrawdown,
      var95: portfolioMetrics.var95,
      diversificationRatio: portfolioMetrics.diversificationRatio,
      concentrationRisk: portfolioMetrics.concentrationRisk,
      rebalancingRecommendations
    }
  }

  private async calculateStockMetrics(holdings: PortfolioHolding[]): Promise<StockMetrics[]> {
    const metrics: StockMetrics[] = []
    
    for (const holding of holdings) {
      // Calculate expected return based on historical performance and current metrics
      const expectedReturn = this.calculateExpectedReturn(holding)
      
      // Calculate volatility based on price movements
      const volatility = this.calculateVolatility(holding)
      
      // Estimate beta (market sensitivity)
      const beta = this.estimateBeta(holding)
      
      // Calculate Sharpe ratio
      const sharpe = (expectedReturn - this.RISK_FREE_RATE) / volatility
      
      // Initialize correlation matrix (simplified - in production, use historical data)
      const correlationMatrix: { [symbol: string]: number } = {}
      for (const otherHolding of holdings) {
        if (otherHolding.symbol !== holding.symbol) {
          correlationMatrix[otherHolding.symbol] = this.estimateCorrelation(holding, otherHolding)
        }
      }
      
      metrics.push({
        symbol: holding.symbol,
        expectedReturn,
        volatility,
        beta,
        sharpe,
        correlationMatrix
      })
    }
    
    return metrics
  }

  private calculateExpectedReturn(holding: PortfolioHolding): number {
    // Multi-factor model for expected return
    const currentReturn = holding.gainLossPercent / 100
    const marketCapFactor = this.getMarketCapFactor(holding.symbol)
    const sectorFactor = this.getSectorFactor(holding.symbol)
    
    // Industry-standard expected return calculation
    const baseReturn = 0.08 // 8% market average
    const adjustedReturn = baseReturn + (currentReturn * 0.3) + marketCapFactor + sectorFactor
    
    return Math.max(0.02, Math.min(0.25, adjustedReturn)) // Bound between 2% and 25%
  }

  private calculateVolatility(holding: PortfolioHolding): number {
    // Estimate volatility based on gain/loss percentage and market cap
    const priceVolatility = Math.abs(holding.gainLossPercent) / 100 * 2
    const marketCapFactor = this.getMarketCapFactor(holding.symbol)
    
    // Higher volatility for smaller companies
    const sizeAdjustment = marketCapFactor < -0.02 ? 0.05 : 0.02
    
    return Math.max(0.1, Math.min(0.5, priceVolatility + sizeAdjustment))
  }

  private estimateBeta(holding: PortfolioHolding): number {
    // Estimate beta based on volatility and market cap
    const volatility = this.calculateVolatility(holding)
    const marketCapFactor = this.getMarketCapFactor(holding.symbol)
    
    // Higher beta for more volatile and smaller companies
    return Math.max(0.3, Math.min(2.0, volatility * 2 + marketCapFactor * 10))
  }

  private estimateCorrelation(holding1: PortfolioHolding, holding2: PortfolioHolding): number {
    // Simplified correlation estimation based on sector and market cap similarity
    const sector1 = this.getSector(holding1.symbol)
    const sector2 = this.getSector(holding2.symbol)
    const cap1 = this.getMarketCapFactor(holding1.symbol)
    const cap2 = this.getMarketCapFactor(holding2.symbol)
    
    let correlation = 0.3 // Base correlation
    
    // Same sector = higher correlation
    if (sector1 === sector2) {
      correlation += 0.4
    }
    
    // Similar market cap = moderate correlation
    if (Math.abs(cap1 - cap2) < 0.01) {
      correlation += 0.2
    }
    
    // Tech stocks tend to be more correlated
    if (sector1 === 'Technology' && sector2 === 'Technology') {
      correlation += 0.1
    }
    
    return Math.max(0.1, Math.min(0.9, correlation))
  }

  private calculateCorrelationMatrix(stockMetrics: StockMetrics[]): { [symbol: string]: { [symbol: string]: number } } {
    const matrix: { [symbol: string]: { [symbol: string]: number } } = {}
    
    for (const stock1 of stockMetrics) {
      matrix[stock1.symbol] = {}
      for (const stock2 of stockMetrics) {
        if (stock1.symbol === stock2.symbol) {
          matrix[stock1.symbol][stock2.symbol] = 1.0
        } else {
          matrix[stock1.symbol][stock2.symbol] = stock1.correlationMatrix[stock2.symbol] || 0.3
        }
      }
    }
    
    return matrix
  }

  // Minimum Variance Portfolio (Conservative)
  private minimumVarianceOptimization(
    stockMetrics: StockMetrics[],
    correlationMatrix: { [symbol: string]: { [symbol: string]: number } }
  ): { [symbol: string]: number } {
    const n = stockMetrics.length
    
    // Simplified minimum variance optimization
    // In production, use quadratic programming solver
    const weights: { [symbol: string]: number } = {}
    
    // Calculate inverse volatility weights
    let totalInverseVol = 0
    for (const stock of stockMetrics) {
      totalInverseVol += 1 / stock.volatility
    }
    
    for (const stock of stockMetrics) {
      weights[stock.symbol] = (1 / stock.volatility) / totalInverseVol
    }
    
    return weights
  }

  // Mean-Variance Optimization (Moderate)
  private meanVarianceOptimization(
    stockMetrics: StockMetrics[],
    correlationMatrix: { [symbol: string]: { [symbol: string]: number } },
    targetReturn?: number
  ): { [symbol: string]: number } {
    // Simplified mean-variance optimization using Sharpe ratio ranking
    const weights: { [symbol: string]: number } = {}
    
    // Sort by Sharpe ratio
    const sortedStocks = [...stockMetrics].sort((a, b) => b.sharpe - a.sharpe)
    
    // Allocate more weight to higher Sharpe ratio stocks
    let totalWeight = 0
    for (let i = 0; i < sortedStocks.length; i++) {
      const weight = Math.pow(0.7, i) // Exponential decay
      weights[sortedStocks[i].symbol] = weight
      totalWeight += weight
    }
    
    // Normalize weights
    for (const symbol in weights) {
      weights[symbol] /= totalWeight
    }
    
    return weights
  }

  // Maximum Sharpe Ratio Optimization (Aggressive)
  private maximumSharpeOptimization(
    stockMetrics: StockMetrics[],
    correlationMatrix: { [symbol: string]: { [symbol: string]: number } },
    targetReturn?: number
  ): { [symbol: string]: number } {
    // Focus on highest Sharpe ratio stocks
    const weights: { [symbol: string]: number } = {}
    
    // Filter stocks with positive Sharpe ratios
    const goodStocks = stockMetrics.filter(stock => stock.sharpe > 0)
    
    if (goodStocks.length === 0) {
      // Fallback to equal weights
      const equalWeight = 1 / stockMetrics.length
      for (const stock of stockMetrics) {
        weights[stock.symbol] = equalWeight
      }
      return weights
    }
    
    // Allocate based on Sharpe ratio squared (more aggressive weighting)
    let totalSharpeSquared = 0
    for (const stock of goodStocks) {
      totalSharpeSquared += stock.sharpe * stock.sharpe
    }
    
    for (const stock of goodStocks) {
      weights[stock.symbol] = (stock.sharpe * stock.sharpe) / totalSharpeSquared
    }
    
    // Add small weights to remaining stocks
    const remainingStocks = stockMetrics.filter(stock => stock.sharpe <= 0)
    const smallWeight = remainingStocks.length > 0 ? 0.05 / remainingStocks.length : 0
    
    for (const stock of remainingStocks) {
      weights[stock.symbol] = smallWeight
    }
    
    return weights
  }

  private calculatePortfolioMetrics(
    weights: { [symbol: string]: number },
    stockMetrics: StockMetrics[],
    correlationMatrix: { [symbol: string]: { [symbol: string]: number } }
  ) {
    // Calculate expected return
    let expectedReturn = 0
    for (const stock of stockMetrics) {
      expectedReturn += weights[stock.symbol] * stock.expectedReturn
    }
    
    // Calculate portfolio volatility
    let portfolioVariance = 0
    for (let i = 0; i < stockMetrics.length; i++) {
      for (let j = 0; j < stockMetrics.length; j++) {
        const stock1 = stockMetrics[i]
        const stock2 = stockMetrics[j]
        const correlation = correlationMatrix[stock1.symbol][stock2.symbol]
        portfolioVariance += weights[stock1.symbol] * weights[stock2.symbol] * 
                           stock1.volatility * stock2.volatility * correlation
      }
    }
    
    const volatility = Math.sqrt(portfolioVariance)
    
    // Calculate Sharpe ratio
    const sharpeRatio = (expectedReturn - this.RISK_FREE_RATE) / volatility
    
    // Estimate maximum drawdown (simplified)
    const maxDrawdown = volatility * 2.5 // Rough estimate
    
    // Calculate Value at Risk (95% confidence)
    const var95 = volatility * 1.645 // 95% VaR
    
    // Calculate diversification ratio
    const weightedAvgVol = stockMetrics.reduce((sum, stock) => 
      sum + weights[stock.symbol] * stock.volatility, 0)
    const diversificationRatio = weightedAvgVol / volatility
    
    // Calculate concentration risk (Herfindahl index)
    const concentrationRisk = Object.values(weights).reduce((sum, weight) => 
      sum + weight * weight, 0)
    
    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      var95,
      diversificationRatio,
      concentrationRisk
    }
  }

  private generateRebalancingRecommendations(
    currentHoldings: PortfolioHolding[],
    targetWeights: { [symbol: string]: number },
    stockMetrics: StockMetrics[]
  ): RebalancingRecommendation[] {
    const recommendations: RebalancingRecommendation[] = []
    
    // Calculate current portfolio value
    const totalValue = currentHoldings.reduce((sum, holding) => sum + holding.marketValue, 0)
    
    for (const holding of currentHoldings) {
      const currentWeight = holding.marketValue / totalValue
      const targetWeight = targetWeights[holding.symbol] || 0
      const difference = targetWeight - currentWeight
      
      if (Math.abs(difference) > 0.02) { // Only recommend if difference > 2%
        const action = difference > 0 ? 'BUY' : 'SELL'
        const amount = Math.abs(difference) * totalValue
        
        let reason = ''
        if (action === 'BUY') {
          const stockMetric = stockMetrics.find(m => m.symbol === holding.symbol)
          reason = `High Sharpe ratio (${stockMetric?.sharpe.toFixed(2)}), expected return ${(stockMetric?.expectedReturn * 100).toFixed(1)}%`
        } else {
          reason = 'Overweight position, consider rebalancing for risk management'
        }
        
        recommendations.push({
          symbol: holding.symbol,
          currentWeight: currentWeight * 100,
          targetWeight: targetWeight * 100,
          action,
          amount,
          reason
        })
      }
    }
    
    return recommendations
  }

  // Helper methods for market cap and sector classification
  private getMarketCapFactor(symbol: string): number {
    // Simplified market cap classification
    const largeCap = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA']
    const midCap = ['AMD', 'NFLX', 'CRM', 'ADBE', 'PYPL']
    
    if (largeCap.includes(symbol)) return -0.01 // Large cap premium
    if (midCap.includes(symbol)) return 0.01 // Mid cap premium
    return 0.03 // Small cap premium
  }

  private getSectorFactor(symbol: string): number {
    // Sector-based expected return adjustments
    const techStocks = ['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA', 'AMD']
    const financeStocks = ['JPM', 'BAC', 'WFC', 'GS']
    const healthcareStocks = ['JNJ', 'PFE', 'UNH']
    
    if (techStocks.includes(symbol)) return 0.02 // Tech growth premium
    if (financeStocks.includes(symbol)) return -0.01 // Finance discount
    if (healthcareStocks.includes(symbol)) return 0.01 // Healthcare premium
    
    return 0 // Neutral
  }

  private getSector(symbol: string): string {
    const techStocks = ['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA', 'AMD']
    const financeStocks = ['JPM', 'BAC', 'WFC', 'GS']
    const healthcareStocks = ['JNJ', 'PFE', 'UNH']
    
    if (techStocks.includes(symbol)) return 'Technology'
    if (financeStocks.includes(symbol)) return 'Financial Services'
    if (healthcareStocks.includes(symbol)) return 'Healthcare'
    
    return 'Other'
  }
}

export const portfolioOptimizer = new PortfolioOptimizer()
