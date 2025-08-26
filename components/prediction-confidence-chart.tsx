"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"

export function PredictionConfidenceChart() {
  const confidenceData = [
    { time: "1D", prediction: 178.2, lower: 175.1, upper: 181.3, confidence: 85 },
    { time: "3D", prediction: 179.8, lower: 174.2, upper: 185.4, confidence: 82 },
    { time: "1W", prediction: 182.5, lower: 172.8, upper: 192.2, confidence: 72 },
    { time: "2W", prediction: 184.1, lower: 170.5, upper: 197.7, confidence: 68 },
    { time: "1M", prediction: 185.3, lower: 168.2, upper: 202.4, confidence: 65 },
    { time: "3M", prediction: 188.7, lower: 162.1, upper: 215.3, confidence: 58 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Prediction Confidence Intervals - AAPL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
              <Tooltip
                formatter={(value: any, name: string) => [
                  `$${value}`,
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
            Confidence intervals show the range of possible outcomes. Wider intervals indicate higher uncertainty in
            longer-term predictions.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
