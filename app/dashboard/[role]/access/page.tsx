"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Shield, CheckCircle, XCircle, UserPlus, Clock, FileText, User, Calendar, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function AccessControlPage() {
  const params = useParams()
  const { user, logout } = useAuth()
  const role = params.role as "patient" | "doctor" | "government" | "student"

  const [activeTab, setActiveTab] = useState("pending")
  const [loadingApproveId, setLoadingApproveId] = useState<number | null>(null)
  const [loadingRejectId, setLoadingRejectId] = useState<number | null>(null)

  // Mock access requests data
  const accessRequests = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      hospital: "City General Hospital",
      requestedOn: "2023-06-15",
      status: "pending",
      type: "doctor",
      reason: "Primary care physician requesting access to provide ongoing care",
      duration: "1 year",
      accessLevel: "Full medical history",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      hospital: "Medical Research Institute",
      requestedOn: "2023-06-10",
      status: "approved",
      type: "specialist",
      reason: "Cardiology consultation",
      duration: "6 months",
      accessLevel: "Cardiovascular records only",
      approvedOn: "2023-06-11",
    },
    {
      id: 3,
      name: "National Health Department",
      hospital: "Government Agency",
      requestedOn: "2023-06-05",
      status: "rejected",
      type: "government",
      reason: "Public health research",
      duration: "Indefinite",
      accessLevel: "Anonymized data only",
      rejectedOn: "2023-06-06",
    },
    {
      id: 4,
      name: "Dr. Emily Wong",
      hospital: "City General Hospital",
      requestedOn: "2023-06-14",
      status: "pending",
      type: "specialist",
      reason: "Dermatology consultation",
      duration: "3 months",
      accessLevel: "Recent medical history",
    },
    {
      id: 5,
      name: "Medical Research University",
      hospital: "Research Institution",
      requestedOn: "2023-06-08",
      status: "approved",
      type: "research",
      reason: "Clinical trial for new hypertension medication",
      duration: "1 year",
      accessLevel: "Cardiovascular records only",
      approvedOn: "2023-06-09",
    },
  ]

  const handleApproveAccess = async (id: number) => {
    setLoadingApproveId(id)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Access request approved")
    } catch (error) {
      console.error("Error approving access:", error)
      toast.error("Failed to approve access")
    } finally {
      setLoadingApproveId(null)
    }
  }

  const handleRejectAccess = async (id: number) => {
    setLoadingRejectId(id)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Access request rejected")
    } catch (error) {
      console.error("Error rejecting access:", error)
      toast.error("Failed to reject access")
    } finally {
      setLoadingRejectId(null)
    }
  }

  const handleRevokeAccess = async (id: number) => {
    setLoadingRejectId(id)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Access revoked successfully")
    } catch (error) {
      console.error("Error revoking access:", error)
      toast.error("Failed to revoke access")
    } finally {
      setLoadingRejectId(null)
    }
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
      title="Access Control"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole={role}
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">Access Control</CardTitle>
              <CardDescription>Manage who can access your medical records</CardDescription>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Grant New Access
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                <TabsTrigger value="approved">Approved Access</TabsTrigger>
                <TabsTrigger value="rejected">Rejected Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="space-y-4">
                  {accessRequests.filter((r) => r.status === "pending").length > 0 ? (
                    accessRequests
                      .filter((r) => r.status === "pending")
                      .map((request) => (
                        <div key={request.id} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium">{request.name}</h4>
                                <Badge className="bg-amber-100 text-amber-800">
                                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{request.hospital}</p>
                              <p className="text-sm text-amber-600 mt-1">Requested on {request.requestedOn}</p>

                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">Reason: </span>
                                  <span className="text-gray-900">{request.reason}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Duration: </span>
                                  <span className="text-gray-900">{request.duration}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Access Level: </span>
                                  <span className="text-gray-900">{request.accessLevel}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                                onClick={() => handleRejectAccess(request.id)}
                                disabled={loadingRejectId === request.id}
                              >
                                {loadingRejectId === request.id ? (
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                ) : (
                                  <XCircle className="h-4 w-4 mr-1" />
                                )}
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="h-9 bg-sky-600 hover:bg-sky-700 text-white"
                                onClick={() => handleApproveAccess(request.id)}
                                disabled={loadingApproveId === request.id}
                              >
                                {loadingApproveId === request.id ? (
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Approve
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Pending Requests</h3>
                      <p className="text-gray-600 mt-1">You don't have any pending access requests at the moment.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="approved">
                <div className="space-y-4">
                  {accessRequests.filter((r) => r.status === "approved").length > 0 ? (
                    accessRequests
                      .filter((r) => r.status === "approved")
                      .map((request) => (
                        <div key={request.id} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium">{request.name}</h4>
                                <Badge className="bg-green-100 text-green-800">
                                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{request.hospital}</p>
                              <p className="text-sm text-green-600 mt-1">Approved on {request.approvedOn}</p>

                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">Reason: </span>
                                  <span className="text-gray-900">{request.reason}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Duration: </span>
                                  <span className="text-gray-900">{request.duration}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Access Level: </span>
                                  <span className="text-gray-900">{request.accessLevel}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                              onClick={() => handleRevokeAccess(request.id)}
                              disabled={loadingRejectId === request.id}
                            >
                              {loadingRejectId === request.id ? (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Revoke Access
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Approved Access</h3>
                      <p className="text-gray-600 mt-1">You haven't approved access for anyone yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rejected">
                <div className="space-y-4">
                  {accessRequests.filter((r) => r.status === "rejected").length > 0 ? (
                    accessRequests
                      .filter((r) => r.status === "rejected")
                      .map((request) => (
                        <div key={request.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium">{request.name}</h4>
                                <Badge className="bg-gray-200 text-gray-800">
                                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{request.hospital}</p>
                              <p className="text-sm text-red-600 mt-1">Rejected on {request.rejectedOn}</p>

                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">Reason: </span>
                                  <span className="text-gray-900">{request.reason}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Duration: </span>
                                  <span className="text-gray-900">{request.duration}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Access Level: </span>
                                  <span className="text-gray-900">{request.accessLevel}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="h-9 bg-sky-600 hover:bg-sky-700 text-white"
                              onClick={() => handleApproveAccess(request.id)}
                              disabled={loadingApproveId === request.id}
                            >
                              {loadingApproveId === request.id ? (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Approve Now
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Rejected Requests</h3>
                      <p className="text-gray-600 mt-1">You haven't rejected any access requests yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

