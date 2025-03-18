import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BloodGlucoseChart } from "@/components/charts/blood-glucose-chart"

export function BloodGlucoseMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Blood Glucose</h2>
          <p className="text-sm text-muted-foreground">Track your blood glucose levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Blood Glucose Trends</CardTitle>
            <CardDescription>Blood glucose levels over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BloodGlucoseChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Latest blood glucose reading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">
                98 <span className="text-xl font-normal">mg/dL</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Measured on Nov 18, 2023</p>
              <p className="text-sm font-medium mt-1 px-2 py-1 bg-green-100 text-green-800 rounded-full">Normal</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fasting Glucose</span>
                <span className="font-medium">98 mg/dL</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "45%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Normal</span>
                <span>Pre-diabetic</span>
                <span>Diabetic</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium">Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average</span>
                  <span>102 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum</span>
                  <span>92 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maximum</span>
                  <span>118 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variance</span>
                  <span>±8 mg/dL</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

