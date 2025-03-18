"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

export function AppointmentCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Example appointments data
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Emily Chen",
      specialty: "Cardiology",
      date: new Date(2023, 10, 28), // Nov 28, 2023
      time: "10:30 AM",
      location: "Heart Care Center, Building A",
    },
    {
      id: 2,
      doctor: "Dr. Sarah Johnson",
      specialty: "Neurology",
      date: new Date(2023, 11, 5), // Dec 5, 2023
      time: "9:15 AM",
      location: "Neurology Clinic, Building B",
    },
  ]

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return appointments.some(
      (appointment) =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear(),
    )
  }

  // Get appointments for selected date
  const appointmentsForSelectedDate = date
    ? appointments.filter(
        (appointment) =>
          appointment.date.getDate() === date.getDate() &&
          appointment.date.getMonth() === date.getMonth() &&
          appointment.date.getFullYear() === date.getFullYear(),
      )
    : []

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              appointment: (date) => isDayWithAppointment(date),
            }}
            modifiersStyles={{
              appointment: {
                fontWeight: "bold",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderRadius: "50%",
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-medium">
          {date ? (
            <>Appointments for {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
          ) : (
            <>Select a date to view appointments</>
          )}
        </h3>

        {appointmentsForSelectedDate.length > 0 ? (
          appointmentsForSelectedDate.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{appointment.doctor}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50">
                      Upcoming
                    </Badge>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No appointments scheduled for this date.</p>
        )}
      </div>
    </div>
  )
}

