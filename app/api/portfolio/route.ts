import { NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET() {
  try {
    const portfolio = await dataService.getPortfolio()

    return NextResponse.json({
      success: true,
      data: portfolio,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch portfolio data" }, { status: 500 })
  }
}
