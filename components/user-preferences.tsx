"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Settings, Moon, Sun } from "lucide-react"
import { useState } from "react"

export function UserPreferences() {
  const [preferences, setPreferences] = useState({
    theme: "system",
    notifications: {
      email: true,
      push: true,
      sms: false,
      priceAlerts: true,
      newsAlerts: true,
      mlPredictions: true,
    },
    dashboard: {
      defaultView: "overview",
      refreshInterval: 30,
      showAdvancedMetrics: true,
      compactMode: false,
      autoRefresh: true,
    },
    trading: {
      riskTolerance: 5,
      investmentHorizon: "medium",
      preferredSectors: ["technology", "healthcare"],
      excludeSectors: ["tobacco", "gambling"],
    },
    privacy: {
      shareAnalytics: true,
      personalizedAds: false,
      dataRetention: "2years",
    },
  })

  const updatePreference = (category: string, key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const sectors = [
    "Technology",
    "Healthcare",
    "Finance",
    "Energy",
    "Consumer Goods",
    "Industrial",
    "Real Estate",
    "Utilities",
    "Materials",
    "Telecommunications",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          User Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="display" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Default Dashboard View</Label>
                  <p className="text-sm text-muted-foreground">Choose what you see first when you log in</p>
                </div>
                <Select
                  value={preferences.dashboard.defaultView}
                  onValueChange={(value) => updatePreference("dashboard", "defaultView", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="watchlist">Watchlist</SelectItem>
                    <SelectItem value="predictions">ML Predictions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Auto Refresh Interval</Label>
                  <span className="text-sm font-medium">{preferences.dashboard.refreshInterval}s</span>
                </div>
                <Slider
                  value={[preferences.dashboard.refreshInterval]}
                  onValueChange={([value]) => updatePreference("dashboard", "refreshInterval", value)}
                  max={300}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Show Advanced Metrics</Label>
                  <p className="text-sm text-muted-foreground">Display technical indicators and risk metrics</p>
                </div>
                <Switch
                  checked={preferences.dashboard.showAdvancedMetrics}
                  onCheckedChange={(checked) => updatePreference("dashboard", "showAdvancedMetrics", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing and show more data</p>
                </div>
                <Switch
                  checked={preferences.dashboard.compactMode}
                  onCheckedChange={(checked) => updatePreference("dashboard", "compactMode", checked)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => updatePreference("notifications", "email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                </div>
                <Switch
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => updatePreference("notifications", "push", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Text message notifications for critical alerts</p>
                </div>
                <Switch
                  checked={preferences.notifications.sms}
                  onCheckedChange={(checked) => updatePreference("notifications", "sms", checked)}
                />
              </div>

              <hr className="my-4" />

              <div className="space-y-4">
                <h4 className="font-medium">Alert Types</h4>

                <div className="flex items-center justify-between">
                  <Label>Price Alerts</Label>
                  <Switch
                    checked={preferences.notifications.priceAlerts}
                    onCheckedChange={(checked) => updatePreference("notifications", "priceAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>News & Sentiment</Label>
                  <Switch
                    checked={preferences.notifications.newsAlerts}
                    onCheckedChange={(checked) => updatePreference("notifications", "newsAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>ML Predictions</Label>
                  <Switch
                    checked={preferences.notifications.mlPredictions}
                    onCheckedChange={(checked) => updatePreference("notifications", "mlPredictions", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Risk Tolerance</Label>
                  <span className="text-sm font-medium">
                    {preferences.trading.riskTolerance}/10 (
                    {preferences.trading.riskTolerance <= 3
                      ? "Conservative"
                      : preferences.trading.riskTolerance <= 7
                        ? "Moderate"
                        : "Aggressive"}
                    )
                  </span>
                </div>
                <Slider
                  value={[preferences.trading.riskTolerance]}
                  onValueChange={([value]) => updatePreference("trading", "riskTolerance", value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Investment Horizon</Label>
                  <p className="text-sm text-muted-foreground">Your typical holding period</p>
                </div>
                <Select
                  value={preferences.trading.investmentHorizon}
                  onValueChange={(value) => updatePreference("trading", "investmentHorizon", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (&lt; 1 year)</SelectItem>
                    <SelectItem value="medium">Medium (1-5 years)</SelectItem>
                    <SelectItem value="long">Long (&gt; 5 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base">Preferred Sectors</Label>
                <div className="grid grid-cols-2 gap-2">
                  {sectors.map((sector) => (
                    <div key={sector} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={sector}
                        checked={preferences.trading.preferredSectors.includes(sector.toLowerCase())}
                        onChange={(e) => {
                          const sectorLower = sector.toLowerCase()
                          const newSectors = e.target.checked
                            ? [...preferences.trading.preferredSectors, sectorLower]
                            : preferences.trading.preferredSectors.filter((s) => s !== sectorLower)
                          updatePreference("trading", "preferredSectors", newSectors)
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={sector} className="text-sm">
                        {sector}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Share Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve our ML models with anonymized data</p>
                </div>
                <Switch
                  checked={preferences.privacy.shareAnalytics}
                  onCheckedChange={(checked) => updatePreference("privacy", "shareAnalytics", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Personalized Ads</Label>
                  <p className="text-sm text-muted-foreground">Show ads based on your interests</p>
                </div>
                <Switch
                  checked={preferences.privacy.personalizedAds}
                  onCheckedChange={(checked) => updatePreference("privacy", "personalizedAds", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Data Retention</Label>
                  <p className="text-sm text-muted-foreground">How long to keep your data</p>
                </div>
                <Select
                  value={preferences.privacy.dataRetention}
                  onValueChange={(value) => updatePreference("privacy", "dataRetention", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                    <SelectItem value="5years">5 Years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <Button className="w-full">Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  )
}
