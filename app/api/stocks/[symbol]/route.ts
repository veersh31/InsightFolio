import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol.toUpperCase()
    const stock = await dataService.getStock(symbol)

    if (!stock) {
      return NextResponse.json({ success: false, error: "Stock not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: stock,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching stock:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stock data" }, { status: 500 })
  }
}
