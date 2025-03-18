import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CholesterolChart } from "@/components/charts/cholesterol-chart"

export function CholesterolMetrics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Cholesterol</h2>
          <p className="text-sm text-muted-foreground">Track your cholesterol levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="1year">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="2years">Last 2 Years</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cholesterol Trends</CardTitle>
            <CardDescription>HDL, LDL, and Total Cholesterol over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <CholesterolChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Latest cholesterol readings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Cholesterol</span>
                  <span className="font-medium">185 mg/dL</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "60%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Optimal</span>
                  <span>Borderline</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>LDL (Bad) Cholesterol</span>
                  <span className="font-medium">110 mg/dL</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "55%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Optimal</span>
                  <span>Borderline</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>HDL (Good) Cholesterol</span>
                  <span className="font-medium">55 mg/dL</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Optimal</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Triglycerides</span>
                  <span className="font-medium">120 mg/dL</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "40%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Normal</span>
                  <span>Borderline</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Last measured: Oct 10, 2023</p>
              <p className="mt-1">Next test recommended: Apr 10, 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

