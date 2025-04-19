"use client"

// pages/appointments.tsx
import type React from "react"
import { useState, useEffect } from "react"
import { Calendar, User, Plus, Filter, Search, CheckCircle, FileText, Settings, LogOut } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface Doctor {
  id: string
  name: string
  specialty: string
  availableDays: string[]
  color: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  condition: string
}

interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  duration: number // in minutes
  type: string
  status: string
  notes: string
}

const AppointmentsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "DOC001",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      availableDays: ["Monday", "Tuesday", "Wednesday"],
      color: "#4F46E5",
    },
    {
      id: "DOC002",
      name: "Dr. Michael Chen",
      specialty: "Pediatrics",
      availableDays: ["Monday", "Thursday", "Friday"],
      color: "#10B981",
    },
    {
      id: "DOC003",
      name: "Dr. David Rodriguez",
      specialty: "Neurology",
      availableDays: ["Tuesday", "Wednesday", "Friday"],
      color: "#F59E0B",
    },
    {
      id: "DOC004",
      name: "Dr. Emily Wilson",
      specialty: "Dermatology",
      availableDays: ["Monday", "Tuesday", "Thursday"],
      color: "#EC4899",
    },
    {
      id: "DOC005",
      name: "Dr. Rajesh Patel",
      specialty: "Orthopedics",
      availableDays: ["Wednesday", "Thursday", "Friday"],
      color: "#8B5CF6",
    },
  ])

  const [patients, setPatients] = useState<Patient[]>([
    { id: "PAT001", name: "John Doe", age: 32, gender: "Male", condition: "Hypertension" },
    { id: "PAT002", name: "Jane Smith", age: 45, gender: "Female", condition: "Diabetes Type 2" },
    { id: "PAT003", name: "Robert Johnson", age: 28, gender: "Male", condition: "Asthma" },
    { id: "PAT004", name: "Emily Davis", age: 52, gender: "Female", condition: "Arthritis" },
    { id: "PAT005", name: "Rahul Sharma", age: 45, gender: "Male", condition: "Hypertension" },
    { id: "PAT006", name: "Priya Patel", age: 35, gender: "Female", condition: "Migraine" },
    { id: "PAT007", name: "Amit Kumar", age: 28, gender: "Male", condition: "Allergies" },
    { id: "PAT008", name: "Sunita Singh", age: 52, gender: "Female", condition: "Osteoporosis" },
    { id: "PAT009", name: "Michael Brown", age: 40, gender: "Male", condition: "Chronic Back Pain" },
    { id: "PAT010", name: "Sophia Wilson", age: 30, gender: "Female", condition: "Anxiety" },
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT001",
      patientId: "PAT001",
      doctorId: "DOC001",
      date: "2025-04-06",
      time: "09:00",
      duration: 30,
      type: "Checkup",
      status: "Confirmed",
      notes: "Regular blood pressure monitoring",
    },
    {
      id: "APT002",
      patientId: "PAT002",
      doctorId: "DOC001",
      date: "2025-04-06",
      time: "10:00",
      duration: 45,
      type: "Consultation",
      status: "Confirmed",
      notes: "Diabetes management review",
    },
    {
      id: "APT003",
      patientId: "PAT003",
      doctorId: "DOC002",
      date: "2025-04-06",
      time: "11:00",
      duration: 30,
      type: "Checkup",
      status: "Confirmed",
      notes: "Asthma control assessment",
    },
    {
      id: "APT004",
      patientId: "PAT004",
      doctorId: "DOC003",
      date: "2025-04-07",
      time: "09:30",
      duration: 60,
      type: "Treatment",
      status: "Pending",
      notes: "Arthritis pain management",
    },
    {
      id: "APT005",
      patientId: "PAT005",
      doctorId: "DOC001",
      date: "2025-04-07",
      time: "11:30",
      duration: 30,
      type: "Checkup",
      status: "Confirmed",
      notes: "Blood pressure follow-up",
    },
    {
      id: "APT006",
      patientId: "PAT006",
      doctorId: "DOC004",
      date: "2025-04-08",
      time: "10:00",
      duration: 45,
      type: "Consultation",
      status: "Confirmed",
      notes: "Migraine treatment plan",
    },
    {
      id: "APT007",
      patientId: "PAT007",
      doctorId: "DOC002",
      date: "2025-04-08",
      time: "14:00",
      duration: 30,
      type: "Checkup",
      status: "Confirmed",
      notes: "Allergy assessment",
    },
    {
      id: "APT008",
      patientId: "PAT008",
      doctorId: "DOC005",
      date: "2025-04-09",
      time: "09:00",
      duration: 60,
      type: "Treatment",
      status: "Confirmed",
      notes: "Bone density test",
    },
    {
      id: "APT009",
      patientId: "PAT009",
      doctorId: "DOC005",
      date: "2025-04-09",
      time: "13:00",
      duration: 45,
      type: "Treatment",
      status: "Pending",
      notes: "Back pain therapy session",
    },
    {
      id: "APT010",
      patientId: "PAT010",
      doctorId: "DOC004",
      date: "2025-04-10",
      time: "11:00",
      duration: 45,
      type: "Consultation",
      status: "Confirmed",
      notes: "Anxiety management discussion",
    },
  ])

  const [selectedDate, setSelectedDate] = useState<string>("2025-04-06")
  const [selectedView, setSelectedView] = useState<"day" | "week" | "month">("day")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showConfirmationToast, setShowConfirmationToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>("")

  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, "id">>({
    patientId: "",
    doctorId: "",
    date: selectedDate,
    time: "09:00",
    duration: 30,
    type: "Checkup",
    status: "Pending",
    notes: "",
  })

  // Update new appointment date when selected date changes
  useEffect(() => {
    setNewAppointment((prev) => ({ ...prev, date: selectedDate }))
  }, [selectedDate])

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showConfirmationToast) {
      const timer = setTimeout(() => {
        setShowConfirmationToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfirmationToast])

  // Reset form when modal closes
  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      setNewAppointment({
        patientId: "",
        doctorId: "",
        date: selectedDate,
        time: "09:00",
        duration: 30,
        type: "Checkup",
        status: "Pending",
        notes: "",
      })
      setSelectedAppointment(null)
    }
  }, [showAddModal, showEditModal, selectedDate])

  // Generate time slots for scheduling (8:00 AM to 5:00 PM)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAppointment({ ...newAppointment, [name]: value })
  }

  const handleAddAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      alert("Please fill in all required fields")
      return
    }

    // Check for time conflicts with existing appointments
    const existingAppointments = appointments.filter(
      (app) => app.doctorId === newAppointment.doctorId && app.date === newAppointment.date,
    )

    const hasConflict = existingAppointments.some((app) => {
      const existingStart = Number.parseInt(app.time.replace(":", ""))
      const existingEnd = existingStart + (app.duration / 30) * 50
      const newStart = Number.parseInt(newAppointment.time.replace(":", ""))
      const newEnd = newStart + (newAppointment.duration / 30) * 50

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    })

    if (hasConflict) {
      alert("There is a scheduling conflict with an existing appointment. Please select a different time.")
      return
    }

    const newId = `APT${String(appointments.length + 1).padStart(3, "0")}`
    const appointmentToAdd = { id: newId, ...newAppointment }

    setAppointments([...appointments, appointmentToAdd])
    setShowAddModal(false)
    setToastMessage("Appointment scheduled successfully")
    setShowConfirmationToast(true)
  }

  const handleEditAppointment = () => {
    if (!selectedAppointment) return

    const updatedAppointments = appointments.map((app) =>
      app.id === selectedAppointment.id ? { ...app, ...newAppointment, id: app.id } : app,
    )

    setAppointments(updatedAppointments)
    setShowEditModal(false)
    setToastMessage("Appointment updated successfully")
    setShowConfirmationToast(true)
  }

  const openEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setNewAppointment({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    })
    setShowEditModal(true)
  }

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(appointments.filter((app) => app.id !== id))
      setToastMessage("Appointment cancelled successfully")
      setShowConfirmationToast(true)
    }
  }

  const getPatientById = (id: string) => {
    return patients.find((patient) => patient.id === id)
  }

  const getDoctorById = (id: string) => {
    return doctors.find((doctor) => doctor.id === id)
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Filter by date
    filtered = filtered.filter((app) => app.date === selectedDate)

    // Filter by doctor
    if (selectedDoctor !== "all") {
      filtered = filtered.filter((app) => app.doctorId === selectedDoctor)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((app) => {
        const patient = getPatientById(app.patientId)
        const doctor = getDoctorById(app.doctorId)

        return (
          patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Sort by time
    return filtered.sort((a, b) => a.time.localeCompare(b.time))
  }

  const filteredAppointments = filterAppointments()

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAppointmentTypeClass = (type: string) => {
    switch (type) {
      case "Checkup":
        return "bg-indigo-100 text-indigo-800"
      case "Consultation":
        return "bg-purple-100 text-purple-800"
      case "Treatment":
        return "bg-cyan-100 text-cyan-800"
      case "Surgery":
        return "bg-pink-100 text-pink-800"
      case "Emergency":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextAvailableSlots = () => {
    const availableSlots = []
    const today = new Date()

    // Check next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const dateStr = date.toISOString().split("T")[0]
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" })

      // For each doctor
      doctors.forEach((doctor) => {
        if (doctor.availableDays.includes(dayOfWeek)) {
          // Find booked slots
          const doctorAppointments = appointments.filter((app) => app.doctorId === doctor.id && app.date === dateStr)

          const bookedTimes = doctorAppointments.map((app) => app.time)

          // Find first available slot
          for (const time of timeSlots) {
            if (!bookedTimes.includes(time)) {
              availableSlots.push({
                doctor,
                date: dateStr,
                dayOfWeek,
                time,
              })
              break // Only add the first available time for this doctor on this day
            }
          }
        }
      })
    }

    return availableSlots.slice(0, 5) // Return the next 5 available slots
  }

  const nextAvailableSlots = getNextAvailableSlots()

  // Navigate to previous day
  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() - 1)
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  // Navigate to next day
  const goToNextDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + 1)
    setSelectedDate(currentDate.toISOString().split("T")[0])
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
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Patients",
      href: "/dashboard/doctor/patients",
      icon: <User className="h-4 w-4" />,
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

  const doctor = {
    name: "Dr. Sarah Johnson",
    id: "DOC-5678-1234",
    specialty: "General Physician",
    hospital: "City General Hospital",
    email: "sarah.johnson@cityhospital.com",
    phone: "+91 9876543210",
    photo: "/placeholder.svg?height=40&width=40",
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Appointments"
      user={doctor}
      notifications={2}
    >
      <div className="min-h-screen p-6 font-sans bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Add custom font */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>

        {/* Success Toast */}
        {showConfirmationToast && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl z-50 flex items-center backdrop-filter backdrop-blur-sm bg-opacity-90">
            <CheckCircle className="w-5 h-5 mr-2" />
            {toastMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">Appointments</h1>
            <p className="text-indigo-600 font-medium">Manage doctor schedules and patient appointments</p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/70 backdrop-filter backdrop-blur-lg shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md font-bold"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} />
              Schedule Appointment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar and Appointments Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Date Navigation and Filters */}
            <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 p-4">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    onClick={goToPreviousDay}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400"
                      size={18}
                    />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                    />
                  </div>

                  <button
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    onClick={goToNextDay}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <span className="text-indigo-800 font-bold px-2">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-indigo-200 rounded-lg overflow-hidden shadow-sm">
                    <button
                      className={`px-3 py-1 ${selectedView === "day" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700"}`}
                      onClick={() => setSelectedView("day")}
                    >
                      Day
                    </button>
                    <button
                      className={`px-3 py-1 ${selectedView === "week" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700"}`}
                      onClick={() => setSelectedView("week")}
                    >
                      Week
                    </button>
                    <button
                      className={`px-3 py-1 ${selectedView === "month" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700"}`}
                      onClick={() => setSelectedView("month")}
                    >
                      Month
                    </button>
                  </div>

                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={16} />
                    <select
                      className="pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-sm"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                    >
                      <option value="all">All Doctors</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Timeline */}
            <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 overflow-hidden">
              <div className="p-4 bg-indigo-50/80 border-b border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-800">Daily Schedule</h2>
              </div>

              <div className="p-4">
                {filteredAppointments.length > 0 ? (
                  <div className="relative">
                    {/* Time indicators */}
                    <div className="absolute top-0 bottom-0 left-0 w-16 border-r border-indigo-100">
                      {timeSlots.map((time, index) => (
                        <div
                          key={index}
                          className="h-16 flex items-center justify-center text-sm text-indigo-500 font-medium"
                        >
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Doctor columns */}
                    <div className="ml-16 flex">
                      {(selectedDoctor === "all" ? doctors : doctors.filter((doc) => doc.id === selectedDoctor)).map(
                        (doctor) => (
                          <div
                            key={doctor.id}
                            className="flex-1 min-w-[200px] border-r border-indigo-100 last:border-r-0"
                          >
                            <div
                              className="h-12 border-b border-indigo-100 flex items-center justify-center font-bold text-sm"
                              style={{ color: doctor.color }}
                            >
                              {doctor.name}
                            </div>

                            <div className="relative h-[1120px]">
                              {" "}
                              {/* 18 time slots * 64px = 1152px */}
                              {filteredAppointments
                                .filter((app) => app.doctorId === doctor.id)
                                .map((appointment) => {
                                  const startHour = Number.parseInt(appointment.time.split(":")[0])
                                  const startMinute = Number.parseInt(appointment.time.split(":")[1])
                                  const startPosition = (startHour - 8) * 64 + (startMinute / 30) * 32 // 64px per hour, 32px per 30min
                                  const height = (appointment.duration / 30) * 32 // height based on duration
                                  const patient = getPatientById(appointment.patientId)

                                  return (
                                    <div
                                      key={appointment.id}
                                      className="absolute left-1 right-1 rounded-lg p-2 shadow-md border-l-4 cursor-pointer transition-transform hover:scale-[1.02]"
                                      style={{
                                        top: `${startPosition}px`,
                                        height: `${height}px`,
                                        borderLeftColor: doctor.color,
                                        backgroundColor: `${doctor.color}20`, // 20% opacity
                                      }}
                                      onClick={() => openEditModal(appointment)}
                                    >
                                      <div className="flex flex-col h-full justify-between overflow-hidden">
                                        <div>
                                          <div className="font-bold text-sm truncate">{patient?.name}</div>
                                          <div className="text-xs truncate">
                                            {appointment.time} - {(() => {
                                              const [h, m] = appointment.time.split(":").map(Number)
                                              const totalMinutes = h * 60 + m + appointment.duration
                                              const newHour = Math.floor(totalMinutes / 60)
                                              const newMinutes = totalMinutes % 60
                                              return `${newHour.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
                                            })()}
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                          <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${getAppointmentTypeClass(appointment.type)}`}
                                          >
                                            {appointment.type}
                                          </span>
                                          <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}
                                          >
                                            {appointment.status}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              {/* Time slot grid lines */}
                              {timeSlots.map((_, index) => (
                                <div
                                  key={index}
                                  className="absolute left-0 right-0 border-t border-indigo-50"
                                  style={{ top: `${index * 32}px`, height: "32px" }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-indigo-400">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No appointments scheduled for this date</p>
                    <button
                      className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                      onClick={() => setShowAddModal(true)}
                    >
                      Schedule an appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 p-4">
              <h2 className="text-lg font-bold text-indigo-800 mb-3">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  className="w-full flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={18} />
                  New Appointment
                </button>
                <button className="w-full flex items-center gap-2 bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  <Calendar size={18} />
                  View Full Calendar
                </button>
              </div>
            </div>

            {/* Next Available Slots */}
            <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-md border border-white/50 p-4">
              <h2 className="text-lg font-bold text-indigo-800 mb-3">Next Available Slots</h2>
              <ul className="space-y-3">
                {nextAvailableSlots.length > 0 ? (
                  nextAvailableSlots.map((slot, index) => (
                    <li key={index} className="flex items-center gap-3 bg-indigo-50/80 p-3 rounded-lg shadow-sm">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-indigo-800">{slot.doctor.name}</p>
                        <p className="text-xs text-indigo-600">
                          {slot.dayOfWeek}, {slot.date}
                        </p>
                        <p className="text-xs text-indigo-600">Time: {slot.time}</p>
                      </div>
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                        onClick={() => {
                          setNewAppointment({
                            ...newAppointment,
                            doctorId: slot.doctor.id,
                            date: slot.date,
                            time: slot.time,
                          })
                          setShowAddModal(true)
                        }}
                      >
                        Book
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-indigo-400">No available slots in the next 7 days</p>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Add Appointment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
            {/* Modal content */}
            {/* ...existing modal code... */}
          </div>
        )}

        {/* Edit Appointment Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
            {/* Modal content */}
            {/* ...existing modal code... */}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AppointmentsPage

