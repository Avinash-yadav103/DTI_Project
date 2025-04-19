"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Clock,
  Calendar,
  Settings,
  LogOut,
  Shield,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Share2,
  Home,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { patientApi } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext";

export default function PatientDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const { user: loggedInUser } = useUser();

  console.log("User from context:", loggedInUser);

  // State for data
  const [profile, setProfile] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [accessRequests, setAccessRequests] = useState([])
  const [appointments, setAppointments] = useState([])

  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [isLoadingRequests, setIsLoadingRequests] = useState(true)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)

  // Action loading states
  const [loadingApproveId, setLoadingApproveId] = useState<number | null>(null)
  const [loadingRejectId, setLoadingRejectId] = useState<number | null>(null)
  const [loadingDownloadId, setLoadingDownloadId] = useState<number | null>(null)
  const [loadingShareId, setLoadingShareId] = useState<number | null>(null)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        setIsLoadingProfile(true)
        const profileData = await patientApi.getProfile()
        setProfile(profileData)
        setIsLoadingProfile(false)

        // Fetch medical records
        setIsLoadingRecords(true)
        const recordsData = await patientApi.getMedicalRecords()
        setMedicalRecords(recordsData)
        setIsLoadingRecords(false)

        // Fetch access requests
        setIsLoadingRequests(true)
        const requestsData = await patientApi.getAccessRequests()
        setAccessRequests(requestsData)
        setIsLoadingRequests(false)

        // Fetch appointments
        setIsLoadingAppointments(true)
        const appointmentsData = await patientApi.getAppointments()
        setAppointments(appointmentsData)
        setIsLoadingAppointments(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoadingProfile(false)
        setIsLoadingRecords(false)
        setIsLoadingRequests(false)
        setIsLoadingAppointments(false)
      }
    }

    fetchData()
  }, [])

  const handleApproveAccess = async (id) => {
    setLoadingApproveId(id)
    try {
      await patientApi.approveAccess(id)
      // Update the access requests list
      setAccessRequests(accessRequests.map((req) => (req.id === id ? { ...req, status: "approved" } : req)))
    } catch (error) {
      console.error("Error approving access:", error)
    } finally {
      setLoadingApproveId(null)
    }
  }

  const handleRejectAccess = async (id) => {
    setLoadingRejectId(id)
    try {
      await patientApi.rejectAccess(id)
      // Update the access requests list
      setAccessRequests(accessRequests.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))
    } catch (error) {
      console.error("Error rejecting access:", error)
    } finally {
      setLoadingRejectId(null)
    }
  }

  const handleDownloadRecord = async (id) => {
    setLoadingDownloadId(id)
    try {
      await patientApi.downloadRecord(id)
    } catch (error) {
      console.error("Error downloading record:", error)
    } finally {
      setLoadingDownloadId(null)
    }
  }

  const handleShareRecord = async (id) => {
    setLoadingShareId(id)
    try {
      await patientApi.shareRecord(id)
    } catch (error) {
      console.error("Error sharing record:", error)
    } finally {
      setLoadingShareId(null)
    }
  }

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true)
    try {
      await patientApi.updateProfile({})
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/patient",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Access Control",
      href: "/dashboard/patient/access",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/patient/appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/patient/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/patient/settings",
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
      title="Patient Dashboard"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Completeness</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">85% Complete</span>
                    <span className="text-sky-600">17/20</span>
                  </div>
                  <Progress value={85} className="h-2 bg-gray-200" indicatorClassName="bg-sky-600" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Complete your profile to improve your healthcare experience
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Access Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-amber-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Pending</span>
                  </span>
                  <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-200">
                    {accessRequests.filter((r) => r.status === "pending").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Approved</span>
                  </span>
                  <Badge className="bg-green-100 text-green-600 hover:bg-green-200">
                    {accessRequests.filter((r) => r.status === "approved").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Rejected</span>
                  </span>
                  <Badge className="bg-red-100 text-red-600 hover:bg-red-200">
                    {accessRequests.filter((r) => r.status === "rejected").length}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setActiveTab("access")}>
              Manage Access
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAppointments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {appointments
                  .filter((a) => a.status === "upcoming")
                  .slice(0, 2)
                  .map((appointment) => (
                    <div key={appointment.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{appointment.doctor}</p>
                        <p className="text-xs text-gray-600">
                          {appointment.date}, {appointment.time}
                        </p>
                      </div>
                    </div>
                  ))}
                {appointments.filter((a) => a.status === "upcoming").length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No upcoming appointments</p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic information stored on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingProfile ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
              ) : profile ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Full Name</h3>
                        <p>{profile.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Patient ID</h3>
                        <p>{profile.id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Email Address</h3>
                        <p>{profile.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
                        <p>{profile.phone}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Age</h3>
                        <p>{profile.age} years</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Blood Type</h3>
                        <p>{profile.bloodType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Medical record added</p>
                          <p className="text-xs text-gray-600">Blood Test Results added by Dr. Michael Chen</p>
                          <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Access request approved</p>
                          <p className="text-xs text-gray-600">You approved access for Dr. Michael Chen</p>
                          <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Appointment scheduled</p>
                          <p className="text-xs text-gray-600">Appointment with Dr. Sarah Johnson on June 25, 2023</p>
                          <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Failed to load profile data. Please try again later.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Your medical records stored securely on the blockchain</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    placeholder="Search records..."
                    className="pl-9 border border-gray-300 rounded-md h-10 w-full text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRecords ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
              ) : medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">{record.title}</h3>
                            <p className="text-xs text-gray-600">
                              {record.doctor} • {record.hospital}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleDownloadRecord(record.id)}
                            disabled={loadingDownloadId === record.id}
                          >
                            {loadingDownloadId === record.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleShareRecord(record.id)}
                            disabled={loadingShareId === record.id}
                          >
                            {loadingShareId === record.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Share2 className="h-4 w-4 mr-1" />
                            )}
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No medical records found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage who can access your medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
                    <div className="space-y-4">
                      {accessRequests
                        .filter((r) => r.status === "pending")
                        .map((request) => (
                          <div key={request.id} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-medium">{request.name}</h4>
                                <p className="text-xs text-gray-600">{request.hospital}</p>
                                <p className="text-xs text-amber-600 mt-1">Requested on {request.requestedOn}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                                  onClick={() => handleRejectAccess(request.id)}
                                  disabled={loadingRejectId === request.id}
                                >
                                  {loadingRejectId === request.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8 bg-sky-600 hover:bg-sky-700 text-white"
                                  onClick={() => handleApproveAccess(request.id)}
                                  disabled={loadingApproveId === request.id}
                                >
                                  {loadingApproveId === request.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {accessRequests.filter((r) => r.status === "pending").length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No pending requests</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Approved Access</h3>
                    <div className="space-y-4">
                      {accessRequests
                        .filter((r) => r.status === "approved")
                        .map((request) => (
                          <div key={request.id} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-medium">{request.name}</h4>
                                <p className="text-xs text-gray-600">{request.hospital}</p>
                                <p className="text-xs text-green-600 mt-1">Approved on {request.requestedOn}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() => handleRejectAccess(request.id)}
                                disabled={loadingRejectId === request.id}
                              >
                                {loadingRejectId === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                Revoke Access
                              </Button>
                            </div>
                          </div>
                        ))}
                      {accessRequests.filter((r) => r.status === "approved").length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No approved requests</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Rejected Requests</h3>
                    <div className="space-y-4">
                      {accessRequests
                        .filter((r) => r.status === "rejected")
                        .map((request) => (
                          <div key={request.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h4 className="text-sm font-medium">{request.name}</h4>
                                <p className="text-xs text-gray-600">{request.hospital}</p>
                                <p className="text-xs text-red-600 mt-1">Rejected on {request.requestedOn}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => handleApproveAccess(request.id)}
                                disabled={loadingApproveId === request.id}
                              >
                                {loadingApproveId === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Approve Now
                              </Button>
                            </div>
                          </div>
                        ))}
                      {accessRequests.filter((r) => r.status === "rejected").length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-2">No rejected requests</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

