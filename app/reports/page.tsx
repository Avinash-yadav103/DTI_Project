import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerateReportForm } from "@/components/reports/generate-report-form"
import { ReportsList } from "@/components/reports/reports-list"
import { SavedReports } from "@/components/reports/saved-reports"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and view comprehensive health reports</p>
      </div>

      <Tabs defaultValue="generate">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Health Report</CardTitle>
              <CardDescription>Create a comprehensive report of your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateReportForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <ReportsList />
        </TabsContent>
        <TabsContent value="saved" className="mt-6">
          <SavedReports />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Use pre-configured report templates</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Annual Health Summary</h3>
              <p className="text-sm text-muted-foreground mb-4">Comprehensive yearly health overview</p>
              <Button variant="outline" className="w-full">
                Use Template
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Medication Effectiveness</h3>
              <p className="text-sm text-muted-foreground mb-4">Track how medications affect your metrics</p>
              <Button variant="outline" className="w-full">
                Use Template
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Specialist Report</h3>
              <p className="text-sm text-muted-foreground mb-4">Detailed report for specialist visits</p>
              <Button variant="outline" className="w-full">
                Use Template
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

