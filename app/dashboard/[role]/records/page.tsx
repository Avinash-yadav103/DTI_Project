"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  FileText,
  Download,
  Share2,
  Eye,
  Upload,
  ChevronDown,
  FileUp,
  User,
  Shield,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function MedicalRecordsPage() {
  const params = useParams()
  const { user, logout } = useAuth()
  const role = params.role as "patient" | "doctor" | "government" | "student"

  const [expandedRecord, setExpandedRecord] = useState<number | null>(1)
  const [isUploading, setIsUploading] = useState(false)

  // Mock medical records data
  const medicalRecords = [
    {
      id: 1,
      title: "Seasonal Allergic Rhinitis",
      doctor: "Dr. Rajesh Kumar",
      hospital: "City General Hospital",
      date: "June 15, 2023",
      type: "diagnosis",
      diagnosis: "Seasonal Allergic Rhinitis",
      prescription: [
        "Cetirizine 10mg - Take once daily for 10 days",
        "Fluticasone Nasal Spray - Use as directed twice daily",
      ],
      clinicalNotes:
        "Patient presented with nasal congestion, sneezing, and itchy eyes. Symptoms are consistent with seasonal allergies. Recommended to avoid outdoor activities during high pollen count days.",
      documents: [{ name: "Allergy Test Results", type: "PDF" }],
    },
    {
      id: 2,
      title: "Hypertension - Stage 1",
      doctor: "Dr. Priya Sharma",
      hospital: "Medical Research Institute",
      date: "May 10, 2023",
      type: "diagnosis",
      diagnosis: "Hypertension - Stage 1",
      prescription: ["Amlodipine 5mg - Take once daily", "Low sodium diet recommended"],
      clinicalNotes:
        "Blood pressure readings consistently above 130/80 mmHg. No other symptoms reported. Recommended lifestyle modifications including regular exercise and dietary changes.",
      documents: [
        { name: "Blood Pressure Chart", type: "PDF" },
        { name: "ECG Report", type: "PDF" },
      ],
    },
    {
      id: 3,
      title: "Annual Physical Examination",
      doctor: "Dr. Sarah Johnson",
      hospital: "City General Hospital",
      date: "April 5, 2023",
      type: "examination",
      diagnosis: "Healthy",
      prescription: [],
      clinicalNotes:
        "Routine annual physical examination. All vital signs within normal range. No significant findings.",
      documents: [
        { name: "Complete Blood Count", type: "PDF" },
        { name: "Lipid Profile", type: "PDF" },
      ],
    },
    {
      id: 4,
      title: "X-Ray Report",
      doctor: "Dr. Emily Wong",
      hospital: "City General Hospital",
      date: "March 10, 2023",
      type: "imaging",
      diagnosis: "No abnormalities detected",
      prescription: [],
      clinicalNotes:
        "Chest X-ray performed due to persistent cough. No abnormalities detected in lung fields. Cough likely due to post-viral irritation.",
      documents: [
        { name: "Chest X-Ray Images", type: "DICOM" },
        { name: "Radiologist Report", type: "PDF" },
      ],
    },
  ]

  const handleDownloadRecord = (id: number) => {
    toast.success(`Downloading record ${id}`)
  }

  const handleShareRecord = (id: number) => {
    toast.success(`Sharing record ${id}`)
  }

  const handleViewFullRecord = (id: number) => {
    toast.success(`Viewing full record ${id}`)
  }

  const handleUploadRecord = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      toast.success("Medical record uploaded successfully")
    }, 1500)
  }

  const toggleExpandRecord = (id: number) => {
    if (expandedRecord === id) {
      setExpandedRecord(null)
    } else {
      setExpandedRecord(id)
    }
  }

  const formatDate = (dateString: string) => {
    const months = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    }

    const parts = dateString.split(" ")
    if (parts.length === 3) {
      const month = months[parts[0]] || parts[0]
      return `${month} ${parts[1]} ${parts[2]}`
    }
    return dateString
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
      title="Medical Records"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole={role}
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">Medical Records</CardTitle>
              <CardDescription>View your complete medical history</CardDescription>
            </div>
            <Button onClick={handleUploadRecord} className="bg-sky-600 hover:bg-sky-700" disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Record
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {medicalRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpandRecord(record.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{record.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(record.date)} • {record.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={`mr-4 ${
                          record.type === "diagnosis"
                            ? "bg-amber-100 text-amber-800"
                            : record.type === "examination"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </Badge>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${expandedRecord === record.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {expandedRecord === record.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Diagnosis</h4>
                          <p className="text-gray-900">{record.diagnosis}</p>

                          {record.prescription.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Prescription</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {record.prescription.map((med, index) => (
                                  <li key={index} className="text-gray-900">
                                    {med}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Clinical Notes</h4>
                          <p className="text-gray-900">{record.clinicalNotes}</p>

                          {record.documents.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Documents</h4>
                              <div className="space-y-2">
                                {record.documents.map((doc, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                                  >
                                    <FileUp className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{doc.name}</span>
                                    <Badge className="ml-auto text-xs bg-gray-100 text-gray-800">{doc.type}</Badge>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Download className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShareRecord(record.id)}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadRecord(record.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          size="sm"
                          onClick={() => handleViewFullRecord(record.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Full Record
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

