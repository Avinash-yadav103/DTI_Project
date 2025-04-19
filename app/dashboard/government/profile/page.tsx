"use client"

import { useState } from "react"
import { User, Mail, Phone, Building, Shield, Calendar, Save, Loader2, FileText, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Progress } from "@/components/ui/progress"

// Update the sidebar items and footer items to handle logout properly
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function GovernmentProfile() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    personal: {
      name: "Admin User",
      email: "admin@gov.health.org",
      phone: "+91 9876543210",
      address: "Health Department, Government Complex, Bangalore",
      bio: "Government health administrator responsible for overseeing healthcare blockchain implementation.",
    },
    department: {
      department: "Health Department",
      role: "System Administrator",
      employeeId: "GOV-1234-5678",
      joinDate: "2020-01-15",
      supervisor: "Director of Health Services",
      accessLevel: "Level 5 (Full System Access)",
    },
    security: {
      lastPasswordChange: "2023-05-10",
      twoFactorEnabled: true,
      recoveryEmail: "admin.backup@gov.health.org",
      securityQuestions: "Configured (3/3)",
      loginNotifications: true,
      accessLogs: "Enabled",
    },
  })

  // Mock data
  const admin = {
    name: "Admin User",
    id: "GOV-1234-5678",
    department: "Health Department",
    email: "admin@gov.health.org",
    photo: "/placeholder.svg?height=100&width=100",
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
      title: "Overview",
      href: "/dashboard/government",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Hospitals",
      href: "/dashboard/government/hospitals",
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: "Registration Requests",
      href: "/dashboard/government/registrations",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/government/analytics",
      icon: <FileText className="h-4 w-4" />,
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
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "#",
      icon: <User className="h-4 w-4" />,
      onClick: handleLogout,
    },
  ]

  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    })
  }

  const handleSave = (section) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully`)
    }, 1000)
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Government Admin Profile"
      user={admin}
      notifications={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <img
                  src={admin.photo || "/placeholder.svg"}
                  alt={admin.name}
                  className="rounded-full w-24 h-24 mx-auto border-4 border-white shadow-md"
                />
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-sky-600 hover:bg-sky-700"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Change photo</span>
                </Button>
              </div>
              <CardTitle>{admin.name}</CardTitle>
              <CardDescription>{admin.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="text-sm">{admin.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm">{admin.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Profile Completeness</p>
                <Progress value={90} className="h-2 mt-2" />
                <p className="text-xs text-gray-500 mt-1">90% complete</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Access Logs
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="department">Department Details</TabsTrigger>
              <TabsTrigger value="security">Security Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="name"
                          className="pl-9"
                          value={formData.personal.name}
                          onChange={(e) => handleInputChange("personal", "name", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-9"
                          value={formData.personal.email}
                          onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="phone"
                          className="pl-9"
                          value={formData.personal.phone}
                          onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Office Address
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="address"
                          className="pl-9"
                          value={formData.personal.address}
                          onChange={(e) => handleInputChange("personal", "address", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Professional Bio
                    </label>
                    <Textarea
                      id="bio"
                      rows={4}
                      placeholder="Write a short bio about your role"
                      value={formData.personal.bio}
                      onChange={(e) => handleInputChange("personal", "bio", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => handleSave("personal")}
                    disabled={isLoading}
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="department">
              <Card>
                <CardHeader>
                  <CardTitle>Department Details</CardTitle>
                  <CardDescription>Update your department information and role details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="department" className="text-sm font-medium">
                        Department
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="department"
                          className="pl-9"
                          value={formData.department.department}
                          onChange={(e) => handleInputChange("department", "department", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role" className="text-sm font-medium">
                        Role
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="role"
                          className="pl-9"
                          value={formData.department.role}
                          onChange={(e) => handleInputChange("department", "role", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="employeeId" className="text-sm font-medium">
                        Employee ID
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="employeeId"
                          className="pl-9"
                          value={formData.department.employeeId}
                          onChange={(e) => handleInputChange("department", "employeeId", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="joinDate" className="text-sm font-medium">
                        Join Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="joinDate"
                          type="date"
                          className="pl-9"
                          value={formData.department.joinDate}
                          onChange={(e) => handleInputChange("department", "joinDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="supervisor" className="text-sm font-medium">
                        Supervisor
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="supervisor"
                          className="pl-9"
                          value={formData.department.supervisor}
                          onChange={(e) => handleInputChange("department", "supervisor", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="accessLevel" className="text-sm font-medium">
                        Access Level
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="accessLevel"
                          className="pl-9"
                          value={formData.department.accessLevel}
                          onChange={(e) => handleInputChange("department", "accessLevel", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => handleSave("department")}
                    disabled={isLoading}
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and access settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="lastPasswordChange" className="text-sm font-medium">
                        Last Password Change
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="lastPasswordChange"
                          type="date"
                          className="pl-9"
                          value={formData.security.lastPasswordChange}
                          onChange={(e) => handleInputChange("security", "lastPasswordChange", e.target.value)}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="recoveryEmail" className="text-sm font-medium">
                        Recovery Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="recoveryEmail"
                          type="email"
                          className="pl-9"
                          value={formData.security.recoveryEmail}
                          onChange={(e) => handleInputChange("security", "recoveryEmail", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 font-medium mr-2">Enabled</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium">Login Notifications</h3>
                        <p className="text-xs text-gray-500">Get notified when someone logs into your account</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 font-medium mr-2">Enabled</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium">Security Questions</h3>
                        <p className="text-xs text-gray-500">Set up questions to verify your identity</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 font-medium mr-2">3/3 Configured</span>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium">Access Logs</h3>
                        <p className="text-xs text-gray-500">View a history of your account access</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => handleSave("security")}
                    disabled={isLoading}
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}

