import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    const predictions = await dataService.getMLPredictions(symbol || undefined)

    return NextResponse.json({
      success: true,
      data: predictions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch prediction data" }, { status: 500 })
  }
}
