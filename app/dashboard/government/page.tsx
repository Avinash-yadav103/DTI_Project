"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import {
  Building2,
  UserPlus,
  Settings,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Database,
  Home,
  PlusCircle,
  BarChart,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

export default function GovernmentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const admin = {
    name: "Admin User",
    id: "GOV-1234-5678",
    department: "Health Department",
    email: "admin@gov.health.org",
    photo: "/placeholder.svg?height=40&width=40",
  }

  const registrationRequests = [
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

  const hospitals = [
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

  const statistics = [
    {
      title: "Total Patients",
      value: "12,450",
      change: "+5.2%",
      trend: "up",
    },
    {
      title: "Registered Doctors",
      value: "1,245",
      change: "+3.8%",
      trend: "up",
    },
    {
      title: "Active Hospitals",
      value: "128",
      change: "+2.1%",
      trend: "up",
    },
    {
      title: "Data Transactions",
      value: "45,678",
      change: "+12.4%",
      trend: "up",
    },
  ]

  const handleApproveRegistration = (id) => {
    toast.success("Registration request approved")
  }

  const handleRejectRegistration = (id) => {
    toast.success("Registration request rejected")
  }

  const handleViewHospital = (id) => {
    toast.success(`Viewing hospital ${id}`)
  }

  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/government",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Hospitals",
      href: "/dashboard/government/hospitals",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      title: "Registration Requests",
      href: "/dashboard/government/registrations",
      icon: <UserPlus className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/government/analytics",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/government/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "System Settings",
      href: "/dashboard/government/settings",
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
      title="Government Admin Dashboard"
      user={admin}
      notifications={2}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statistics.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div
                className={`text-sm mt-1 flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="registrations">Registration Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Summary of the healthcare blockchain system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New registration request</p>
                        <p className="text-xs text-gray-600">Dr. Emily Wong from City General Hospital</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New hospital added</p>
                        <p className="text-xs text-gray-600">Rural Medical College in Pune, Maharashtra</p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">System update completed</p>
                        <p className="text-xs text-gray-600">Blockchain infrastructure updated to version 2.4</p>
                        <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hospitals">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Registered Hospitals</CardTitle>
                  <CardDescription>Manage hospitals in the healthcare network</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      placeholder="Search hospitals..."
                      className="pl-9 border border-gray-300 rounded-md h-10 w-full text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Hospital
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hospital Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Doctors</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Patients</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hospitals.map((hospital) => (
                      <tr key={hospital.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{hospital.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{hospital.location}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{hospital.doctors}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{hospital.patients}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`
                            ${
                              hospital.status === "active"
                                ? "bg-green-100 text-green-600"
                                : "bg-amber-100 text-amber-600"
                            }
                          `}
                          >
                            {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => handleViewHospital(hospital.id)}
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

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Registration Requests</CardTitle>
              <CardDescription>Approve or reject registration requests from healthcare professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
                  <div className="space-y-4">
                    {registrationRequests.map((request) => (
                      <div key={request.id} className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-medium">{request.name}</h4>
                            <p className="text-xs text-gray-600">
                              {request.email} • {request.hospital}
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                              Role: {request.role.charAt(0).toUpperCase() + request.role.slice(1)} • Requested on{" "}
                              {request.requestedOn}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                              onClick={() => handleRejectRegistration(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 bg-sky-600 hover:bg-sky-700 text-white"
                              onClick={() => handleApproveRegistration(request.id)}
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
    </DashboardLayout>
  )
}

