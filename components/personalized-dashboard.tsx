"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Eye, EyeOff, Settings, Plus, Star } from "lucide-react"
import { useState } from "react"

interface DashboardWidget {
  id: string
  title: string
  component: string
  visible: boolean
  order: number
  size: "small" | "medium" | "large"
}

export function PersonalizedDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: "portfolio",
      title: "Portfolio Overview",
      component: "PortfolioOverview",
      visible: true,
      order: 0,
      size: "large",
    },
    { id: "market", title: "Market Overview", component: "MarketOverview", visible: true, order: 1, size: "medium" },
    { id: "predictions", title: "ML Predictions", component: "MLPredictions", visible: true, order: 2, size: "large" },
    { id: "watchlist", title: "Watchlist", component: "Watchlist", visible: true, order: 3, size: "medium" },
    {
      id: "technical",
      title: "Technical Indicators",
      component: "TechnicalIndicators",
      visible: true,
      order: 4,
      size: "large",
    },
    {
      id: "sentiment",
      title: "Sentiment Analysis",
      component: "SentimentAnalysis",
      visible: false,
      order: 5,
      size: "large",
    },
    { id: "risk", title: "Risk Analytics", component: "RiskAnalytics", visible: false, order: 6, size: "large" },
    {
      id: "fundamental",
      title: "Fundamental Analysis",
      component: "FundamentalAnalysis",
      visible: false,
      order: 7,
      size: "large",
    },
  ])

  const [favoriteStocks] = useState([
    { symbol: "AAPL", name: "Apple Inc.", change: 2.34, changePercent: 1.35 },
    { symbol: "GOOGL", name: "Alphabet Inc.", change: -15.67, changePercent: -0.55 },
    { symbol: "TSLA", name: "Tesla Inc.", change: 8.92, changePercent: 3.77 },
  ])

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, visible: !widget.visible } : widget)))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedWidgets = items.map((widget, index) => ({
      ...widget,
      order: index,
    }))

    setWidgets(updatedWidgets)
  }

  const visibleWidgets = widgets.filter((w) => w.visible).sort((a, b) => a.order - b.order)
  const hiddenWidgets = widgets.filter((w) => !w.visible)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Personalize Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Dashboard Layout</h4>
                <Button variant="outline" size="sm">
                  Reset to Default
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="widgets">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {visibleWidgets.map((widget, index) => (
                        <Draggable key={widget.id} draggableId={widget.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-3 border rounded-lg bg-card"
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{widget.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Size: {widget.size} • Order: {widget.order + 1}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {widget.size}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => toggleWidgetVisibility(widget.id)}>
                                  <EyeOff className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </TabsContent>

          <TabsContent value="widgets" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Available Widgets</h4>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Widget
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{widget.title}</p>
                      <p className="text-sm text-muted-foreground">{widget.component}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={widget.visible ? "default" : "secondary"}>
                        {widget.visible ? "Visible" : "Hidden"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => toggleWidgetVisibility(widget.id)}>
                        {widget.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {hiddenWidgets.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-medium mb-3">Hidden Widgets</h5>
                  <div className="space-y-2">
                    {hiddenWidgets.map((widget) => (
                      <div key={widget.id} className="flex items-center justify-between p-2 border rounded opacity-60">
                        <span className="text-sm">{widget.title}</span>
                        <Button variant="ghost" size="sm" onClick={() => toggleWidgetVisibility(widget.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Favorite Stocks</h4>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>

              <div className="space-y-3">
                {favoriteStocks.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${stock.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {stock.change > 0 ? "+" : ""}
                        {stock.change}
                      </p>
                      <p className={`text-sm ${stock.changePercent > 0 ? "text-green-500" : "text-red-500"}`}>
                        {stock.changePercent > 0 ? "+" : ""}
                        {stock.changePercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-medium mb-2">Quick Actions</h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    Create Watchlist
                  </Button>
                  <Button variant="outline" size="sm">
                    Import Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <Button className="w-full">Save Dashboard Configuration</Button>
        </div>
      </CardContent>
    </Card>
  )
}
