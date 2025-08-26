import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const sentiment = await dataService.getSentimentData(symbol)

    return NextResponse.json({
      success: true,
      data: sentiment,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching sentiment data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sentiment data" }, { status: 500 })
  }
}
