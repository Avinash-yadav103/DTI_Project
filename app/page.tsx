import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Calendar, Upload, UserRound } from "lucide-react"
import { PatientInfo } from "@/components/patient-info"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { GenerateReport } from "@/components/generate-report"
import { HealthMetricsPreview } from "@/components/health-metrics-preview"
import { YourPhysicians } from "@/components/your-physicians"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PatientInfo />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Schedule Appointment</CardTitle>
              <CardDescription>Book your next visit</CardDescription>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Upload Document</CardTitle>
              <CardDescription>Add new medical records</CardDescription>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserRound className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Update Profile</CardTitle>
              <CardDescription>Edit your information</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingAppointments />
        <GenerateReport />
      </div>

      <HealthMetricsPreview />

      <YourPhysicians />
    </div>
  )
}

