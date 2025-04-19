"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Calendar,
  Clock,
  Shield,
  Settings,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Cake,
  Droplet,
  Save,
  Camera,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useUser } from "@/context/UserContext"


export default function PatientProfilePage() {
  const { user } = useAuth()
  const { user: userContext } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  console.log("User Context on dashboard :", userContext)

  interface Profile {
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    bloodType: string;
    height: string;
    weight: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    allergies: string[];
    chronicConditions: string[];
    bio: string;
  }

  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    height: "",
    weight: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    allergies: [],
    chronicConditions: [],
    bio: "",
  });

 useEffect(() => {
  if (userContext?.data) {
    // Extract basic details from the nested structure
    const basicDetails = userContext.data.basic_details?.data || {};
    const address = basicDetails.address || {};
    const medicalDetails = userContext.data.medical_details || {};

    setProfile({
      name: basicDetails.name || "John Doe",
      email: basicDetails.email_hash ? `${basicDetails.email_hash}@example.com` : "risshirajsen@example.com",
      phone: basicDetails.mobile_hash ? `+91 ${basicDetails.mobile_hash}` : "+91 9876543210",
      address: `${address.house || ''}, ${address.street || ''}, ${address.vtc || ''}, ${address.district || ''}, ${address.state || ''}, ${address.country || ''} - ${address.pincode || ''}`,
      dateOfBirth: basicDetails.dateofBirth|| "1990-01-01",
      gender: basicDetails.gender || "male",
      bloodType: medicalDetails.bloodGroup || "O+",
      height: "175",
      weight: "70",
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "+91 9876543211",
      },
      allergies: medicalDetails.allergies?.map((a) => `${a.reaction} (${a.severity})`) || [],
      chronicConditions: [],
      bio: `Hello, I am ${basicDetails.name || 'there'}. I care about my health and wellbeing.`,
    });

    setIsLoading(false);
  }
}, [userContext]);

  // Simulate loading profile data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleProfileChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
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

  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/patient",
      icon: <FileText className="h-4 w-4" />,
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
      title: "Access Logs",
      href: "/dashboard/patient/logs",
      icon: <Clock className="h-4 w-4" />,
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
      title="My Profile"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
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
                <CardDescription>Your personal information</CardDescription>
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
                <p className="text-gray-500 text-sm">Patient ID: HLTH-1234-5678</p>

                <div className="w-full mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile Completeness</span>
                    <span className="text-sky-600">85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-gray-200" indicatorClassName="bg-sky-600" />
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
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium">{profile.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Cake className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Droplet className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood Type</p>
                      <p className="text-sm font-medium">{profile.bloodType}</p>
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
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="medical">Medical Info</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
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

                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={profile.dateOfBirth}
                            onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={profile.gender}
                            onValueChange={(value) => handleProfileChange("gender", value)}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
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

                  <TabsContent value="medical">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodType">Blood Type</Label>
                          <Select
                            value={profile.bloodType}
                            onValueChange={(value) => handleProfileChange("bloodType", value)}
                          >
                            <SelectTrigger id="bloodType">
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="Unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={profile.height}
                            onChange={(e) => handleProfileChange("height", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={profile.weight}
                            onChange={(e) => handleProfileChange("weight", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies (comma separated)</Label>
                        <Textarea
                          id="allergies"
                          value={profile.allergies.join(", ")}
                          onChange={(e) => handleArrayChange("allergies", e.target.value)}
                          placeholder="e.g., Penicillin, Peanuts, Latex"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="chronicConditions">Chronic Conditions (comma separated)</Label>
                        <Textarea
                          id="chronicConditions"
                          value={profile.chronicConditions.join(", ")}
                          onChange={(e) => handleArrayChange("chronicConditions", e.target.value)}
                          placeholder="e.g., Hypertension, Diabetes, Asthma"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="emergency">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyName">Contact Name</Label>
                          <Input
                            id="emergencyName"
                            value={profile.emergencyContact.name}
                            onChange={(e) => handleProfileChange("emergencyContact.name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emergencyRelationship">Relationship</Label>
                          <Input
                            id="emergencyRelationship"
                            value={profile.emergencyContact.relationship}
                            onChange={(e) => handleProfileChange("emergencyContact.relationship", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="emergencyPhone">Phone Number</Label>
                          <Input
                            id="emergencyPhone"
                            value={profile.emergencyContact.phone}
                            onChange={(e) => handleProfileChange("emergencyContact.phone", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-amber-800 font-medium">Important Note</h3>
                            <p className="text-amber-700 text-sm mt-1">
                              Your emergency contact will only be notified in case of a medical emergency. They will not
                              have access to your medical records unless explicitly granted.
                            </p>
                          </div>
                        </div>
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

