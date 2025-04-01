"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Calendar, Upload, UserRound, CheckCircle, Send, Eye, Trash2, PillIcon, Check } from "lucide-react"
import { PatientInfo } from "@/components/patient-info"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { GenerateReport } from "@/components/generate-report"
import { HealthMetricsPreview } from "@/components/health-metrics-preview"
import { YourPhysicians } from "@/components/your-physicians"
import { MedicalTimeline } from "@/components/medical-history/medical-timeline"


type UploadedFile = {
  name: string
  size: number
  url?: string
  type?: string
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const [sent, setSent] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility

  useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedFiles")
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles))
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setFile(file)
      setUploaded(true)

      const reader = new FileReader()
      reader.onloadend = () => {
        const newFile: UploadedFile = {
          name: file.name,
          size: file.size,
          url: reader.result as string,
          type: file.type,
        }

        const updatedFiles = [...uploadedFiles, newFile]
        setUploadedFiles(updatedFiles)
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSendFile = () => {
    if (file) {
      localStorage.setItem("uploadedFile", JSON.stringify({ name: file.name, size: file.size }))
      setSent(true)
    }
  }

  const handlePreviewFile = (file: UploadedFile) => {
    if (file.url) {
      window.open(file.url, "_blank")
    }
  }

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...uploadedFiles]
    updatedFiles.splice(index, 1)
    setUploadedFiles(updatedFiles)
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
  }

  const handleScheduleAppointment = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmitAppointment = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle appointment submission logic here
    alert("Appointment scheduled successfully!")
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <PatientInfo />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Schedule Appointment */}
        <Card onClick={handleScheduleAppointment} className="cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Schedule Appointment</CardTitle>
              <CardDescription>Book your next visit</CardDescription>
            </div>
          </CardContent>
        </Card>

        {/* Upload Document */}
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${
                uploaded ? "bg-green-100" : "bg-gray-100"
              } cursor-pointer`}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {uploaded ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Upload className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">
                {uploaded ? "Document Uploaded" : "Upload Document"}
              </CardTitle>
              <CardDescription>
                {uploaded ? "Ready to send" : "Add new medical records"}
              </CardDescription>
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*, application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>

          {uploaded && !sent && (
            <div className="p-4">
              <button
                onClick={handleSendFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send to Profile
              </button>
            </div>
          )}

          {sent && (
            <div className="p-4 text-green-600">
              File sent successfully! Check your profile for the preview.
            </div>
          )}
        </Card>

        {/* Update Profile */}
        <Card onClick={() => (window.location.href = "/profile")} className="cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserRound className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">Update Profile</CardTitle>
              <CardDescription>Edit your information</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-4">Uploaded Documents</CardTitle>
            <ul className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex flex-col space-y-2 md:flex-row md:items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-start gap-4">
                    {file.type?.startsWith("image/") && file.url ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md text-sm font-medium">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handlePreviewFile(file)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDeleteFile(index)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingAppointments />
        <GenerateReport />
      </div>

      <HealthMetricsPreview />
      <YourPhysicians />

      {/* Modal for Scheduling Appointment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Schedule Appointment</h2>
            <form onSubmit={handleSubmitAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Doctor's Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-md p-2"
                  placeholder="Enter doctor's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  required
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  required
                  className="w-full border rounded-md p-2"
                  placeholder="Enter reason for appointment"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
