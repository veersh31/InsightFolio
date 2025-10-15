import { SentimentData, NewsItem } from "./types"

// Industry-standard sentiment analysis algorithms
export class SentimentAnalyzer {
  private readonly SENTIMENT_WEIGHTS = {
    // News sentiment weights based on source credibility
    news: {
      'Reuters': 1.0,
      'Bloomberg': 0.95,
      'Wall Street Journal': 0.95,
      'Financial Times': 0.9,
      'MarketWatch': 0.85,
      'CNBC': 0.8,
      'Yahoo Finance': 0.75,
      'Seeking Alpha': 0.7,
      'Motley Fool': 0.65,
      'Benzinga': 0.6,
      'Zacks': 0.6,
      'default': 0.5
    },
    
    // Time decay factor - recent news has more weight
    timeDecay: {
      hours: 1.0,      // Last 24 hours
      days: 0.8,       // 2-7 days
      weeks: 0.6,      // 1-4 weeks
      months: 0.4      // 1+ months
    },
    
    // Impact multipliers based on market cap and volatility
    impact: {
      'High': 1.5,
      'Medium': 1.0,
      'Low': 0.5
    }
  }

  // VADER sentiment analysis algorithm (simplified implementation)
  private vaderSentiment(text: string): number {
    const positiveWords = [
      'bullish', 'strong', 'growth', 'positive', 'excellent', 'outperform', 'buy', 'upgrade',
      'beat', 'exceed', 'surge', 'rally', 'gain', 'rise', 'boost', 'profit', 'earnings',
      'revenue', 'success', 'breakthrough', 'innovation', 'leader', 'dominant'
    ]
    
    const negativeWords = [
      'bearish', 'weak', 'decline', 'negative', 'poor', 'underperform', 'sell', 'downgrade',
      'miss', 'disappoint', 'plunge', 'crash', 'loss', 'fall', 'cut', 'debt', 'concern',
      'risk', 'volatile', 'uncertain', 'challenge', 'competition', 'threat'
    ]
    
    const words = text.toLowerCase().split(/\s+/)
    let score = 0
    
    for (const word of words) {
      if (positiveWords.includes(word)) score += 1
      else if (negativeWords.includes(word)) score -= 1
    }
    
    // Normalize to 0-1 scale
    return Math.max(0, Math.min(1, (score / words.length) * 2 + 0.5))
  }

  // Calculate sentiment with multiple factors
  analyzeSentiment(newsItems: NewsItem[], symbol: string): SentimentData {
    if (newsItems.length === 0) {
      return this.getDefaultSentiment()
    }

    // Calculate weighted sentiment scores
    const newsSentiment = this.calculateNewsSentiment(newsItems)
    const socialSentiment = this.estimateSocialSentiment(newsItems, symbol)
    const analystSentiment = this.estimateAnalystSentiment(newsItems, symbol)
    
    // Calculate overall sentiment with weighted average
    const overallScore = this.calculateOverallSentiment(newsSentiment, socialSentiment, analystSentiment)
    
    // Calculate sentiment change (trend analysis)
    const sentimentChange = this.calculateSentimentTrend(newsItems)
    
    return {
      overall: {
        score: overallScore,
        label: this.getSentimentLabel(overallScore),
        change: sentimentChange,
        sources: newsItems.length
      },
      news: {
        score: newsSentiment.score,
        label: this.getSentimentLabel(newsSentiment.score),
        articles: newsSentiment.count,
        topSources: newsSentiment.topSources
      },
      social: {
        score: socialSentiment.score,
        label: this.getSentimentLabel(socialSentiment.score),
        mentions: socialSentiment.mentions,
        platforms: socialSentiment.platforms
      },
      analyst: {
        score: analystSentiment.score,
        label: this.getSentimentLabel(analystSentiment.score),
        reports: analystSentiment.reports,
        upgrades: analystSentiment.upgrades,
        downgrades: analystSentiment.downgrades
      }
    }
  }

  private calculateNewsSentiment(newsItems: NewsItem[]) {
    let weightedSum = 0
    let totalWeight = 0
    const sourceCounts: { [key: string]: number } = {}
    
    for (const news of newsItems) {
      // Get source weight
      const sourceWeight = this.SENTIMENT_WEIGHTS.news[news.source as keyof typeof this.SENTIMENT_WEIGHTS.news] || 
                          this.SENTIMENT_WEIGHTS.news.default
      
      // Get impact weight
      const impactWeight = this.SENTIMENT_WEIGHTS.impact[news.impact]
      
      // Calculate time decay
      const timeDecay = this.calculateTimeDecay(news.time)
      
      // Enhanced sentiment using VADER
      const enhancedSentiment = this.vaderSentiment(news.title)
      const weightedSentiment = enhancedSentiment * sourceWeight * impactWeight * timeDecay
      
      weightedSum += weightedSentiment
      totalWeight += sourceWeight * impactWeight * timeDecay
      
      // Track source counts
      sourceCounts[news.source] = (sourceCounts[news.source] || 0) + 1
    }
    
    const avgScore = totalWeight > 0 ? weightedSum / totalWeight : 0.5
    const topSources = Object.entries(sourceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source]) => source)
    
    return {
      score: avgScore,
      count: newsItems.length,
      topSources
    }
  }

  private estimateSocialSentiment(newsItems: NewsItem[], symbol: string) {
    // Estimate social sentiment based on news sentiment and volume
    const avgNewsSentiment = newsItems.reduce((sum, news) => sum + news.sentiment, 0) / newsItems.length
    const newsVolume = newsItems.length
    
    // Social sentiment typically amplifies news sentiment
    const socialMultiplier = Math.min(2, 1 + (newsVolume / 10))
    const socialScore = Math.max(0, Math.min(1, avgNewsSentiment * socialMultiplier))
    
    // Estimate mentions based on news volume and impact
    const highImpactNews = newsItems.filter(news => news.impact === 'High').length
    const estimatedMentions = (newsVolume * 100) + (highImpactNews * 500)
    
    return {
      score: socialScore,
      mentions: Math.floor(estimatedMentions),
      platforms: ['Twitter', 'Reddit', 'StockTwits', 'Discord', 'Telegram']
    }
  }

  private estimateAnalystSentiment(newsItems: NewsItem[], symbol: string) {
    // Analyze news for analyst-related content
    const analystKeywords = ['analyst', 'rating', 'target', 'price target', 'upgrade', 'downgrade', 'recommendation']
    const analystNews = newsItems.filter(news => 
      analystKeywords.some(keyword => news.title.toLowerCase().includes(keyword))
    )
    
    if (analystNews.length === 0) {
      // Fallback to general news sentiment
      const avgSentiment = newsItems.reduce((sum, news) => sum + news.sentiment, 0) / newsItems.length
      return {
        score: avgSentiment,
        reports: 0,
        upgrades: 0,
        downgrades: 0
      }
    }
    
    // Count upgrades and downgrades
    let upgrades = 0
    let downgrades = 0
    
    for (const news of analystNews) {
      const title = news.title.toLowerCase()
      if (title.includes('upgrade') || title.includes('buy') || title.includes('outperform')) {
        upgrades++
      } else if (title.includes('downgrade') || title.includes('sell') || title.includes('underperform')) {
        downgrades++
      }
    }
    
    // Calculate analyst sentiment
    const totalAnalystActions = upgrades + downgrades
    const analystScore = totalAnalystActions > 0 ? 
      (upgrades / totalAnalystActions) * 0.8 + 0.1 : 0.5
    
    return {
      score: analystScore,
      reports: analystNews.length,
      upgrades,
      downgrades
    }
  }

  private calculateOverallSentiment(news: any, social: any, analyst: any) {
    // Weighted combination of different sentiment sources
    const weights = {
      news: 0.4,
      social: 0.3,
      analyst: 0.3
    }
    
    return (news.score * weights.news) + 
           (social.score * weights.social) + 
           (analyst.score * weights.analyst)
  }

  private calculateSentimentTrend(newsItems: NewsItem[]): number {
    if (newsItems.length < 2) return 0
    
    // Sort by time (assuming more recent items have higher indices)
    const sortedNews = [...newsItems].reverse()
    
    // Calculate sentiment for first half vs second half
    const midPoint = Math.floor(sortedNews.length / 2)
    const recentSentiment = sortedNews.slice(0, midPoint)
      .reduce((sum, news) => sum + news.sentiment, 0) / midPoint
    
    const olderSentiment = sortedNews.slice(midPoint)
      .reduce((sum, news) => sum + news.sentiment, 0) / (sortedNews.length - midPoint)
    
    return recentSentiment - olderSentiment
  }

  private calculateTimeDecay(timeString: string): number {
    try {
      const newsTime = new Date(timeString)
      const now = new Date()
      const hoursDiff = (now.getTime() - newsTime.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff <= 24) return this.SENTIMENT_WEIGHTS.timeDecay.hours
      if (hoursDiff <= 168) return this.SENTIMENT_WEIGHTS.timeDecay.days // 7 days
      if (hoursDiff <= 720) return this.SENTIMENT_WEIGHTS.timeDecay.weeks // 30 days
      return this.SENTIMENT_WEIGHTS.timeDecay.months
    } catch {
      return 0.5 // Default weight if time parsing fails
    }
  }

  private getSentimentLabel(score: number): string {
    if (score >= 0.8) return "Very Positive"
    if (score >= 0.6) return "Positive"
    if (score >= 0.4) return "Neutral"
    if (score >= 0.2) return "Negative"
    return "Very Negative"
  }

  private getDefaultSentiment(): SentimentData {
    return {
      overall: { score: 0.5, label: "Neutral", change: 0, sources: 0 },
      news: { score: 0.5, label: "Neutral", articles: 0, topSources: [] },
      social: { score: 0.5, label: "Neutral", mentions: 0, platforms: [] },
      analyst: { score: 0.5, label: "Neutral", reports: 0, upgrades: 0, downgrades: 0 }
    }
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer()
