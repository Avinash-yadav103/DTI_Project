import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Heart } from "lucide-react"
import { BloodPressureChart } from "@/components/charts/blood-pressure-chart"

export function HealthMetricsPreview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Health Metrics</CardTitle>
        <Button variant="link" asChild>
          <Link href="/health-metrics">View details</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Blood Pressure</span>
                </div>
                <div className="text-2xl font-bold">120/80</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Heart Rate</span>
                </div>
                <div className="text-2xl font-bold">
                  68 <span className="text-sm font-normal text-muted-foreground">bpm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-[150px]">
          <BloodPressureChart />
        </div>
      </CardContent>
    </Card>
  )
}

