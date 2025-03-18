import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
        <Button size="sm">Book New</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Dr. Emily Chen</h3>
              <p className="text-sm text-muted-foreground">Cardiology</p>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              Upcoming
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>Nov 28, 2023</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>10:30 AM</span>
          </div>
          <p className="text-sm mb-2">Annual heart checkup</p>
          <div className="flex justify-end">
            <Button variant="link" size="sm" className="h-auto p-0">
              Manage appointment
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Dr. Sarah Johnson</h3>
              <p className="text-sm text-muted-foreground">Neurology</p>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              Upcoming
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>Dec 5, 2023</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>9:15 AM</span>
          </div>
          <div className="flex justify-end">
            <Button variant="link" size="sm" className="h-auto p-0">
              Manage appointment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

