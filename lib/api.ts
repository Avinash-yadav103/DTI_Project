// This file contains mock API functions for the dashboard
// In a real app, these would be actual API calls to your backend

import { toast } from "sonner"

// Generic delay function to simulate API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data for patients
export const patients = [
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
]

// Mock data for access requests
export const accessRequests = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    hospital: "City General Hospital",
    requestedOn: "2023-06-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    hospital: "Medical Research Institute",
    requestedOn: "2023-06-10",
    status: "approved",
  },
  {
    id: 3,
    name: "National Health Department",
    hospital: "Government Agency",
    requestedOn: "2023-06-05",
    status: "rejected",
  },
]

// Mock data for medical records
export const medicalRecords = [
  {
    id: 1,
    title: "Annual Physical Examination",
    doctor: "Dr. Sarah Johnson",
    hospital: "City General Hospital",
    date: "2023-05-20",
    type: "examination",
  },
  {
    id: 2,
    title: "Blood Test Results",
    doctor: "Dr. Michael Chen",
    hospital: "Medical Research Institute",
    date: "2023-04-15",
    type: "lab",
  },
  {
    id: 3,
    title: "X-Ray Report",
    doctor: "Dr. Emily Wong",
    hospital: "City General Hospital",
    date: "2023-03-10",
    type: "imaging",
  },
  {
    id: 4,
    title: "Prescription",
    doctor: "Dr. Sarah Johnson",
    hospital: "City General Hospital",
    date: "2023-02-25",
    type: "prescription",
  },
]

// Mock data for appointments
export const appointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    patientName: "John Doe",
    patientId: "HLTH-1234-5678",
    specialty: "General Physician",
    hospital: "City General Hospital",
    date: "2023-06-25",
    time: "10:00 AM",
    status: "upcoming",
    type: "Follow-up",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    patientName: "Jane Smith",
    patientId: "HLTH-2345-6789",
    specialty: "Cardiologist",
    hospital: "Medical Research Institute",
    date: "2023-07-05",
    time: "2:30 PM",
    status: "upcoming",
    type: "Consultation",
  },
  {
    id: 3,
    doctor: "Dr. Emily Wong",
    patientName: "Robert Johnson",
    patientId: "HLTH-3456-7890",
    specialty: "Dermatologist",
    hospital: "City General Hospital",
    date: "2023-05-15",
    time: "11:15 AM",
    status: "completed",
    type: "Check-up",
  },
]

// Mock data for doctor access requests
export const doctorAccessRequests = [
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

// Mock data for hospitals
export const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    location: "Bangalore, Karnataka",
    doctors: 45,
    patients: 1250,
    status: "active",
  },
  {
    id: 2,
    name: "Medical Research Institute",
    location: "Mumbai, Maharashtra",
    doctors: 32,
    patients: 980,
    status: "active",
  },
  {
    id: 3,
    name: "Community Health Center",
    location: "Delhi, Delhi",
    doctors: 18,
    patients: 750,
    status: "active",
  },
  {
    id: 4,
    name: "Rural Medical College",
    location: "Pune, Maharashtra",
    doctors: 25,
    patients: 620,
    status: "pending",
  },
]

// Mock data for registration requests
export const registrationRequests = [
  {
    id: 1,
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    hospital: "Medical Research Institute",
    role: "doctor",
    requestedOn: "2023-06-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Dr. Emily Wong",
    email: "emily.wong@cityhospital.com",
    hospital: "City General Hospital",
    role: "doctor",
    requestedOn: "2023-06-14",
    status: "pending",
  },
]

// Mock data for datasets
export const datasets = [
  {
    id: 1,
    title: "Anonymized Patient Records 2023",
    category: "Clinical Data",
    records: 12450,
    size: "1.2 GB",
    lastUpdated: "2023-06-10",
    access: "full",
  },
  {
    id: 2,
    title: "Diabetes Treatment Outcomes",
    category: "Research Data",
    records: 5280,
    size: "850 MB",
    lastUpdated: "2023-05-25",
    access: "full",
  },
  {
    id: 3,
    title: "COVID-19 Vaccination Efficacy",
    category: "Epidemiology",
    records: 8750,
    size: "1.5 GB",
    lastUpdated: "2023-06-01",
    access: "partial",
  },
  {
    id: 4,
    title: "Heart Disease Risk Factors",
    category: "Cardiology",
    records: 3200,
    size: "620 MB",
    lastUpdated: "2023-04-15",
    access: "full",
  },
]

// Mock data for research projects
export const researchProjects = [
  {
    id: 1,
    title: "AI-Based Diagnosis Assistance",
    status: "active",
    collaborators: 3,
    datasets: 2,
    progress: 65,
  },
  {
    id: 2,
    title: "Predictive Analytics for Patient Outcomes",
    status: "active",
    collaborators: 5,
    datasets: 3,
    progress: 40,
  },
  {
    id: 3,
    title: "Healthcare Accessibility Study",
    status: "completed",
    collaborators: 2,
    datasets: 1,
    progress: 100,
  },
]

// API functions for patient dashboard
export const patientApi = {
  getProfile: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "John Doe",
          id: "HLTH-1234-5678",
          email: "john.doe@example.com",
          phone: "+91 9876543210",
          age: 32,
          bloodType: "O+",
        })
      }, 1000)
    })
  },
  getMedicalRecords: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "Blood Test Results",
            doctor: "Dr. Michael Chen",
            hospital: "City General Hospital",
            date: "2023-06-10",
          },
          {
            id: 2,
            title: "X-Ray Report",
            doctor: "Dr. Sarah Johnson",
            hospital: "Medical Research Institute",
            date: "2023-05-15",
          },
          {
            id: 3,
            title: "Vaccination Record",
            doctor: "Dr. Emily Wong",
            hospital: "Community Health Center",
            date: "2023-04-22",
          },
        ])
      }, 1000)
    })
  },
  getAccessRequests: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "Dr. Michael Chen",
            hospital: "City General Hospital",
            requestedOn: "2023-06-15",
            status: "pending",
          },
          {
            id: 2,
            name: "Dr. Sarah Johnson",
            hospital: "Medical Research Institute",
            requestedOn: "2023-06-10",
            status: "approved",
          },
          {
            id: 3,
            name: "Dr. Emily Wong",
            hospital: "Community Health Center",
            requestedOn: "2023-06-05",
            status: "rejected",
          },
        ])
      }, 1000)
    })
  },
  getAppointments: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            doctor: "Dr. Michael Chen",
            date: "2023-06-25",
            time: "10:00 AM",
            status: "upcoming",
          },
          {
            id: 2,
            doctor: "Dr. Sarah Johnson",
            date: "2023-06-20",
            time: "11:30 AM",
            status: "upcoming",
          },
          {
            id: 3,
            doctor: "Dr. Emily Wong",
            date: "2023-06-15",
            time: "09:15 AM",
            status: "completed",
          },
        ])
      }, 1000)
    })
  },
  approveAccess: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  },
  rejectAccess: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  },
  downloadRecord: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  },
  shareRecord: async (id) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  },
  updateProfile: async (data) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  },
}

// API functions for doctor dashboard
export const doctorApi = {
  // Get doctor profile
  getProfile: async () => {
    await delay(800)
    return {
      name: "Dr. Sarah Johnson",
      id: "DOC-5678-1234",
      specialty: "General Physician",
      hospital: "City General Hospital",
      email: "sarah.johnson@cityhospital.com",
      phone: "+91 9876543210",
      photo: "/placeholder.svg?height=40&width=40",
    }
  },

  // Get patients
  getPatients: async () => {
    await delay(800)
    return patients
  },

  // Get access requests
  getAccessRequests: async () => {
    await delay(800)
    return doctorAccessRequests
  },

  // Get appointments
  getAppointments: async () => {
    await delay(800)
    return appointments.filter((a) => a.doctor === "Dr. Sarah Johnson")
  },

  // View patient
  viewPatient: async (id: number) => {
    await delay(800)
    const patient = patients.find((p) => p.id === id)
    if (patient) {
      toast.success(`Viewing patient ${patient.name}`)
      return patient
    }
    toast.error("Patient not found")
    return null
  },

  // Approve access request
  approveAccess: async (id: number) => {
    await delay(800)
    toast.success("Access request approved")
    return { success: true }
  },

  // Reject access request
  rejectAccess: async (id: number) => {
    await delay(800)
    toast.success("Access request rejected")
    return { success: true }
  },

  // Schedule appointment
  scheduleAppointment: async (data: any) => {
    await delay(1200)
    toast.success("Appointment scheduled successfully")
    return { success: true, id: Math.floor(Math.random() * 1000) }
  },

  // Start session
  startSession: async (id: number) => {
    await delay(800)
    toast.success("Session started")
    return { success: true }
  },

  // Reschedule appointment
  rescheduleAppointment: async (id: number, newDate: string, newTime: string) => {
    await delay(1200)
    toast.success("Appointment rescheduled")
    return { success: true }
  },
}

// API functions for government dashboard
export const governmentApi = {
  // Get admin profile
  getProfile: async () => {
    await delay(800)
    return {
      name: "Admin User",
      id: "GOV-1234-5678",
      department: "Health Department",
      email: "admin@gov.health.org",
      photo: "/placeholder.svg?height=40&width=40",
    }
  },

  // Get hospitals
  getHospitals: async () => {
    await delay(800)
    return hospitals
  },

  // Get registration requests
  getRegistrationRequests: async () => {
    await delay(800)
    return registrationRequests
  },

  // View hospital
  viewHospital: async (id: number) => {
    await delay(800)
    const hospital = hospitals.find((h) => h.id === id)
    if (hospital) {
      toast.success(`Viewing hospital ${hospital.name}`)
      return hospital
    }
    toast.error("Hospital not found")
    return null
  },

  // Approve registration request
  approveRegistration: async (id: number) => {
    await delay(800)
    toast.success("Registration request approved")
    return { success: true }
  },

  // Reject registration request
  rejectRegistration: async (id: number) => {
    await delay(800)
    toast.success("Registration request rejected")
    return { success: true }
  },

  // Add hospital
  addHospital: async (data: any) => {
    await delay(1200)
    toast.success("Hospital added successfully")
    return { success: true, id: Math.floor(Math.random() * 1000) }
  },
}

// API functions for student dashboard
export const studentApi = {
  // Get student profile
  getProfile: async () => {
    await delay(800)
    return {
      name: "Alex Johnson",
      id: "STU-1234-5678",
      institution: "Medical Research University",
      department: "Health Informatics",
      email: "alex.johnson@mru.edu",
      photo: "/placeholder.svg?height=40&width=40",
    }
  },

  // Get datasets
  getDatasets: async () => {
    await delay(800)
    return datasets
  },

  // Get research projects
  getResearchProjects: async () => {
    await delay(800)
    return researchProjects
  },

  // View dataset
  viewDataset: async (id: number) => {
    await delay(800)
    const dataset = datasets.find((d) => d.id === id)
    if (dataset) {
      toast.success(`Viewing dataset ${dataset.title}`)
      return dataset
    }
    toast.error("Dataset not found")
    return null
  },

  // Download dataset
  downloadDataset: async (id: number) => {
    await delay(1500)
    toast.success("Dataset downloaded")
    return { success: true }
  },

  // Create research project
  createResearchProject: async (data: any) => {
    await delay(1200)
    toast.success("Research project created successfully")
    return { success: true, id: Math.floor(Math.random() * 1000) }
  },

  // Request higher access
  requestHigherAccess: async () => {
    await delay(1000)
    toast.success("Access level upgrade request submitted")
    return { success: true }
  },
}

