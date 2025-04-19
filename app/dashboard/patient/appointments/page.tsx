"use client"

import { useState } from "react"
import { Calendar, Clock, FileText, Plus, Video, MapPin, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [cancelingId, setCancelingId] = useState<number | null>(null)

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "General Physician",
      hospital: "City General Hospital",
      date: "2023-06-25",
      time: "10:00 AM",
      status: "upcoming",
      type: "In-person",
      address: "123 Medical Plaza, City Center",
      notes: "Annual check-up appointment",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Cardiologist",
      hospital: "Medical Research Institute",
      date: "2023-07-05",
      time: "2:30 PM",
      status: "upcoming",
      type: "Virtual",
      meetingLink: "https://meet.healthcare.com/dr-chen",
      notes: "Follow-up on recent test results",
    },
    {
      id: 3,
      doctor: "Dr. Emily Wong",
      specialty: "Dermatologist",
      hospital: "City General Hospital",
      date: "2023-05-15",
      time: "11:15 AM",
      status: "completed",
      type: "In-person",
      address: "123 Medical Plaza, City Center",
      notes: "Skin condition assessment",
      summary: "Diagnosed with contact dermatitis. Prescribed topical corticosteroid cream.",
    },
    {
      id: 4,
      doctor: "Dr. Robert Miller",
      specialty: "Neurologist",
      hospital: "Neuroscience Center",
      date: "2023-04-22",
      time: "9:30 AM",
      status: "completed",
      type: "Virtual",
      meetingLink: "https://meet.healthcare.com/dr-miller",
      notes: "Headache consultation",
      summary:
        "Diagnosed with tension headaches. Recommended stress management techniques and prescribed pain relievers.",
    },
    {
      id: 5,
      doctor: "Dr. Lisa Patel",
      specialty: "Endocrinologist",
      hospital: "Diabetes Care Center",
      date: "2023-03-10",
      time: "3:45 PM",
      status: "canceled",
      type: "In-person",
      address: "456 Specialist Avenue, Westside",
      notes: "Diabetes management check-up",
      cancelReason: "Doctor unavailable due to emergency",
    },
  ]

  const handleCancelAppointment = (id: number) => {
    setCancelingId(id)
    setTimeout(() => {
      toast.success("Appointment canceled successfully")
      setCancelingId(null)
    }, 1000)
  }

  const handleRescheduleAppointment = (id: number) => {
    toast.success("Redirecting to reschedule page")
  }

  const handleJoinVirtual = (link: string) => {
    window.open(link, "_blank")
    toast.success("Joining virtual appointment")
  }

  const handleBookAppointment = () => {
    toast.success("Redirecting to appointment booking page")
  }

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/patient",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Access Control",
      href: "/dashboard/patient/access",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/patient/appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Access Logs",
      href: "/dashboard/patient/logs",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/patient/settings",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Appointments"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">Appointments</CardTitle>
              <CardDescription>Manage your healthcare appointments</CardDescription>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleBookAppointment}>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
                <div className="space-y-4">
                  {appointments.filter((a) => a.status === "upcoming").length > 0 ? (
                    appointments
                      .filter((a) => a.status === "upcoming")
                      .map((appointment) => (
                        <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                                  <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{appointment.doctor}</h4>
                                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-1/4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {appointment.date}, {appointment.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {appointment.type === "Virtual" ? (
                                    <>
                                      <Video className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">Virtual Appointment</span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">{appointment.hospital}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="md:w-1/4">
                              <p className="text-sm text-gray-700">
                                <span className="text-gray-500">Notes: </span>
                                {appointment.notes}
                              </p>
                            </div>

                            <div className="md:w-1/4 flex items-center justify-end gap-2">
                              {appointment.type === "Virtual" && (
                                <Button
                                  className="bg-sky-600 hover:bg-sky-700"
                                  onClick={() => handleJoinVirtual(appointment.meetingLink)}
                                >
                                  <Video className="mr-1 h-4 w-4" />
                                  Join
                                </Button>
                              )}
                              <Button variant="outline" onClick={() => handleRescheduleAppointment(appointment.id)}>
                                Reschedule
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                disabled={cancelingId === appointment.id}
                              >
                                {cancelingId === appointment.id ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Upcoming Appointments</h3>
                      <p className="text-gray-600 mt-1">You don't have any upcoming appointments scheduled.</p>
                      <Button className="mt-4 bg-sky-600 hover:bg-sky-700" onClick={handleBookAppointment}>
                        Book an Appointment
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Past Appointments</h3>
                <div className="space-y-4">
                  {appointments.filter((a) => a.status === "completed").length > 0 ? (
                    appointments
                      .filter((a) => a.status === "completed")
                      .map((appointment) => (
                        <div key={appointment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                                  <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{appointment.doctor}</h4>
                                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-1/4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {appointment.date}, {appointment.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-2/4">
                              <p className="text-sm text-gray-700">
                                <span className="text-gray-500">Summary: </span>
                                {appointment.summary}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Past Appointments</h3>
                      <p className="text-gray-600 mt-1">You don't have any past appointments in your history.</p>
                    </div>
                  )}
                </div>
              </div>

              {appointments.filter((a) => a.status === "canceled").length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Canceled Appointments</h3>
                  <div className="space-y-4">
                    {appointments
                      .filter((a) => a.status === "canceled")
                      .map((appointment) => (
                        <div key={appointment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                                  <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{appointment.doctor}</h4>
                                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-1/4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {appointment.date}, {appointment.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-red-100 text-red-800">Canceled</Badge>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-2/4">
                              <p className="text-sm text-gray-700">
                                <span className="text-gray-500">Reason: </span>
                                {appointment.cancelReason}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

