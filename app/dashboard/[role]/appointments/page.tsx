"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, Clock, FileText, Plus, X, User, Shield, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function AppointmentsPage() {
  const params = useParams()
  const { user, logout } = useAuth()
  const role = params.role as "patient" | "doctor" | "government" | "student"

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

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    window.location.href = "/login"
  }

  // Generate sidebar items based on role
  const getSidebarItems = () => {
    const baseItems = [
      {
        title: "Overview",
        href: `/dashboard/${role}`,
        icon: <FileText className="h-4 w-4" />,
      },
    ]

    // Add role-specific items
    if (role === "patient") {
      return [
        ...baseItems,
        {
          title: "Medical Records",
          href: `/dashboard/${role}/records`,
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Access Control",
          href: `/dashboard/${role}/access`,
          icon: <Shield className="h-4 w-4" />,
        },
        {
          title: "Appointments",
          href: `/dashboard/${role}/appointments`,
          icon: <Calendar className="h-4 w-4" />,
        },
      ]
    } else if (role === "doctor") {
      return [
        ...baseItems,
        {
          title: "Patients",
          href: `/dashboard/${role}/patients`,
          icon: <User className="h-4 w-4" />,
        },
        {
          title: "Appointments",
          href: `/dashboard/${role}/appointments`,
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          title: "Medical Records",
          href: `/dashboard/${role}/medical-records`,
          icon: <FileText className="h-4 w-4" />,
        },
      ]
    } else if (role === "government") {
      return [
        ...baseItems,
        {
          title: "Analytics",
          href: `/dashboard/${role}/analytics`,
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "User Management",
          href: `/dashboard/${role}/users`,
          icon: <User className="h-4 w-4" />,
        },
      ]
    } else if (role === "student") {
      return [
        ...baseItems,
        {
          title: "Datasets",
          href: `/dashboard/${role}/datasets`,
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Projects",
          href: `/dashboard/${role}/projects`,
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Analytics",
          href: `/dashboard/${role}/analytics`,
          icon: <FileText className="h-4 w-4" />,
        },
      ]
    }

    return baseItems
  }

  const sidebarItems = getSidebarItems()

  const sidebarFooterItems = [
    {
      title: "Profile",
      href: `/dashboard/${role}/profile`,
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: `/dashboard/${role}/settings`,
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "#",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Appointments"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole={role}
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
                                      <svg
                                        className="h-4 w-4 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                      <span className="text-sm">Virtual Appointment</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        className="h-4 w-4 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
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
                                  <svg
                                    className="mr-1 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
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

