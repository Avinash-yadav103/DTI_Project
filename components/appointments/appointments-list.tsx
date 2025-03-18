import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

type AppointmentsListProps = {
  type: "upcoming" | "past"
}

export function AppointmentsList({ type }: AppointmentsListProps) {
  const appointments =
    type === "upcoming"
      ? [
          {
            id: 1,
            doctor: "Dr. Emily Chen",
            specialty: "Cardiology",
            date: "Nov 28, 2023",
            time: "10:30 AM",
            location: "Heart Care Center, Building A",
            reason: "Annual heart checkup",
            status: "Confirmed",
          },
          {
            id: 2,
            doctor: "Dr. Sarah Johnson",
            specialty: "Neurology",
            date: "Dec 5, 2023",
            time: "9:15 AM",
            location: "Neurology Clinic, Building B",
            reason: "Follow-up consultation",
            status: "Confirmed",
          },
        ]
      : [
          {
            id: 3,
            doctor: "Dr. Michael Lee",
            specialty: "General Practice",
            date: "Oct 15, 2023",
            time: "2:00 PM",
            location: "Primary Care Clinic, Building C",
            reason: "Regular checkup",
            status: "Completed",
          },
          {
            id: 4,
            doctor: "Dr. Jessica Wong",
            specialty: "Dermatology",
            date: "Sep 22, 2023",
            time: "11:45 AM",
            location: "Dermatology Center, Building D",
            reason: "Skin examination",
            status: "Completed",
          },
        ]

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{appointment.doctor}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <Badge
                    variant={type === "upcoming" ? "outline" : "secondary"}
                    className={type === "upcoming" ? "bg-blue-50" : ""}
                  >
                    {appointment.status}
                  </Badge>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.location}</span>
                  </div>
                  {appointment.reason && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                {type === "upcoming" ? (
                  <>
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Book Again
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

