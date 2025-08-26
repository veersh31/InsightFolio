"use client"

import { useState, useEffect } from "react"

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

export function useApi<T>(url: string, options?: { enabled?: boolean; refetchInterval?: number }) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(url)
      const result: ApiResponse<T> = await response.json()

      if (result.success && result.data) {
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
  }

  useEffect(() => {
    if (options?.enabled === false) return

    fetchData()

    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval)
      return () => clearInterval(interval)
    }
  }, [url, options?.enabled, options?.refetchInterval])

  return { data, loading, error, refetch: fetchData }
}
