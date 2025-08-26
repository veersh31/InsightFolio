import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const risk = await dataService.getRiskMetrics(symbol)

    return NextResponse.json({
      success: true,
      data: risk,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching risk data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch risk data" }, { status: 500 })
  }
}
