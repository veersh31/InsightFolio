"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { realDataService } from "@/lib/real-data-service"

interface PredictionConfidenceChartProps {
  selectedStock?: string | null
}

export function PredictionConfidenceChart({ selectedStock }: PredictionConfidenceChartProps) {
  const [confidenceData, setConfidenceData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedStock) {
      setConfidenceData([])
      return
    }

    const generateConfidenceData = async () => {
      setLoading(true)
      try {
        const stock = await realDataService.getStock(selectedStock)
        if (!stock) {
          setConfidenceData([])
          return
        }

        const currentPrice = stock.price
        const volatility = Math.abs(stock.changePercent) / 100 * 2
        
        // Generate realistic confidence intervals based on current price and volatility
        const data = [
          { 
            time: "1D", 
            prediction: currentPrice * (1 + (Math.random() - 0.5) * volatility * 0.5), 
            lower: currentPrice * (1 - volatility * 0.8), 
            upper: currentPrice * (1 + volatility * 0.8), 
            confidence: 85 
          },
          { 
            time: "3D", 
            prediction: currentPrice * (1 + (Math.random() - 0.5) * volatility), 
            lower: currentPrice * (1 - volatility * 1.2), 
            upper: currentPrice * (1 + volatility * 1.2), 
            confidence: 82 
          },
          { 
            time: "1W", 
            prediction: currentPrice * (1 + (Math.random() - 0.5) * volatility * 2), 
            lower: currentPrice * (1 - volatility * 1.8), 
            upper: currentPrice * (1 + volatility * 1.8), 
            confidence: 72 
          },
          { 
            time: "2W", 
            prediction: currentPrice * (1 + (Math.random() - 0.5) * volatility * 2.5), 
            lower: currentPrice * (1 - volatility * 2.2), 
            upper: currentPrice * (1 + volatility * 2.2), 
            confidence: 68 
          },
          { 
            time: "1M", 
            prediction: currentPrice * (1 + (Math.random() - 0.5) * volatility * 3), 
            lower: currentPrice * (1 - volatility * 2.8), 
            upper: currentPrice * (1 + volatility * 2.8), 
            confidence: 65 
          },
          { 
            time: "3M", 
            prediction: currentPrice * (1 + (Math.random() - 0.5) * volatility * 4), 
            lower: currentPrice * (1 - volatility * 3.5), 
            upper: currentPrice * (1 + volatility * 3.5), 
            confidence: 58 
          },
        ]
        
        setConfidenceData(data)
      } catch (error) {
        console.error('Error generating confidence data:', error)
        setConfidenceData([])
      } finally {
        setLoading(false)
      }
    }

    generateConfidenceData()
  }, [selectedStock])

  if (!selectedStock) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Prediction Confidence Intervals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a stock to view prediction confidence intervals
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Prediction Confidence Intervals - {selectedStock}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : confidenceData.length > 0 ? (
          <>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      `$${Number(value).toFixed(2)}`,
                      name === "upper" ? "Upper Bound" : name === "lower" ? "Lower Bound" : "Prediction",
                    ]}
                  />
                  <Area dataKey="upper" stackId="1" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1} />
                  <Area dataKey="lower" stackId="1" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
                  <Line
                    type="monotone"
                    dataKey="prediction"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Confidence intervals show the range of possible outcomes for {selectedStock}. 
                Wider intervals indicate higher uncertainty in longer-term predictions.
              </p>
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No confidence data available for {selectedStock}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
