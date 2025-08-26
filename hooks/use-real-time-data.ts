"use client"

import { useState, useEffect, useCallback } from "react"
import type { Stock } from "@/lib/types"

export function useRealTimeData(symbols: string[], enabled = true) {
  const [data, setData] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!symbols.length) return

    try {
      const response = await fetch(`/api/stocks?symbols=${symbols.join(",")}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch data")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }, [symbols])

  useEffect(() => {
    if (!enabled) return

    fetchData()

    // Set up real-time updates every 5 seconds
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [fetchData, enabled])

  return { data, loading, error, refetch: fetchData }
}
