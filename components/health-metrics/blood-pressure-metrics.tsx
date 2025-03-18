import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BloodPressureChart } from "@/components/charts/blood-pressure-chart"
import { BloodPressureTable } from "@/components/health-metrics/blood-pressure-table"

export function BloodPressureMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Blood Pressure</h2>
          <p className="text-sm text-muted-foreground">Track your systolic and diastolic blood pressure</p>
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
            <CardTitle>Blood Pressure Trends</CardTitle>
            <CardDescription>Systolic and diastolic measurements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BloodPressureChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Latest blood pressure reading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">120/80</div>
              <p className="text-sm text-muted-foreground mt-1">Measured on Nov 18, 2023</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Systolic</span>
                <span className="font-medium">120 mmHg</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "60%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Diastolic</span>
                <span className="font-medium">80 mmHg</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "50%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BloodPressureTable />
    </div>
  )
}

