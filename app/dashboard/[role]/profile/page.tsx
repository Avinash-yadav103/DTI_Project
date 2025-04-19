"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth, type UserRole } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, User, Shield, Calendar, Settings, LogOut } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const params = useParams()
  const { user, logout } = useAuth()
  const role = params.role as UserRole

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 9876543210",
    address: "123 Main Street, City, Country",
    bio: "Healthcare professional with 10+ years of experience.",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // In a real app, you would save this data to your backend
    toast.success("Profile updated successfully")
    setIsEditing(false)
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

  if (!user) {
    return null
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Profile"
      user={user}
      notifications={3}
      requiredRole={role}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself"
                  />
                </div>
                <Button onClick={handleSaveProfile} className="bg-sky-600 hover:bg-sky-700">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                  <p>{formData.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                  <p>{formData.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
                  <p>{formData.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                  <p>{formData.address}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                  <p>{formData.bio}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive updates about your account activity</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-500">Update your password regularly for better security</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

