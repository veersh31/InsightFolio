import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const fundamental = await dataService.getFundamentalData(symbol)

    return NextResponse.json({
      success: true,
      data: fundamental,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching fundamental data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch fundamental data" }, { status: 500 })
  }
}
