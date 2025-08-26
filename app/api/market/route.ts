import { NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET() {
  try {
    const indices = await dataService.getMarketIndices()

    return NextResponse.json({
      success: true,
      data: indices,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch market data" }, { status: 500 })
  }
}
