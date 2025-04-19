"use client"

import { useState } from "react"
import { User, Mail, Phone, Building, Award, Calendar, Save, Loader2, FileText, Clock } from "lucide-react"
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

export default function DoctorProfile() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    personal: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@cityhospital.com",
      phone: "+91 9876543210",
      address: "123 Medical Avenue, Bangalore, Karnataka",
      bio: "General physician with over 10 years of experience in treating chronic conditions and preventive healthcare.",
    },
    professional: {
      specialty: "General Physician",
      hospital: "City General Hospital",
      licenseNumber: "MED-KA-2013-45678",
      experience: "10 years",
      education: "MBBS, MD - General Medicine",
      certifications: "Board Certified in Internal Medicine, Advanced Cardiac Life Support",
    },
    schedule: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 1:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 2:00 PM",
      sunday: "Off",
    },
  })

  // Mock data
  const doctor = {
    name: "Dr. Sarah Johnson",
    id: "DOC-5678-1234",
    specialty: "General Physician",
    hospital: "City General Hospital",
    email: "sarah.johnson@cityhospital.com",
    phone: "+91 9876543210",
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
      title: "Dashboard",
      href: "/dashboard/doctor",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Patients",
      href: "/dashboard/doctor/patients",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/doctor/appointments",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/doctor/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/doctor/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/doctor/settings",
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
      title="Doctor Profile"
      user={doctor}
      notifications={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <img
                  src={doctor.photo || "/placeholder.svg"}
                  alt={doctor.name}
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
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>{doctor.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">ID</p>
                <p className="text-sm">{doctor.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Hospital</p>
                <p className="text-sm">{doctor.hospital}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Profile Completeness</p>
                <Progress value={85} className="h-2 mt-2" />
                <p className="text-xs text-gray-500 mt-1">85% complete</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Public Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule & Availability</TabsTrigger>
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
                        Address
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
                      placeholder="Write a short bio about yourself"
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

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Update your professional qualifications and experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="specialty" className="text-sm font-medium">
                        Specialty
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="specialty"
                          className="pl-9"
                          value={formData.professional.specialty}
                          onChange={(e) => handleInputChange("professional", "specialty", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="hospital" className="text-sm font-medium">
                        Hospital/Clinic
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="hospital"
                          className="pl-9"
                          value={formData.professional.hospital}
                          onChange={(e) => handleInputChange("professional", "hospital", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="license" className="text-sm font-medium">
                        License Number
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="license"
                          className="pl-9"
                          value={formData.professional.licenseNumber}
                          onChange={(e) => handleInputChange("professional", "licenseNumber", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="experience" className="text-sm font-medium">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="experience"
                          className="pl-9"
                          value={formData.professional.experience}
                          onChange={(e) => handleInputChange("professional", "experience", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="education" className="text-sm font-medium">
                      Education
                    </label>
                    <Textarea
                      id="education"
                      rows={2}
                      placeholder="List your educational qualifications"
                      value={formData.professional.education}
                      onChange={(e) => handleInputChange("professional", "education", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="certifications" className="text-sm font-medium">
                      Certifications
                    </label>
                    <Textarea
                      id="certifications"
                      rows={2}
                      placeholder="List your certifications and specializations"
                      value={formData.professional.certifications}
                      onChange={(e) => handleInputChange("professional", "certifications", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => handleSave("professional")}
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

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Availability</CardTitle>
                  <CardDescription>Set your working hours and availability for appointments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {Object.entries(formData.schedule).map(([day, hours]) => (
                      <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-1">
                          <label htmlFor={day} className="text-sm font-medium capitalize">
                            {day}
                          </label>
                        </div>
                        <div className="md:col-span-3 relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id={day}
                            className="pl-9"
                            value={hours}
                            onChange={(e) => handleInputChange("schedule", day, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={() => handleSave("schedule")}
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

