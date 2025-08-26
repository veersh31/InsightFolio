import { DashboardHeader } from "@/components/dashboard-header"
import { AlertManagement } from "@/components/alert-management"
import { UserPreferences } from "@/components/user-preferences"
import { ExportDashboard } from "@/components/export-dashboard"
import { PersonalizedDashboard } from "@/components/personalized-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your dashboard preferences and account settings</p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-6">
            <UserPreferences />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertManagement />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <PersonalizedDashboard />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
