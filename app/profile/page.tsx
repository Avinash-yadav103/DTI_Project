"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  User,
  Shield,
  Fingerprint,
  UserCheck,
  Map,
  Calendar,
  Loader2,
  Download
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function AadharProfilePage() {
  const { user } = useAuth()
  const [isLoadingAadhar, setIsLoadingAadhar] = useState(true)
  const [aadharProfile, setAadharProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loadingDownload, setLoadingDownload] = useState(false)

  // Simulate fetching Aadhar data
  useEffect(() => {
    const fetchAadharData = async () => {
      try {
        // In real implementation, this would be an API call to fetch Aadhar data
        // Currently using mock data
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate loading
        
        setAadharProfile({
          name: "Priya Sharma",
          aadharNumber: "7894 5612 3489",
          dob: "15-08-1992",
          gender: "Female",
          address: "42B, Laxmi Apartments, Sector 10, Navi Mumbai, Maharashtra - 400705",
          phoneNumber: "+91 98765 43210",
          email: "priya.sharma@example.com",
          photo: "/api/placeholder/120/120", // Placeholder for Aadhar photo
          fingerprint: true,
          iris: true,
          role: "doctor", // One of: doctor, patient, government, researcher
          roleDetails: {
            doctor: {
              specialty: "Cardiology",
              licenseNumber: "MCI-12345",
              hospital: "City Medical Center",
              experience: "10 years"
            }
          },
          lastVerified: "15-03-2023",
          registeredOn: "10-05-2018",
          documentValidity: "Valid",
          linkedServices: ["Healthcare", "Banking", "Tax Filing"]
        })
        
        setIsLoadingAadhar(false)
      } catch (error) {
        console.error("Error fetching Aadhar data:", error)
        setIsLoadingAadhar(false)
      }
    }

    fetchAadharData()
  }, [])

  const handleDownloadAadhar = async () => {
    setLoadingDownload(true)
    try {
      // In real implementation, this would initiate a download of Aadhar data
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading
      console.log("Downloading Aadhar card...")
    } catch (error) {
      console.error("Error downloading Aadhar:", error)
    } finally {
      setLoadingDownload(false)
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "doctor": return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "patient": return "bg-green-100 text-green-800 hover:bg-green-200"
      case "government": return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "researcher": return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "doctor": return <UserCheck className="h-5 w-5" />
      case "patient": return <User className="h-5 w-5" />
      case "government": return <Shield className="h-5 w-5" />
      case "researcher": return <FileText className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <Fingerprint className="h-4 w-4" />,
    },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Verification",
      href: "/dashboard/verification",
      icon: <Shield className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <User className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const getRoleTitle = (role) => {
    switch (role) {
      case "doctor": return "Healthcare Professional"
      case "patient": return "Patient"
      case "government": return "Government Official"
      case "researcher": return "Healthcare Researcher"
      default: return "User"
    }
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Aadhar Profile"
      user={user || { name: "", email: "" }}
      notifications={2}
      requiredRole="user"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aadhar Identity</CardTitle>
            <CardDescription>Verified information from your Aadhar card</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAadhar ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
              </div>
            ) : aadharProfile ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden border border-gray-200 mb-3">
                    <img src={aadharProfile.photo} alt="Aadhar Photo" className="w-32 h-32 object-cover" />
                  </div>
                  <Badge className={`mb-2 ${getRoleBadgeColor(aadharProfile.role)}`}>
                    <span className="flex items-center gap-1">
                      {getRoleIcon(aadharProfile.role)}
                      <span>{getRoleTitle(aadharProfile.role)}</span>
                    </span>
                  </Badge>
                  <div className="text-xs text-center text-gray-600">
                    Last verified: {aadharProfile.lastVerified}
                  </div>
                </div>
                
                <div className="flex-1">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Full Name</dt>
                      <dd>{aadharProfile.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Aadhar Number</dt>
                      <dd className="font-mono">{aadharProfile.aadharNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Date of Birth</dt>
                      <dd>{aadharProfile.dob}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Gender</dt>
                      <dd>{aadharProfile.gender}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-gray-600">Address</dt>
                      <dd>{aadharProfile.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Phone</dt>
                      <dd>{aadharProfile.phoneNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Email</dt>
                      <dd>{aadharProfile.email}</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Biometric Authentication</h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Fingerprint {aadharProfile.fingerprint ? "✓" : "✗"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-sky-600" />
                        <span className="text-sm">Iris Scan {aadharProfile.iris ? "✓" : "✗"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Failed to load Aadhar profile data. Please try again later.</p>
              </div>
            )}
          </CardContent>
          {aadharProfile && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleDownloadAadhar}
                disabled={loadingDownload}
              >
                {loadingDownload ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Aadhar Details
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAadhar ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
              </div>
            ) : aadharProfile ? (
              <>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Document Validity</span>
                      <span className="text-green-600 font-medium">{aadharProfile.documentValidity}</span>
                    </div>
                    <Progress value={100} className="h-2 bg-gray-200" indicatorClassName="bg-green-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Role Verification</span>
                      <span className="text-green-600 font-medium">Verified</span>
                    </div>
                    <Progress value={100} className="h-2 bg-gray-200" indicatorClassName="bg-green-600" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Linked Services</span>
                      <span className="text-sky-600 font-medium">{aadharProfile.linkedServices.length}</span>
                    </div>
                    <Progress 
                      value={(aadharProfile.linkedServices.length / 5) * 100} 
                      className="h-2 bg-gray-200" 
                      indicatorClassName="bg-sky-600" 
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Linked Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {aadharProfile.linkedServices.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-50">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No verification data available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {aadharProfile && aadharProfile.role === "doctor" && (
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="professional">Professional Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Registration Timeline</CardTitle>
                <CardDescription>History of your Aadhar verification and role registration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium">Aadhar Registration</h3>
                      <p className="text-sm text-gray-600">Initial registration of your Aadhar card</p>
                      <p className="text-sm text-gray-500 mt-1">Registered on {aadharProfile.registeredOn}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium">Doctor Verification</h3>
                      <p className="text-sm text-gray-600">Verification of medical license and credentials</p>
                      <p className="text-sm text-gray-500 mt-1">Verified on 23-09-2018</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium">Hospital Affiliation Added</h3>
                      <p className="text-sm text-gray-600">City Medical Center affiliation verified</p>
                      <p className="text-sm text-gray-500 mt-1">Added on 05-10-2018</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-medium">Last Address Verification</h3>
                      <p className="text-sm text-gray-600">Periodic address verification completed</p>
                      <p className="text-sm text-gray-500 mt-1">Verified on {aadharProfile.lastVerified}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Your verified medical credentials linked with Aadhar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Medical Specialty</h3>
                      <p>{aadharProfile.roleDetails.doctor.specialty}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">License Number</h3>
                      <p className="font-mono">{aadharProfile.roleDetails.doctor.licenseNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Experience</h3>
                      <p>{aadharProfile.roleDetails.doctor.experience}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Hospital Affiliation</h3>
                      <p>{aadharProfile.roleDetails.doctor.hospital}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Verification Status</h3>
                      <Badge className="bg-green-100 text-green-800">Fully Verified</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Database Status</h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                        <span className="text-xs text-gray-500">Last Updated: 10-01-2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium mb-4">Authorized Access Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Patient Records</h4>
                      </div>
                      <p className="text-sm text-gray-700">Full access to patient medical records with consent</p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <h4 className="font-medium">Prescription</h4>
                      </div>
                      <p className="text-sm text-gray-700">Authorized to prescribe all medication classes</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Research</h4>
                      </div>
                      <p className="text-sm text-gray-700">Access to anonymized research data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {aadharProfile && aadharProfile.role === "patient" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Healthcare Information</CardTitle>
            <CardDescription>Your healthcare details linked with Aadhar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Health ID</h3>
                  <p className="font-mono">ABHA-2345-6789</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Blood Group</h3>
                  <p>B+</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Emergency Contact</h3>
                  <p>+91 98123 45678 (Rajesh Sharma)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Insurance Status</h3>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Primary Care Doctor</h3>
                  <p>Dr. Anand Mehta</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Last Hospital Visit</h3>
                  <p>City Medical Center (03-02-2023)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {aadharProfile && aadharProfile.role === "government" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Government Official Details</CardTitle>
            <CardDescription>Your verified government credentials linked with Aadhar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Department</h3>
                  <p>Ministry of Health & Family Welfare</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Employee ID</h3>
                  <p className="font-mono">GOV-MH-34567</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Position</h3>
                  <p>Deputy Director</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Office Location</h3>
                  <p>Mumbai Regional Office</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Clearance Level</h3>
                  <Badge className="bg-purple-100 text-purple-800">Level 3</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Jurisdiction</h3>
                  <p>Maharashtra State</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium mb-4">Access Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium">Policy Administration</h4>
                  </div>
                  <p className="text-sm text-gray-700">Full access to healthcare policy management</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Statistics Access</h4>
                  </div>
                  <p className="text-sm text-gray-700">Access to anonymized healthcare statistics</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium">Individual Records</h4>
                  </div>
                  <p className="text-sm text-gray-700">No access to individual patient records</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {aadharProfile && aadharProfile.role === "researcher" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Researcher Information</CardTitle>
            <CardDescription>Your verified research credentials linked with Aadhar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Institution</h3>
                  <p>National Medical Research Institute</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Researcher ID</h3>
                  <p className="font-mono">ICMR-RES-12345</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Research Field</h3>
                  <p>Public Health Epidemiology</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Current Project</h3>
                  <p>National Diabetes Prevention Study</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Ethics Clearance</h3>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Data Access Level</h3>
                  <Badge className="bg-amber-100 text-amber-800">Level 2 - Anonymized</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium mb-4">Research Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Anonymized Data</h4>
                  </div>
                  <p className="text-sm text-gray-700">Full access to anonymized research data</p>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <h4 className="font-medium">Demographic Data</h4>
                  </div>
                  <p className="text-sm text-gray-700">Access to demographic insights</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium">Personal Data</h4>
                  </div>
                  <p className="text-sm text-gray-700">No access to personally identifiable data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}