"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, FileText, ImageIcon, Mail, Link, Printer } from "lucide-react"
import { useState } from "react"

export function ExportDashboard() {
  const [exportOptions, setExportOptions] = useState({
    format: "pdf",
    sections: {
      portfolio: true,
      predictions: true,
      analytics: true,
      technical: false,
      sentiment: true,
      risk: false,
    },
    timeRange: "1month",
    includeCharts: true,
    includeData: true,
  })

  const [shareOptions, setShareOptions] = useState({
    method: "link",
    expiry: "7days",
    password: false,
    allowDownload: true,
  })

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting with options:", exportOptions)
  // In InsightFolio, this would generate and download the report
  }

  const handleShare = () => {
    // Simulate share functionality
    console.log("Sharing with options:", shareOptions)
  // In InsightFolio, this would generate a shareable link
  }

  const updateExportSection = (section: string, checked: boolean) => {
    setExportOptions((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: checked,
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Share Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export Report</TabsTrigger>
            <TabsTrigger value="share">Share Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={exportOptions.format}
                  onValueChange={(value) => setExportOptions({ ...exportOptions, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF Report
                      </div>
                    </SelectItem>
                    <SelectItem value="excel">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Excel Spreadsheet
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        CSV Data
                      </div>
                    </SelectItem>
                    <SelectItem value="png">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        PNG Image
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Range</Label>
                <Select
                  value={exportOptions.timeRange}
                  onValueChange={(value) => setExportOptions({ ...exportOptions, timeRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">Last 24 Hours</SelectItem>
                    <SelectItem value="1week">Last Week</SelectItem>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Include Sections</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(exportOptions.sections).map(([section, checked]) => (
                  <div key={section} className="flex items-center space-x-2">
                    <Checkbox
                      id={section}
                      checked={checked}
                      onCheckedChange={(checked) => updateExportSection(section, checked as boolean)}
                    />
                    <Label htmlFor={section} className="text-sm capitalize">
                      {section === "technical" ? "Technical Analysis" : section}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Additional Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts"
                    checked={exportOptions.includeCharts}
                    onCheckedChange={(checked) =>
                      setExportOptions({ ...exportOptions, includeCharts: checked as boolean })
                    }
                  />
                  <Label htmlFor="charts" className="text-sm">
                    Include Charts and Visualizations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="data"
                    checked={exportOptions.includeData}
                    onCheckedChange={(checked) =>
                      setExportOptions({ ...exportOptions, includeData: checked as boolean })
                    }
                  />
                  <Label htmlFor="data" className="text-sm">
                    Include Raw Data Tables
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Share Method</Label>
                <Select
                  value={shareOptions.method}
                  onValueChange={(value) => setShareOptions({ ...shareOptions, method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Shareable Link
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Report
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Link Expiry</Label>
                <Select
                  value={shareOptions.expiry}
                  onValueChange={(value) => setShareOptions({ ...shareOptions, expiry: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Share Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="password"
                    checked={shareOptions.password}
                    onCheckedChange={(checked) => setShareOptions({ ...shareOptions, password: checked as boolean })}
                  />
                  <Label htmlFor="password" className="text-sm">
                    Password Protection
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="download"
                    checked={shareOptions.allowDownload}
                    onCheckedChange={(checked) =>
                      setShareOptions({ ...shareOptions, allowDownload: checked as boolean })
                    }
                  />
                  <Label htmlFor="download" className="text-sm">
                    Allow Recipients to Download
                  </Label>
                </div>
              </div>
            </div>

            <Button onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Generate Share Link
            </Button>

            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Preview Link</Label>
              <p className="text-sm text-muted-foreground mt-1">https://insightfolio.app/shared/dashboard/abc123xyz</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Copy Link
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
