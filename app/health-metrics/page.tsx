import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BloodPressureMetrics } from "@/components/health-metrics/blood-pressure-metrics"
import { HeartRateMetrics } from "@/components/health-metrics/heart-rate-metrics"
import { WeightMetrics } from "@/components/health-metrics/weight-metrics"
import { BloodGlucoseMetrics } from "@/components/health-metrics/blood-glucose-metrics"
import { CholesterolMetrics } from "@/components/health-metrics/cholesterol-metrics"
import { AddHealthMetricForm } from "@/components/health-metrics/add-health-metric-form"

export default function HealthMetricsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Health Metrics</h1>
        <p className="text-muted-foreground">Track and monitor your health metrics over time</p>
      </div>

      <Tabs defaultValue="blood-pressure">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="blood-glucose">Blood Glucose</TabsTrigger>
          <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
        </TabsList>
        <TabsContent value="blood-pressure" className="mt-6">
          <BloodPressureMetrics />
        </TabsContent>
        <TabsContent value="heart-rate" className="mt-6">
          <HeartRateMetrics />
        </TabsContent>
        <TabsContent value="weight" className="mt-6">
          <WeightMetrics />
        </TabsContent>
        <TabsContent value="blood-glucose" className="mt-6">
          <BloodGlucoseMetrics />
        </TabsContent>
        <TabsContent value="cholesterol" className="mt-6">
          <CholesterolMetrics />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Add New Measurement</CardTitle>
          <CardDescription>Record a new health metric measurement</CardDescription>
        </CardHeader>
        <CardContent>
          <AddHealthMetricForm />
        </CardContent>
      </Card>
    </div>
  )
}

