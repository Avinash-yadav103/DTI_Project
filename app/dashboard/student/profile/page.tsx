"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Database,
  BarChart,
  Settings,
  LogOut,
  User,
  Mail,
  Phone,
  GraduationCap,
  Save,
  Camera,
  Building,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Update the sidebar items and footer items to handle logout properly
import { useRouter } from "next/navigation"

export default function StudentProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // Profile state
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@mru.edu",
    phone: "+1 (555) 123-4567",
    address: "456 University Ave, Boston, MA",
    institution: "Medical Research University",
    department: "Health Informatics",
    degree: "Ph.D.",
    graduationYear: "2025",
    researchInterests: [
      "Healthcare Data Analytics",
      "Machine Learning in Medical Diagnostics",
      "Blockchain in Healthcare",
    ],
    publications: [
      {
        title: "Machine Learning Applications in Early Disease Detection",
        journal: "Journal of Medical Informatics",
        year: "2022",
        url: "https://example.com/publication1",
      },
      {
        title: "Blockchain-Based Medical Records: A Systematic Review",
        journal: "Healthcare Technology Review",
        year: "2023",
        url: "https://example.com/publication2",
      },
    ],
    bio: "Researcher focused on healthcare data analytics and machine learning applications in medical diagnostics.",
  })

  // Simulate loading profile data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }))
  }

  const handleSaveProfile = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      toast.success("Profile updated successfully")
      setIsSaving(false)
    }, 1500)
  }

  const handleAddPublication = () => {
    setProfile((prev) => ({
      ...prev,
      publications: [
        ...prev.publications,
        {
          title: "",
          journal: "",
          year: "",
          url: "",
        },
      ],
    }))
  }

  const handleRemovePublication = (index) => {
    setProfile((prev) => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index),
    }))
  }

  const handlePublicationChange = (index, field, value) => {
    setProfile((prev) => ({
      ...prev,
      publications: prev.publications.map((pub, i) => (i === index ? { ...pub, [field]: value } : pub)),
    }))
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
    {
      title: "Profile",
      href: "/dashboard/student/profile",
      icon: <User className="h-4 w-4" />,
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
      href: "#",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="My Profile"
      user={user || { name: "", email: "" }}
      notifications={1}
      requiredRole="student"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your researcher profile</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-4xl font-bold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-gray-200"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
                <p className="text-gray-500 text-sm">{profile.degree} Student</p>
                <Badge className="mt-2 bg-sky-100 text-sky-800 hover:bg-sky-200">Level 3 Access</Badge>

                <div className="w-full mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile Completeness</span>
                    <span className="text-sky-600">90%</span>
                  </div>
                  <Progress value={90} className="h-2 bg-gray-200" indicatorClassName="bg-sky-600" />
                </div>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Building className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Institution</p>
                      <p className="text-sm font-medium">{profile.institution}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-sm font-medium">{profile.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Degree</p>
                      <p className="text-sm font-medium">
                        {profile.degree} (Expected {profile.graduationYear})
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your researcher profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="academic">Academic Info</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => handleProfileChange("name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={profile.address}
                          onChange={(e) => handleProfileChange("address", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="academic">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="institution">Institution</Label>
                          <Input
                            id="institution"
                            value={profile.institution}
                            onChange={(e) => handleProfileChange("institution", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={profile.department}
                            onChange={(e) => handleProfileChange("department", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="degree">Degree</Label>
                          <Select
                            value={profile.degree}
                            onValueChange={(value) => handleProfileChange("degree", value)}
                          >
                            <SelectTrigger id="degree">
                              <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="B.Sc.">Bachelor of Science (B.Sc.)</SelectItem>
                              <SelectItem value="M.Sc.">Master of Science (M.Sc.)</SelectItem>
                              <SelectItem value="Ph.D.">Doctor of Philosophy (Ph.D.)</SelectItem>
                              <SelectItem value="M.D.">Doctor of Medicine (M.D.)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                          <Input
                            id="graduationYear"
                            value={profile.graduationYear}
                            onChange={(e) => handleProfileChange("graduationYear", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="research">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="researchInterests">Research Interests (comma separated)</Label>
                        <Textarea
                          id="researchInterests"
                          value={profile.researchInterests.join(", ")}
                          onChange={(e) => handleArrayChange("researchInterests", e.target.value)}
                          placeholder="e.g., Healthcare Data Analytics, Machine Learning, Blockchain"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Publications</Label>
                          <Button variant="outline" size="sm" onClick={handleAddPublication}>
                            Add Publication
                          </Button>
                        </div>

                        {profile.publications.map((pub, index) => (
                          <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">Publication #{index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleRemovePublication(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  <line x1="10" x2="10" y1="11" y2="17"></line>
                                  <line x1="14" x2="14" y1="11" y2="17"></line>
                                </svg>
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`pub-title-${index}`}>Title</Label>
                                <Input
                                  id={`pub-title-${index}`}
                                  value={pub.title}
                                  onChange={(e) => handlePublicationChange(index, "title", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`pub-journal-${index}`}>Journal/Conference</Label>
                                <Input
                                  id={`pub-journal-${index}`}
                                  value={pub.journal}
                                  onChange={(e) => handlePublicationChange(index, "journal", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`pub-year-${index}`}>Year</Label>
                                <Input
                                  id={`pub-year-${index}`}
                                  value={pub.year}
                                  onChange={(e) => handlePublicationChange(index, "year", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`pub-url-${index}`}>URL (optional)</Label>
                                <Input
                                  id={`pub-url-${index}`}
                                  value={pub.url}
                                  onChange={(e) => handlePublicationChange(index, "url", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
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
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

