// Database schema and utilities for future integration
export interface DatabaseSchema {
  users: {
    id: string
    email: string
    name: string
    preferences: UserPreferences
    created_at: Date
    updated_at: Date
  }

  portfolios: {
    id: string
    user_id: string
    name: string
    holdings: PortfolioHolding[]
    created_at: Date
    updated_at: Date
  }

  alerts: {
    id: string
    user_id: string
    type: "price" | "prediction" | "news" | "technical"
    symbol: string
    condition: string
    value: number | string
    is_active: boolean
    created_at: Date
    triggered_at?: Date
  }

  watchlists: {
    id: string
    user_id: string
    name: string
    symbols: string[]
    created_at: Date
    updated_at: Date
  }
}

interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboard: {
    defaultView: string
    refreshInterval: number
    showAdvancedMetrics: boolean
  }
}

interface PortfolioHolding {
  symbol: string
  shares: number
  avg_cost: number
  purchase_date: Date
}

// Future database connection utilities
export class DatabaseService {
  // Placeholder for database operations
  async createUser(userData: Partial<DatabaseSchema["users"]>) {
    // Implementation for user creation
  }

  async getUserPortfolio(userId: string) {
    // Implementation for fetching user portfolio
  }

  async createAlert(alertData: Partial<DatabaseSchema["alerts"]>) {
    // Implementation for creating alerts
  }

  async getUserAlerts(userId: string) {
    // Implementation for fetching user alerts
  }
}

export const db = new DatabaseService()
