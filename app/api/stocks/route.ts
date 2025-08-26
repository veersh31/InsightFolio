import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",")

    const stocks = await dataService.getStocks(symbols)

    return NextResponse.json({
      success: true,
      data: stocks,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching stocks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stock data" }, { status: 500 })
  }
}
