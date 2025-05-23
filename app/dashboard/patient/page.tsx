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
  Activity,
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image"

interface SystemNotification {
  id: string | number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type?: string;
}

interface RecordNotification {
  id: string | number;
  title: string;
  doctor: string;
  hospital: string;
  date: string;
  viewed: boolean;
  type?: string;
}

interface AccessRequest {
  id: string | number;
  name: string;
  hospital: string;
  requestedOn: string;
  status: "pending" | "approved" | "rejected";
}

export default function PatientDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const { user: loggedInUser } = useUser();

  console.log("User from context:", loggedInUser);

  // State for data
  const [profile, setProfile] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
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

  // Notification states
  const [notificationCount, setNotificationCount] = useState(0)
  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>([])
  const [recordNotifications, setRecordNotifications] = useState<RecordNotification[]>([])

  // Modal state
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);

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

        // Calculate notification count - pending access requests + unread system notifications
        const pendingRequests = requestsData.filter(r => r.status === "pending").length
        const unreadSystemCount = await patientApi.getUnreadNotificationsCount()
        const recordUpdates = await patientApi.getRecentRecordUpdates()
        
        setRecordNotifications(recordUpdates)
        setSystemNotifications(await patientApi.getSystemNotifications())
        setNotificationCount(pendingRequests + unreadSystemCount)
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

  const handleApproveAccess = async (id: string | number) => {
    setLoadingApproveId(typeof id === 'number' ? id : null);
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

  const handleRejectAccess = async (id: string | number) => {
    setLoadingRejectId(typeof id === 'number' ? id : null);
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

  const handleDownloadRecord = async (id: string | number) => {
    setLoadingDownloadId(typeof id === 'number' ? id : null);
    try {
      await patientApi.downloadRecord(id)
    } catch (error) {
      console.error("Error downloading record:", error)
    } finally {
      setLoadingDownloadId(null)
    }
  }

  const handleShareRecord = async (id: string | number) => {
    setLoadingShareId(typeof id === 'number' ? id : null);
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

  const handleMarkAllNotificationsRead = async () => {
      try {
        if (patientApi.markAllNotificationsRead) {
          await patientApi.markAllNotificationsRead();
        }
        // Update state to reflect all notifications read
        setSystemNotifications((prevNotifications: SystemNotification[]) => 
          prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        setRecordNotifications((prevNotifications: RecordNotification[]) =>
          prevNotifications.map(notification => ({ ...notification, viewed: true }))
        );
        setNotificationCount(0);
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }

  const handleViewAllNotifications = () => {
    // Navigate to notifications page or show all notifications
    router.push("/dashboard/patient/notifications")
  }

  const handleViewRecord = (recordId: string | number) => {
    // Navigate to the specific record
    router.push(`/dashboard/patient/records/${recordId}`)
  }

  const handleViewAllAppointments = () => {
    setIsAppointmentsModalOpen(true);
  };

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
      title: "Health Tracking",
      href: "/dashboard/patient/tracking",
      icon: <Activity className="h-4 w-4" />,
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
      notifications={notificationCount}
      requiredRole="patient"
      accessRequests={accessRequests}
      recordUpdates={recordNotifications}
      systemNotifications={systemNotifications}
      onApproveAccess={handleApproveAccess}
      onRejectAccess={handleRejectAccess}
      onViewRecord={handleViewRecord}
      onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      onViewAllNotifications={handleViewAllNotifications}
    >
      {/* Hero Banner Image */}
      <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=2200"
          alt="Hospital environment"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/80 to-transparent flex items-center">
          <div className="px-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Welcome to CareFolio</h1>
            <p className="mt-2 max-w-md">Your secure healthcare records management system</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="overflow-hidden">
          <div className="relative h-24">
            <Image 
              src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1000"
              alt="Profile background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
          </div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg">Profile Completeness</CardTitle>
          </CardHeader>
          {/* Rest of the card content remains the same */}
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

        <Card className="overflow-hidden">
          <div className="relative h-24">
            <Image 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000"
              alt="Security background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
          </div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg">Access Requests</CardTitle>
          </CardHeader>
          {/* Rest of the card content remains the same */}
          <CardContent>
            {/* Existing content */}
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
                {/* Other existing items */}
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

        <Card className="overflow-hidden">
          <div className="relative h-24">
            <Image 
              src="https://images.unsplash.com/photo-1631815587646-b84fb0385e33?auto=format&fit=crop&q=80&w=1000"
              alt="Appointment background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
          </div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          {/* Rest of the card content remains the same */}
          <CardContent>
            {/* Existing content */}
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
            <Button variant="outline" className="w-full" onClick={handleViewAllAppointments}>
              View All
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Existing tabs code */}
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <div className="relative h-48 w-full">
              <Image 
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=2200"
                alt="Medical professionals"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600/80 to-transparent"></div>
              <div className="absolute top-6 left-6 text-white">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-sm opacity-90">Your information stored in the secure database</p>
              </div>
            </div>
            <CardContent className="pt-6">
              {/* Existing content */}
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
                      {/* Rest of the profile fields */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Aadhaar ID</h3>
                        <p>{profile.id || profile.aadhaarId}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Email Address</h3>
                        <p>{profile.email || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Gender</h3>
                        <p>{profile.gender || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
                        <p>{profile.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Date of Birth</h3>
                        <p>{profile.dateOfBirth || "Not provided"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Blood Type</h3>
                        <p>{profile.bloodType || "Unknown"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">Address</h3>
                        <p>{profile.address || "Not provided"}</p>
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

        {/* Keep the other TabsContent sections as they are */}
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

      <Dialog open={isAppointmentsModalOpen} onOpenChange={setIsAppointmentsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>All Appointments</DialogTitle>
            <DialogDescription>
              View and manage all your upcoming and past appointments
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="upcoming" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {appointments
                  .filter((a) => a.status === "upcoming")
                  .map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.doctor}</p>
                            <p className="text-sm text-gray-600">{appointment.hospital}</p>
                            <p className="text-sm text-sky-600 mt-1">
                              {appointment.date}, {appointment.time}
                            </p>
                          </div>
                          <Badge className="bg-sky-100 text-sky-600 hover:bg-sky-200">
                            Upcoming
                          </Badge>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-2 border-t pt-2">
                            {appointment.notes}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button variant="outline" size="sm" className="border-red-300 text-red-600">Cancel</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {appointments.filter((a) => a.status === "upcoming").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No upcoming appointments</p>
                    <Button className="mt-4" size="sm">Schedule New Appointment</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {appointments
                  .filter((a) => a.status === "completed")
                  .map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.doctor}</p>
                            <p className="text-sm text-gray-600">{appointment.hospital}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {appointment.date}, {appointment.time}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-600 hover:bg-green-200">
                            Completed
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">View Summary</Button>
                          <Button variant="outline" size="sm">Book Follow-up</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {appointments.filter((a) => a.status === "completed").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No past appointments</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="cancelled">
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {appointments
                  .filter((a) => a.status === "cancelled")
                  .map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                        <XCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.doctor}</p>
                            <p className="text-sm text-gray-600">{appointment.hospital}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {appointment.date}, {appointment.time}
                            </p>
                          </div>
                          <Badge className="bg-red-100 text-red-600 hover:bg-red-200">
                            Cancelled
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">Reschedule</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {appointments.filter((a) => a.status === "cancelled").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No cancelled appointments</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAppointmentsModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => router.push('/dashboard/patient/appointments')}>
              Manage Appointments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

