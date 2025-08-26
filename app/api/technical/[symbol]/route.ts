import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const indicators = await dataService.getTechnicalIndicators(symbol)

    return NextResponse.json({
      success: true,
      data: indicators,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching technical indicators:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch technical data" }, { status: 500 })
  }
}
