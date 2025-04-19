"use client"

import { useState, useEffect, useRef } from "react"
import {
  FileText,
  Users,
  Calendar,
  Settings,
  LogOut,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Home,
  PlusCircle,
  User,
  Copy,
  Video,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@/context/UserContext";

// Update the sidebar items and footer items to handle logout properly
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("patients")
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false)
  const [isViewScheduleOpen, setIsViewScheduleOpen] = useState(false)
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(3)
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    condition: "",
    status: "stable",
    lastVisit: new Date().toISOString().split("T")[0],
  })
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    patientName: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    type: "Consultation",
    notes: "",
  })

  const { user: loggedInUser } = useUser();
  console.log("Logged in user:", loggedInUser);
  
  const [currentMeetingLink, setCurrentMeetingLink] = useState("")
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const meetLinkRef = useRef(null)

  // Format today's date for comparison
  const today = new Date().toISOString().split("T")[0]

  // Mock data
  const doctor = {
    name: "Dr. Sarah Johnson",
    id: "DOC-5678-1234",
    specialty: "General Physician",
    hospital: "City General Hospital",
    email: "sarah.johnson@cityhospital.com",
    phone: "+91 9876543210",
    photo: "/placeholder.svg?height=40&width=40",
  }

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 32,
      gender: "Male",
      lastVisit: "2023-06-10",
      condition: "Hypertension",
      status: "stable",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 45,
      gender: "Female",
      lastVisit: "2023-06-05",
      condition: "Diabetes Type 2",
      status: "improving",
    },
    {
      id: 3,
      name: "Robert Johnson",
      age: 28,
      gender: "Male",
      lastVisit: "2023-06-15",
      condition: "Asthma",
      status: "stable",
    },
    {
      id: 4,
      name: "Emily Davis",
      age: 52,
      gender: "Female",
      lastVisit: "2023-06-12",
      condition: "Arthritis",
      status: "worsening",
    },
  ])

  const accessRequests = [
    {
      id: 1,
      patientName: "Michael Brown",
      patientId: "HLTH-9876-5432",
      requestedOn: "2023-06-15",
      status: "pending",
    },
    {
      id: 2,
      patientName: "Sarah Wilson",
      patientId: "HLTH-8765-4321",
      requestedOn: "2023-06-14",
      status: "pending",
    },
  ]

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      patientId: "HLTH-1234-5678",
      date: today,
      time: "10:00 AM",
      status: "upcoming",
      type: "Follow-up",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientId: "HLTH-2345-6789",
      date: today,
      time: "11:30 AM",
      status: "upcoming",
      type: "Consultation",
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      patientId: "HLTH-3456-7890",
      date: today,
      time: "09:15 AM",
      status: "upcoming",
      type: "Check-up",
    },
  ])

  // Get today's appointments
  const todayAppointments = appointments.filter((appointment) => appointment.date === today)

  // Update today's appointment count when appointments change
  useEffect(() => {
    const count = appointments.filter((appointment) => appointment.date === today).length
    setTodayAppointmentsCount(count)
  }, [appointments, today])

  const handleViewPatient = (id) => {
    toast.success(`Viewing patient ${id}`)
  }

  const handleApproveAccess = (id) => {
    toast.success("Access request approved")
  }

  const handleRejectAccess = (id) => {
    toast.success("Access request rejected")
  }

  const handleAddPatient = () => {
    // Form validation
    if (!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.condition) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new patient with ID
    const newPatientWithId = {
      ...newPatient,
      id: patients.length + 1,
      age: Number.parseInt(newPatient.age),
    }

    // Add to patients array
    setPatients([...patients, newPatientWithId])

    // Reset form and close dialog
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      condition: "",
      status: "stable",
      lastVisit: new Date().toISOString().split("T")[0],
    })
    setIsAddPatientOpen(false)

    // Show success message
    toast.success(`Patient ${newPatient.name} added successfully`)
  }

  const handleScheduleAppointment = () => {
    // Form validation
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.time || !newAppointment.type) {
      toast.error("Please fill in all required fields")
      return
    }

    // Create new appointment with ID
    const newAppointmentWithId = {
      ...newAppointment,
      id: appointments.length + 1,
      status: "upcoming",
      patientName:
        patients.find((p) => p.id.toString() === newAppointment.patientId)?.name || newAppointment.patientName,
      time: formatTime(newAppointment.time),
    }

    // Add to appointments array
    setAppointments([...appointments, newAppointmentWithId])

    // Reset form and close dialog
    setNewAppointment({
      patientId: "",
      patientName: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      type: "Consultation",
      notes: "",
    })
    setIsScheduleAppointmentOpen(false)

    // Show success message
    toast.success(`Appointment scheduled successfully`)
  }

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":")
    const period = Number.parseInt(hours) >= 12 ? "PM" : "AM"
    const hour12 = Number.parseInt(hours) % 12 || 12
    return `${hour12}:${minutes} ${period}`
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewPatient({
      ...newPatient,
      [name]: value,
    })
  }

  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setNewPatient({
      ...newPatient,
      [name]: value,
    })
  }

  const handleAppointmentSelectChange = (name, value) => {
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    })
  }

  const generateMeetLink = () => {
    const meetId = Math.random().toString(36).substring(2, 12)
    return `https://meet.google.com/${meetId}`
  }

  const handleStartSession = (appointment) => {
    const meetLink = generateMeetLink()
    setCurrentMeetingLink(meetLink)
    setCurrentAppointment(appointment)
    setIsMeetingModalOpen(true)

    // Open the meeting in a new tab
    window.open(meetLink, "_blank")
  }

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(currentMeetingLink)
    toast.success("Meeting link copied to clipboard")
  }

  const shareWithPatient = () => {
    // In a real application, this would send the link via SMS, email, or notification
    toast.success(`Meeting link shared with ${currentAppointment?.patientName}`)
  }

  // Inside the component:
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard/doctor",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Patients",
      href: "/dashboard/doctor/patients",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/doctor/appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/doctor/medical-records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/doctor/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/doctor/settings",
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
      title="Doctor Dashboard"
      user={doctor}
      notifications={2}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayAppointmentsCount}</div>
            <div className="text-sm text-gray-600 mt-1">Scheduled for today</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsViewScheduleOpen(true)}>
              View Schedule
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Access Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <div className="text-sm text-gray-600 mt-1">Pending requests</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setActiveTab("records")}>
              Review Requests
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{patients.length}</div>
            <div className="text-sm text-gray-600 mt-1">Under your care</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setActiveTab("patients")}>
              View All Patients
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="patients" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Access Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>My Patients</CardTitle>
                  <CardDescription>Manage and view your patients' information</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      placeholder="Search patients..."
                      className="pl-9 border border-gray-300 rounded-md h-10 w-full text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={() => setIsAddPatientOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Age/Gender</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Condition</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Visit</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{patient.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {patient.age} / {patient.gender}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{patient.condition}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`
                            ${
                              patient.status === "stable"
                                ? "bg-green-100 text-green-600"
                                : patient.status === "improving"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                            }
                          `}
                          >
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{patient.lastVisit}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleViewPatient(patient.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled appointments for the next few days</CardDescription>
                </div>
                <Button
                  className="bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => setIsScheduleAppointmentOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">{appointment.patientName}</h3>
                          <p className="text-xs text-gray-600">ID: {appointment.patientId}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {appointment.date}, {appointment.time} • {appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 bg-sky-600 hover:bg-sky-700 text-white"
                          onClick={() => handleStartSession(appointment)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Start Session
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
              <CardDescription>Patients requesting access to their medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
                  <div className="space-y-4">
                    {accessRequests.map((request) => (
                      <div key={request.id} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-medium">{request.patientName}</h4>
                            <p className="text-xs text-gray-600">ID: {request.patientId}</p>
                            <p className="text-xs text-amber-600 mt-1">Requested on {request.requestedOn}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                              onClick={() => handleRejectAccess(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 bg-sky-600 hover:bg-sky-700 text-white"
                              onClick={() => handleApproveAccess(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Enter patient details to add them to your care list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={newPatient.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="35"
                  value={newPatient.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={newPatient.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="condition">Medical Condition</Label>
              <Input
                id="condition"
                name="condition"
                placeholder="Hypertension, Diabetes, etc."
                value={newPatient.condition}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Current Status</Label>
              <Select value={newPatient.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="improving">Improving</SelectItem>
                  <SelectItem value="worsening">Worsening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleAddPatient}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Dialog */}
      <Dialog open={isScheduleAppointmentOpen} onOpenChange={setIsScheduleAppointmentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Fill in the details to schedule a new patient appointment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patientId">Select Patient</Label>
              <Select
                value={newAppointment.patientId}
                onValueChange={(value) => handleAppointmentSelectChange("patientId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={handleAppointmentInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={handleAppointmentInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={newAppointment.type}
                onValueChange={(value) => handleAppointmentSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Check-up">Check-up</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Add any additional information"
                value={newAppointment.notes}
                onChange={handleAppointmentInputChange}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsScheduleAppointmentOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleScheduleAppointment}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog open={isViewScheduleOpen} onOpenChange={setIsViewScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Today's Schedule</DialogTitle>
            <DialogDescription>Your appointments scheduled for {new Date().toLocaleDateString()}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments
                  .sort((a, b) => {
                    // Convert time to 24h format for sorting
                    const getTimeValue = (timeStr) => {
                      const [time, period] = timeStr.split(" ")
                      let [hours, minutes] = time.split(":").map(Number)
                      if (period === "PM" && hours < 12) hours += 12
                      if (period === "AM" && hours === 12) hours = 0
                      return hours * 60 + minutes
                    }
                    return getTimeValue(a.time) - getTimeValue(b.time)
                  })
                  .map((appointment) => (
                    <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{appointment.time}</span>
                            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                              {appointment.type}
                            </Badge>
                          </div>
                          <h3 className="text-sm font-medium mt-1">{appointment.patientName}</h3>
                          <p className="text-xs text-gray-600">ID: {appointment.patientId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewScheduleOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Modal */}
      <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Virtual Meeting Started</DialogTitle>
            <DialogDescription>
              Your appointment with {currentAppointment?.patientName} is now live
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Video className="h-6 w-6" />
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
              <input
                ref={meetLinkRef}
                readOnly
                value={currentMeetingLink}
                className="bg-transparent border-none outline-none flex-1 text-sm"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={copyMeetingLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-sm text-gray-500 mt-4 mb-2">Share this link with your patient:</p>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white" 
                onClick={shareWithPatient}
              >
                Share with Patient
              </Button>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsMeetingModalOpen(false)}>
              Close
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white" 
              onClick={() => window.open(currentMeetingLink, '_blank')}
            >
              Rejoin Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

