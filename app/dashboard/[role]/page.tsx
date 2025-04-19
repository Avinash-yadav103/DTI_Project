"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth"
import { Loader2, FileText, User, Shield, Calendar, Settings, LogOut } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function DynamicDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated, logout } = useAuth()
  const role = params.role as UserRole

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Verify user has access to this role's dashboard
    if (user?.role !== role) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router, role])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-sky-600" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/login")
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

  // Get role-specific dashboard content
  const getDashboardContent = () => {
    // Common dashboard components
    const profileCompleteness = (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Profile Completeness</CardTitle>
          <CardDescription>85% Complete</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={85} className="h-2 mb-2" />
          <p className="text-sm text-gray-600">Complete your profile to improve your healthcare experience</p>
          <Button className="w-full mt-4" variant="outline">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    )

    const accessRequests = (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Access Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
              <span>Pending</span>
            </div>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">1</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span>Approved</span>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">1</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
              <span>Rejected</span>
            </div>
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">1</span>
          </div>
          <Button className="w-full mt-4" variant="outline">
            Manage Access
          </Button>
        </CardContent>
      </Card>
    )

    const upcomingAppointments = (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-sky-100 p-2 rounded-md text-sky-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Dr. Michael Chen</p>
              <p className="text-sm text-gray-600">2023-06-25, 10:00 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-sky-100 p-2 rounded-md text-sky-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Dr. Sarah Johnson</p>
              <p className="text-sm text-gray-600">2023-06-30, 11:30 AM</p>
            </div>
          </div>
          <Button className="w-full mt-2" variant="outline">
            View All
          </Button>
        </CardContent>
      </Card>
    )

    const personalInfo = (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic information stored on the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
              <p>{user.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
              <p>+91 9876543210</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Patient ID</h4>
              <p>HLTH-1234-5678</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Age</h4>
              <p>32 years</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
              <p>{user.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Blood Type</h4>
              <p>O+</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )

    // Role-specific dashboard content
    if (role === "patient") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileCompleteness}
            {accessRequests}
            {upcomingAppointments}
          </div>
          {personalInfo}
        </>
      )
    } else if (role === "doctor") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileCompleteness}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Next appointment in 30 minutes</p>
                <Button className="w-full mt-4" variant="outline">
                  View Schedule
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Patient Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">New consultation requests</p>
                <Button className="w-full mt-4" variant="outline">
                  Review Requests
                </Button>
              </CardContent>
            </Card>
          </div>
          {personalInfo}
        </>
      )
    } else if (role === "government") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileCompleteness}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>System Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">12,458</p>
                <p className="text-sm text-gray-600">Total registered users</p>
                <Button className="w-full mt-4" variant="outline">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-600">Doctor registration requests</p>
                <Button className="w-full mt-4" variant="outline">
                  Review Requests
                </Button>
              </CardContent>
            </Card>
          </div>
          {personalInfo}
        </>
      )
    } else if (role === "student") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profileCompleteness}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Available Datasets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-gray-600">Anonymized medical datasets</p>
                <Button className="w-full mt-4" variant="outline">
                  Browse Datasets
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-600">Active research projects</p>
                <Button className="w-full mt-4" variant="outline">
                  View Projects
                </Button>
              </CardContent>
            </Card>
          </div>
          {personalInfo}
        </>
      )
    }

    return <div>Dashboard content not available</div>
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
      user={user}
      notifications={3}
      requiredRole={role}
    >
      {getDashboardContent()}
    </DashboardLayout>
  )
}

