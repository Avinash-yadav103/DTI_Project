import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentsList } from "@/components/appointments/appointments-list"
import { AppointmentCalendarView } from "@/components/appointments/appointment-calendar-view"
import { BookAppointmentForm } from "@/components/appointments/book-appointment-form"

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button>Book New Appointment</Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <AppointmentsList type="upcoming" />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <AppointmentsList type="past" />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <AppointmentCalendarView />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <BookAppointmentForm />
        </CardContent>
      </Card>
    </div>
  )
}

