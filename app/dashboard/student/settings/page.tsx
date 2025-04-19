"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Settings, LogOut, Database, FileText, BarChart, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  // Mock user profile data
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@mru.edu",
    institution: "Medical Research University",
    department: "Health Informatics",
    phone: "+1 (555) 123-4567",
    bio: "Researcher focused on healthcare data analytics and machine learning applications in medical diagnostics.",
  })

  // Mock notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    datasetUpdates: true,
    accessRequests: true,
    projectUpdates: true,
    securityAlerts: true,
  })

  // Mock privacy settings
  const [privacy, setPrivacy] = useState({
    shareResearchProfile: true,
    allowDatasetContribution: true,
    anonymizePersonalData: true,
    allowCollaboration: true,
  })

  const handleSaveProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      toast.success("Profile updated successfully")
      setIsSaving(false)
    }, 1500)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)
    setTimeout(() => {
      toast.success("Notification preferences updated")
      setIsSaving(false)
    }, 1000)
  }

  const handleSavePrivacy = () => {
    setIsSaving(true)
    setTimeout(() => {
      toast.success("Privacy settings updated")
      setIsSaving(false)
    }, 1000)
  }

  const handleChangePassword = () => {
    setIsSaving(true)
    setTimeout(() => {
      toast.success("Password changed successfully")
      setIsSaving(false)
    }, 1500)
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handlePrivacyChange = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard/student",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Datasets",
      href: "/dashboard/student/datasets",
      icon: <Database className="h-4 w-4" />,
    },
    {
      title: "Projects",
      href: "/dashboard/student/projects",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/student/analytics",
      icon: <BarChart className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/student/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <LogOut className="h-4 w-4" />,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Settings"
      user={user || { name: "", email: "" }}
      notifications={1}
      requiredRole="student"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Account Settings</CardTitle>
            <CardDescription>Manage your account preferences and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-2xl font-bold">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{profile.name}</h3>
                      <p className="text-gray-600">{profile.institution}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" value={profile.email} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        name="institution"
                        value={profile.institution}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={profile.department}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Preferences</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={() => handleNotificationChange("email")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Browser Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                        </div>
                        <Switch
                          checked={notifications.browser}
                          onCheckedChange={() => handleNotificationChange("browser")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Dataset Updates</h4>
                          <p className="text-sm text-gray-600">
                            Notify when datasets are updated or new ones are available
                          </p>
                        </div>
                        <Switch
                          checked={notifications.datasetUpdates}
                          onCheckedChange={() => handleNotificationChange("datasetUpdates")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Access Requests</h4>
                          <p className="text-sm text-gray-600">Notify when someone requests access to your data</p>
                        </div>
                        <Switch
                          checked={notifications.accessRequests}
                          onCheckedChange={() => handleNotificationChange("accessRequests")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Project Updates</h4>
                          <p className="text-sm text-gray-600">Notify about changes to projects you're involved in</p>
                        </div>
                        <Switch
                          checked={notifications.projectUpdates}
                          onCheckedChange={() => handleNotificationChange("projectUpdates")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Security Alerts</h4>
                          <p className="text-sm text-gray-600">Notify about security-related events</p>
                        </div>
                        <Switch
                          checked={notifications.securityAlerts}
                          onCheckedChange={() => handleNotificationChange("securityAlerts")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-sky-600 hover:bg-sky-700"
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Research Profile Visibility</h4>
                          <p className="text-sm text-gray-600">
                            Allow other researchers to see your profile and research interests
                          </p>
                        </div>
                        <Switch
                          checked={privacy.shareResearchProfile}
                          onCheckedChange={() => handlePrivacyChange("shareResearchProfile")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Dataset Contributions</h4>
                          <p className="text-sm text-gray-600">
                            Allow your contributions to be visible in dataset metadata
                          </p>
                        </div>
                        <Switch
                          checked={privacy.allowDatasetContribution}
                          onCheckedChange={() => handlePrivacyChange("allowDatasetContribution")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Anonymize Personal Data</h4>
                          <p className="text-sm text-gray-600">Anonymize your personal data in research publications</p>
                        </div>
                        <Switch
                          checked={privacy.anonymizePersonalData}
                          onCheckedChange={() => handlePrivacyChange("anonymizePersonalData")}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Collaboration Requests</h4>
                          <p className="text-sm text-gray-600">
                            Allow other researchers to send you collaboration requests
                          </p>
                        </div>
                        <Switch
                          checked={privacy.allowCollaboration}
                          onCheckedChange={() => handlePrivacyChange("allowCollaboration")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSavePrivacy} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        "Save Privacy Settings"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="bg-sky-600 hover:bg-sky-700"
                        onClick={handleChangePassword}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Changing...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Login Sessions</h3>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium mb-2">Current Session</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Chrome on Windows • Boston, USA</p>
                          <p className="text-xs text-gray-600">Started 2 hours ago</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                    </div>

                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Shield className="mr-2 h-4 w-4" />
                      Log Out of All Devices
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

