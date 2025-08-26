import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: false,
        error: "Search query must be at least 2 characters",
      })
    }

    // Get all stocks and filter by search query
    const allStocks = await dataService.getStocks()
    const filteredStocks = allStocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json({
      success: true,
      data: filteredStocks.slice(0, 10), // Limit to 10 results
      query,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error searching stocks:", error)
    return NextResponse.json({ success: false, error: "Failed to search stocks" }, { status: 500 })
  }
}
