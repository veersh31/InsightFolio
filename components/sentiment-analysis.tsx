import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, TrendingUp, TrendingDown, Newspaper, Twitter, Users } from "lucide-react"

export function SentimentAnalysis() {
  const sentimentData = {
    overall: {
      score: 0.72,
      label: "Bullish",
      change: 0.08,
      sources: 1247,
    },
    news: {
      score: 0.68,
      label: "Positive",
      articles: 156,
      topSources: ["Reuters", "Bloomberg", "CNBC"],
    },
    social: {
      score: 0.76,
      label: "Very Positive",
      mentions: 8924,
      platforms: ["Twitter", "Reddit", "StockTwits"],
    },
    analyst: {
      score: 0.71,
      label: "Positive",
      reports: 23,
      upgrades: 8,
      downgrades: 2,
    },
  }

  const recentNews = [
    {
      title: "Apple Reports Strong Q3 Earnings, Beats Expectations",
      source: "Reuters",
      sentiment: 0.85,
      time: "2 hours ago",
      impact: "High",
    },
    {
      title: "iPhone 15 Sales Exceed Analyst Projections",
      source: "Bloomberg",
      sentiment: 0.78,
      time: "4 hours ago",
      impact: "Medium",
    },
    {
      title: "Apple Services Revenue Continues Growth Trajectory",
      source: "CNBC",
      sentiment: 0.72,
      time: "6 hours ago",
      impact: "Medium",
    },
    {
      title: "Concerns Over China Market Headwinds",
      source: "Financial Times",
      sentiment: 0.35,
      time: "8 hours ago",
      impact: "Medium",
    },
  ]

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (score >= 0.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  const getSentimentLabel = (score: number) => {
    if (score >= 0.8) return "Very Positive"
    if (score >= 0.6) return "Positive"
    if (score >= 0.4) return "Neutral"
    if (score >= 0.2) return "Negative"
    return "Very Negative"
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Sentiment Analysis - AAPL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Sentiment */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Overall Sentiment</p>
              <p className="text-2xl font-bold mb-2">{Math.round(sentimentData.overall.score * 100)}%</p>
              <Badge className={getSentimentColor(sentimentData.overall.score)}>{sentimentData.overall.label}</Badge>
              <div className="flex items-center justify-center gap-1 mt-2">
                {sentimentData.overall.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs ${sentimentData.overall.change > 0 ? "text-green-500" : "text-red-500"}`}>
                  {sentimentData.overall.change > 0 ? "+" : ""}
                  {(sentimentData.overall.change * 100).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <Newspaper className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">News Sentiment</p>
              <p className="text-2xl font-bold mb-2">{Math.round(sentimentData.news.score * 100)}%</p>
              <Badge className={getSentimentColor(sentimentData.news.score)}>
                {getSentimentLabel(sentimentData.news.score)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">{sentimentData.news.articles} articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <Twitter className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Social Sentiment</p>
              <p className="text-2xl font-bold mb-2">{Math.round(sentimentData.social.score * 100)}%</p>
              <Badge className={getSentimentColor(sentimentData.social.score)}>
                {getSentimentLabel(sentimentData.social.score)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                {sentimentData.social.mentions.toLocaleString()} mentions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Analyst Sentiment</p>
              <p className="text-2xl font-bold mb-2">{Math.round(sentimentData.analyst.score * 100)}%</p>
              <Badge className={getSentimentColor(sentimentData.analyst.score)}>
                {getSentimentLabel(sentimentData.analyst.score)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">{sentimentData.analyst.reports} reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">News Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sentimentData.news.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{source}</span>
                  <Badge variant="outline" size="sm">
                    Active
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Social Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sentimentData.social.platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{platform}</span>
                  <Badge variant="outline" size="sm">
                    Trending
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Analyst Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Upgrades</span>
                <span className="font-semibold text-green-600">{sentimentData.analyst.upgrades}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Downgrades</span>
                <span className="font-semibold text-red-600">{sentimentData.analyst.downgrades}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Reports</span>
                <span className="font-semibold">{sentimentData.analyst.reports}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent News */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent News Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNews.map((news, index) => (
                <div key={index} className="flex items-start justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{news.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getSentimentColor(news.sentiment)} size="sm">
                      {Math.round(news.sentiment * 100)}%
                    </Badge>
                    <Badge className={getImpactColor(news.impact)} size="sm">
                      {news.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Trend</span>
                  <span className="font-semibold text-green-600">Improving</span>
                </div>
                <Progress value={72} className="h-3" />
              </div>
              <p className="text-sm text-muted-foreground">
                Sentiment has improved by 8% over the past week, driven primarily by positive earnings results and
                strong product sales data. Social media mentions have increased 34% with predominantly positive tone.
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
