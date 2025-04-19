"use client"

// pages/patients.tsx
import type React from "react"
import { useState, useEffect } from "react"
import { Eye, Plus, Calendar, Search, X, FileText, Settings, LogOut, User } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  status: string
  lastVisit: string
  medicalRecords?: MedicalRecord[]
}

interface MedicalRecord {
  id: string
  patientId: string
  date: string
  diagnosis: string
  prescription: string[]
  notes: string
  documents: string[]
}

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "PAT001",
      name: "John Doe",
      age: 32,
      gender: "Male",
      condition: "Hypertension",
      status: "stable",
      lastVisit: "2023-06-10",
      medicalRecords: [],
    },
    {
      id: "PAT002",
      name: "Jane Smith",
      age: 45,
      gender: "Female",
      condition: "Diabetes Type 2",
      status: "improving",
      lastVisit: "2023-06-05",
      medicalRecords: [],
    },
    {
      id: "PAT003",
      name: "Robert Johnson",
      age: 28,
      gender: "Male",
      condition: "Asthma",
      status: "stable",
      lastVisit: "2023-06-15",
      medicalRecords: [],
    },
    {
      id: "PAT004",
      name: "Emily Davis",
      age: 52,
      gender: "Female",
      condition: "Arthritis",
      status: "worsening",
      lastVisit: "2023-06-12",
      medicalRecords: [],
    },
    {
      id: "PAT005",
      name: "Rahul Sharma",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      status: "stable",
      lastVisit: "2023-06-15",
      medicalRecords: [],
    },
    {
      id: "PAT006",
      name: "Priya Patel",
      age: 35,
      gender: "Female",
      condition: "Migraine",
      status: "stable",
      lastVisit: "2023-06-10",
      medicalRecords: [],
    },
    {
      id: "PAT007",
      name: "Amit Kumar",
      age: 28,
      gender: "Male",
      condition: "Allergies",
      status: "improving",
      lastVisit: "2023-05-20",
      medicalRecords: [],
    },
    {
      id: "PAT008",
      name: "Sunita Singh",
      age: 52,
      gender: "Female",
      condition: "Osteoporosis",
      status: "stable",
      lastVisit: "",
      medicalRecords: [],
    },
    {
      id: "PAT009",
      name: "Michael Brown",
      age: 40,
      gender: "Male",
      condition: "Chronic Back Pain",
      status: "worsening",
      lastVisit: "2023-06-08",
      medicalRecords: [],
    },
    {
      id: "PAT010",
      name: "Sophia Wilson",
      age: 30,
      gender: "Female",
      condition: "Anxiety",
      status: "improving",
      lastVisit: "2023-06-14",
      medicalRecords: [],
    },
    {
      id: "PAT011",
      name: "Liam Martinez",
      age: 50,
      gender: "Male",
      condition: "Heart Disease",
      status: "stable",
      lastVisit: "2023-06-11",
      medicalRecords: [],
    },
    {
      id: "PAT012",
      name: "Olivia Garcia",
      age: 27,
      gender: "Female",
      condition: "Thyroid Disorder",
      status: "stable",
      lastVisit: "2023-06-09",
      medicalRecords: [],
    },
    {
      id: "PAT013",
      name: "Noah Rodriguez",
      age: 60,
      gender: "Male",
      condition: "Parkinson's Disease",
      status: "worsening",
      lastVisit: "2023-06-07",
      medicalRecords: [],
    },
    {
      id: "PAT014",
      name: "Emma Hernandez",
      age: 33,
      gender: "Female",
      condition: "PCOS",
      status: "improving",
      lastVisit: "2023-06-13",
      medicalRecords: [],
    },
    {
      id: "PAT015",
      name: "William Lee",
      age: 48,
      gender: "Male",
      condition: "High Cholesterol",
      status: "stable",
      lastVisit: "2023-06-06",
      medicalRecords: [],
    },
    {
      id: "PAT016",
      name: "Isabella Walker",
      age: 36,
      gender: "Female",
      condition: "Depression",
      status: "improving",
      lastVisit: "2023-06-12",
      medicalRecords: [],
    },
    {
      id: "PAT017",
      name: "James Hall",
      age: 55,
      gender: "Male",
      condition: "Kidney Stones",
      status: "stable",
      lastVisit: "2023-06-10",
      medicalRecords: [],
    },
    {
      id: "PAT018",
      name: "Charlotte Allen",
      age: 29,
      gender: "Female",
      condition: "Eczema",
      status: "stable",
      lastVisit: "2023-06-11",
      medicalRecords: [],
    },
    {
      id: "PAT019",
      name: "Benjamin Young",
      age: 42,
      gender: "Male",
      condition: "Sleep Apnea",
      status: "worsening",
      lastVisit: "2023-06-05",
      medicalRecords: [],
    },
    {
      id: "PAT020",
      name: "Mia King",
      age: 38,
      gender: "Female",
      condition: "Fibromyalgia",
      status: "stable",
      lastVisit: "2023-06-09",
      medicalRecords: [],
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRecordAddedToast, setShowRecordAddedToast] = useState(false)

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    condition: "",
    status: "stable",
  })

  const todayDate = new Date().toISOString().split("T")[0]

  const [newMedicalRecord, setNewMedicalRecord] = useState({
    date: todayDate,
    diagnosis: "",
    prescription: [""],
    notes: "",
    documents: [] as string[],
  })

  // Clear medical record form when modal is closed
  useEffect(() => {
    if (!showMedicalRecordModal) {
      setNewMedicalRecord({
        date: todayDate,
        diagnosis: "",
        prescription: [""],
        notes: "",
        documents: [],
      })
    }
  }, [showMedicalRecordModal, todayDate])

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showRecordAddedToast) {
      const timer = setTimeout(() => {
        setShowRecordAddedToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showRecordAddedToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPatient({ ...newPatient, [name]: value })
  }

  const handleMedicalRecordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewMedicalRecord({ ...newMedicalRecord, [name]: value })
  }

  const handleAddMedication = () => {
    setNewMedicalRecord({
      ...newMedicalRecord,
      prescription: [...newMedicalRecord.prescription, ""],
    })
  }

  const handleRemoveMedication = (index: number) => {
    const updatedPrescriptions = [...newMedicalRecord.prescription]
    updatedPrescriptions.splice(index, 1)
    setNewMedicalRecord({
      ...newMedicalRecord,
      prescription: updatedPrescriptions.length ? updatedPrescriptions : [""],
    })
  }

  const handlePrescriptionChange = (index: number, value: string) => {
    const updatedPrescriptions = [...newMedicalRecord.prescription]
    updatedPrescriptions[index] = value
    setNewMedicalRecord({
      ...newMedicalRecord,
      prescription: updatedPrescriptions,
    })
  }

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.condition) {
      alert("Please fill in all required fields")
      return
    }

    const today = new Date().toISOString().split("T")[0]
    const newId = `PAT${String(patients.length + 1).padStart(3, "0")}`

    const patientToAdd = {
      id: newId,
      name: newPatient.name,
      age: Number.parseInt(newPatient.age),
      gender: newPatient.gender,
      condition: newPatient.condition,
      status: newPatient.status,
      lastVisit: today,
      medicalRecords: [],
    }

    setPatients([...patients, patientToAdd])
    setNewPatient({
      name: "",
      age: "",
      gender: "Male",
      condition: "",
      status: "stable",
    })
    setShowAddModal(false)
  }

  const handleAddMedicalRecord = () => {
    if (!selectedPatient || !newMedicalRecord.diagnosis) {
      alert("Please fill in all required fields")
      return
    }

    // Filter out empty prescriptions
    const filteredPrescriptions = newMedicalRecord.prescription.filter((p) => p.trim() !== "")

    // Create a new medical record
    const newRecord: MedicalRecord = {
      id: `REC${Date.now().toString().slice(-6)}`,
      patientId: selectedPatient.id,
      date: newMedicalRecord.date,
      diagnosis: newMedicalRecord.diagnosis,
      prescription: filteredPrescriptions.length ? filteredPrescriptions : [],
      notes: newMedicalRecord.notes,
      documents: newMedicalRecord.documents,
    }

    // Update the patient with the new medical record
    const updatedPatients = patients.map((patient) => {
      if (patient.id === selectedPatient.id) {
        const patientRecords = patient.medicalRecords || []
        return {
          ...patient,
          lastVisit: newMedicalRecord.date,
          medicalRecords: [...patientRecords, newRecord],
        }
      }
      return patient
    })

    setPatients(updatedPatients)
    setShowMedicalRecordModal(false)
    setShowRecordAddedToast(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((file) => file.name)
      setNewMedicalRecord({
        ...newMedicalRecord,
        documents: [...newMedicalRecord.documents, ...fileNames],
      })
    }
  }

  const removeDocument = (index: number) => {
    const updatedDocuments = [...newMedicalRecord.documents]
    updatedDocuments.splice(index, 1)
    setNewMedicalRecord({
      ...newMedicalRecord,
      documents: updatedDocuments,
    })
  }

  const openMedicalRecordModal = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowMedicalRecordModal(true)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-800"
      case "improving":
        return "bg-blue-100 text-blue-800"
      case "worsening":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
      title="My Patients"
      user={doctor}
      notifications={2}
    >
      <div className="min-h-screen p-6 font-sans bg-gradient-to-br from-blue-50 to-indigo-100 font-bold">
        {/* Add custom font */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>

        {/* Success Toast */}
        {showRecordAddedToast && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl z-50 flex items-center backdrop-filter backdrop-blur-sm bg-opacity-90">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Medical record added successfully
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">My Patients</h1>
            <p className="text-indigo-600 font-medium">Manage and view your patients' information</p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
              <input
                type="text"
                placeholder="Search patients..."
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
              Add Patient
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl border border-white/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50/80 border-b border-indigo-100">
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Patient ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Age/Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Condition</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Last Visit</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Records</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-indigo-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b border-indigo-50 hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{patient.id}</td>
                      <td className="px-6 py-4 font-medium">{patient.name}</td>
                      <td className="px-6 py-4">
                        {patient.age} / {patient.gender}
                      </td>
                      <td className="px-6 py-4">{patient.condition}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(patient.status)}`}
                        >
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{patient.lastVisit || "No visits yet"}</td>
                      <td className="px-6 py-4">{patient.medicalRecords?.length || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors shadow-sm">
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors shadow-sm"
                            onClick={() => openMedicalRecordModal(patient)}
                          >
                            <Calendar size={16} />
                            Add Record
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No patients found. Try a different search term or add a new patient.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Patient Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-6 w-full max-w-md border border-white/50">
              <h2 className="text-xl font-bold mb-4 text-indigo-800">Add New Patient</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-indigo-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/80 backdrop-filter backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-indigo-700 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={newPatient.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/80 backdrop-filter backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-indigo-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={newPatient.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/80 backdrop-filter backdrop-blur-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-indigo-700 mb-1">Condition *</label>
                  <input
                    type="text"
                    name="condition"
                    value={newPatient.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/80 backdrop-filter backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-indigo-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newPatient.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white/80 backdrop-filter backdrop-blur-sm"
                  >
                    <option value="stable">Stable</option>
                    <option value="improving">Improving</option>
                    <option value="worsening">Worsening</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors font-bold text-indigo-700"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-bold"
                  onClick={handleAddPatient}
                >
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Medical Record Modal */}
        {showMedicalRecordModal && selectedPatient && (
          <div className="fixed inset-0 bg-black/60 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-indigo-900/90 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-6 w-full max-w-md text-white max-h-[90vh] overflow-y-auto border border-indigo-700/50">
              <h2 className="text-xl font-bold mb-1">Add Medical Record</h2>
              <p className="text-indigo-300 text-sm mb-4">Create a new medical record for {selectedPatient.name}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Patient</label>
                  <div className="w-full px-3 py-2 border border-indigo-700/50 bg-indigo-800/50 rounded-md flex items-center justify-between backdrop-filter backdrop-blur-md">
                    <span className="font-bold">{selectedPatient.name}</span>
                    <span className="text-indigo-300">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Date of Visit</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={newMedicalRecord.date}
                      onChange={handleMedicalRecordChange}
                      className="w-full px-3 py-2 border border-indigo-700/50 bg-indigo-800/50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white backdrop-filter backdrop-blur-md"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Diagnosis</label>
                  <input
                    type="text"
                    name="diagnosis"
                    placeholder="Enter primary diagnosis"
                    value={newMedicalRecord.diagnosis}
                    onChange={handleMedicalRecordChange}
                    className="w-full px-3 py-2 border border-indigo-700/50 bg-indigo-800/50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white backdrop-filter backdrop-blur-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Prescription</label>
                  {newMedicalRecord.prescription.map((prescription, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        placeholder="Add medication with dosage"
                        value={prescription}
                        onChange={(e) => handlePrescriptionChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-indigo-700/50 bg-indigo-800/50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white backdrop-filter backdrop-blur-md"
                      />
                      {newMedicalRecord.prescription.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="ml-2 text-indigo-300 hover:text-red-400"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="flex items-center text-sm text-white bg-indigo-700/50 border border-indigo-600/70 rounded-md px-3 py-1 mt-1 hover:bg-indigo-600/70 transition-colors font-bold"
                  >
                    <Plus size={16} className="mr-1" /> Add Medication
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Clinical Notes</label>
                  <textarea
                    name="notes"
                    placeholder="Enter detailed clinical notes and observations"
                    value={newMedicalRecord.notes}
                    onChange={handleMedicalRecordChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-indigo-700/50 bg-indigo-800/50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white backdrop-filter backdrop-blur-md"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Attach Documents</label>
                  <div className="border border-dashed border-indigo-600/50 rounded-md p-4 text-center backdrop-filter backdrop-blur-sm bg-indigo-800/30">
                    <p className="text-indigo-300 text-sm">Drop files here or click to upload</p>

                    <input type="file" id="file-upload" onChange={handleFileUpload} multiple className="hidden" />

                    <label
                      htmlFor="file-upload"
                      className="mt-2 px-3 py-1 bg-indigo-700/80 text-white text-sm rounded border border-indigo-600/70 hover:bg-indigo-600 inline-block cursor-pointer font-bold transition-colors"
                    >
                      Upload Files
                    </label>
                  </div>

                  {newMedicalRecord.documents.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Uploaded Files:</p>
                      <ul className="space-y-1">
                        {newMedicalRecord.documents.map((doc, index) => (
                          <li key={index} className="text-sm flex justify-between items-center bg-gray-800 p-2 rounded">
                            <span className="truncate">{doc}</span>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  className="flex-1 py-2 border border-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                  onClick={() => setShowMedicalRecordModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
                  onClick={handleAddMedicalRecord}
                >
                  Add Medical Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default PatientsPage

