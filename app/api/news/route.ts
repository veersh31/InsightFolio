import { type NextRequest, NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const news = await dataService.getNews(symbol || undefined, limit)

    return NextResponse.json({
      success: true,
      data: news,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch news data" }, { status: 500 })
  }
}
