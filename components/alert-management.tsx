"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Plus, Trash2, TrendingUp, Brain, Newspaper } from "lucide-react"
import { useState } from "react"

interface Alert {
  id: string
  type: "price" | "prediction" | "news" | "technical"
  symbol: string
  condition: string
  value: number | string
  isActive: boolean
  created: string
  triggered?: boolean
}

export function AlertManagement() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "price",
      symbol: "AAPL",
      condition: "above",
      value: 180,
      isActive: true,
      created: "2024-01-15",
    },
    {
      id: "2",
      type: "prediction",
      symbol: "TSLA",
      condition: "confidence_above",
      value: 80,
      isActive: true,
      created: "2024-01-14",
    },
    {
      id: "3",
      type: "news",
      symbol: "AAPL",
      condition: "sentiment_below",
      value: 40,
      isActive: false,
      created: "2024-01-13",
      triggered: true,
    },
  ])

  const [newAlert, setNewAlert] = useState({
    type: "price" as const,
    symbol: "",
    condition: "",
    value: "",
  })

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, isActive: !alert.isActive } : alert)))
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const addAlert = () => {
    if (newAlert.symbol && newAlert.condition && newAlert.value) {
      const alert: Alert = {
        id: Date.now().toString(),
        type: newAlert.type,
        symbol: newAlert.symbol.toUpperCase(),
        condition: newAlert.condition,
        value: newAlert.type === "price" ? Number.parseFloat(newAlert.value) : newAlert.value,
        isActive: true,
        created: new Date().toISOString().split("T")[0],
      }
      setAlerts([...alerts, alert])
      setNewAlert({ type: "price", symbol: "", condition: "", value: "" })
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price":
        return <TrendingUp className="h-4 w-4" />
      case "prediction":
        return <Brain className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "price":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "prediction":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "news":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatAlertDescription = (alert: Alert) => {
    switch (alert.type) {
      case "price":
        return `${alert.symbol} price ${alert.condition} $${alert.value}`
      case "prediction":
        return `${alert.symbol} ML confidence ${alert.condition.replace("_", " ")} ${alert.value}%`
      case "news":
        return `${alert.symbol} sentiment ${alert.condition.replace("_", " ")} ${alert.value}%`
      default:
        return `${alert.symbol} ${alert.condition} ${alert.value}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="create">Create Alert</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <Badge className={getAlertTypeColor(alert.type)} size="sm">
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{formatAlertDescription(alert)}</p>
                      <p className="text-sm text-muted-foreground">Created: {alert.created}</p>
                    </div>
                    {alert.triggered && (
                      <Badge variant="destructive" size="sm">
                        Triggered
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={alert.isActive} onCheckedChange={() => toggleAlert(alert.id)} />
                    <Button variant="ghost" size="sm" onClick={() => deleteAlert(alert.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alerts configured</p>
                  <p className="text-sm">Create your first alert to get notified of important events</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert({ ...newAlert, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Alert</SelectItem>
                    <SelectItem value="prediction">ML Prediction</SelectItem>
                    <SelectItem value="news">News Sentiment</SelectItem>
                    <SelectItem value="technical">Technical Indicator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input
                  id="symbol"
                  placeholder="e.g., AAPL"
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={newAlert.condition}
                  onValueChange={(value) => setNewAlert({ ...newAlert, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAlert.type === "price" && (
                      <>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                        <SelectItem value="change_above">Daily Change Above</SelectItem>
                        <SelectItem value="change_below">Daily Change Below</SelectItem>
                      </>
                    )}
                    {newAlert.type === "prediction" && (
                      <>
                        <SelectItem value="confidence_above">Confidence Above</SelectItem>
                        <SelectItem value="confidence_below">Confidence Below</SelectItem>
                        <SelectItem value="signal_changed">Signal Changed</SelectItem>
                      </>
                    )}
                    {newAlert.type === "news" && (
                      <>
                        <SelectItem value="sentiment_above">Sentiment Above</SelectItem>
                        <SelectItem value="sentiment_below">Sentiment Below</SelectItem>
                        <SelectItem value="news_volume">High News Volume</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  placeholder={newAlert.type === "price" ? "e.g., 180.00" : "e.g., 80"}
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={addAlert} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
