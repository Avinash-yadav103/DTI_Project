import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WeightChart } from "@/components/charts/weight-chart"

export function WeightMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Weight</h2>
          <p className="text-sm text-muted-foreground">Track your weight measurements</p>
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
            <CardTitle>Weight Trends</CardTitle>
            <CardDescription>Weight measurements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <WeightChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Latest weight measurement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">
                175 <span className="text-xl font-normal">lbs</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Measured on Nov 15, 2023</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>BMI</span>
                <span className="font-medium">24.8</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium">Statistics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Starting</span>
                  <span>182 lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Change</span>
                  <span className="text-green-600">-7 lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal</span>
                  <span>170 lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span>5 lbs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

