"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Filter,
  Home,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Share2,
  Shield,
  Syringe,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { patientApi } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"

export default function VaccinationsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { user: loggedInUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [vaccinations, setVaccinations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedVaccination, setExpandedVaccination] = useState<number | null>(null)
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [newVaccination, setNewVaccination] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    manufacturer: "",
    batchNumber: "",
    location: "",
    givenBy: "",
    notes: "",
  })

  // Mock vaccination data
  const mockVaccinations = [
    {
      id: 1,
      name: "COVID-19 (Dose 1)",
      date: "2022-01-15",
      manufacturer: "Pfizer-BioNTech",
      batchNumber: "EK5730",
      location: "City General Hospital",
      givenBy: "Dr. Sarah Johnson",
      category: "COVID-19",
      notes: "No immediate adverse reactions. Patient monitored for 15 minutes post-vaccination.",
      documents: [{ name: "COVID-19 Vaccination Certificate", type: "PDF" }],
    },
    {
      id: 2,
      name: "COVID-19 (Dose 2)",
      date: "2022-02-05",
      manufacturer: "Pfizer-BioNTech",
      batchNumber: "EL8921",
      location: "City General Hospital",
      givenBy: "Dr. Michael Chen",
      category: "COVID-19",
      notes: "Mild fatigue reported for 24 hours after vaccination. No other adverse effects.",
      documents: [{ name: "COVID-19 Vaccination Certificate", type: "PDF" }],
    },
    {
      id: 3,
      name: "Influenza (Annual)",
      date: "2022-10-10",
      manufacturer: "Sanofi Pasteur",
      batchNumber: "IN2209876",
      location: "Community Health Clinic",
      givenBy: "Nurse Patel",
      category: "Influenza",
      notes: "Annual flu vaccination. No adverse reactions.",
      documents: [{ name: "Influenza Vaccination Record", type: "PDF" }],
    },
    {
      id: 4,
      name: "Tetanus-Diphtheria (Td) Booster",
      date: "2020-06-22",
      manufacturer: "GlaxoSmithKline",
      batchNumber: "TD9807123",
      location: "Medical Research Institute",
      givenBy: "Dr. Emily Wong",
      category: "Routine",
      notes: "10-year booster. Mild soreness at injection site.",
      documents: [{ name: "Tetanus Booster Record", type: "PDF" }],
    },
    {
      id: 5,
      name: "Hepatitis B (Dose 3)",
      date: "2019-07-05",
      manufacturer: "Merck",
      batchNumber: "HB87654",
      location: "City General Hospital",
      givenBy: "Dr. Robert Miller",
      category: "Hepatitis",
      notes: "Completion of Hepatitis B series. No adverse reactions reported.",
      documents: [{ name: "Hepatitis B Vaccination Series Completion", type: "PDF" }],
    },
  ]

  useEffect(() => {
    // Simulate loading vaccination data
    const loadVaccinations = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setVaccinations(mockVaccinations)
      } catch (error) {
        console.error("Error loading vaccinations:", error)
        toast.error("Failed to load vaccination records")
      } finally {
        setIsLoading(false)
      }
    }

    loadVaccinations()
  }, [])

  const handleUploadVaccination = () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      setIsAddVaccinationOpen(true)
    }, 1000)
  }

  const handleAddVaccination = () => {
    if (!newVaccination.name || !newVaccination.date) {
      toast.error("Please fill all required fields")
      return
    }

    setIsLoading(true)
    
    // Simulate adding a new vaccination
    setTimeout(() => {
      const newRecord = {
        id: vaccinations.length + 1,
        ...newVaccination,
        category: determineCategoryFromName(newVaccination.name),
        documents: [],
      }
      
      setVaccinations([newRecord, ...vaccinations])
      setNewVaccination({
        name: "",
        date: new Date().toISOString().split("T")[0],
        manufacturer: "",
        batchNumber: "",
        location: "",
        givenBy: "",
        notes: "",
      })
      
      setIsAddVaccinationOpen(false)
      setIsLoading(false)
      toast.success("Vaccination record added successfully")
    }, 1000)
  }

  const determineCategoryFromName = (name) => {
    name = name.toLowerCase()
    if (name.includes("covid")) return "COVID-19"
    if (name.includes("flu") || name.includes("influenza")) return "Influenza"
    if (name.includes("hepatitis")) return "Hepatitis"
    if (name.includes("tetanus") || name.includes("mmr") || name.includes("polio")) return "Routine"
    return "Other"
  }

  const handleDownloadVaccination = (id) => {
    toast.success("Downloading vaccination record...")
    // Implement actual download logic here
  }

  const handleShareVaccination = (id) => {
    toast.success("Sharing vaccination record...")
    // Implement actual sharing logic here
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewVaccination({ ...newVaccination, [name]: value })
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredVaccinations = vaccinations.filter((vaccination) => {
    const matchesSearch = 
      vaccination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.givenBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaccination.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || vaccination.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const uniqueCategories = [...new Set(vaccinations.map(v => v.category))]

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/patient",
      icon: <Home className="h-4 w-4" />,
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
      title: "Vaccinations",
      href: "/dashboard/patient/vaccinations",
      icon: <Syringe className="h-4 w-4" />,
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
      title="Vaccinations"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">Vaccination Records</CardTitle>
              <CardDescription>Track and manage your vaccination history</CardDescription>
            </div>
            <Button onClick={handleUploadVaccination} className="bg-sky-600 hover:bg-sky-700" disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vaccination
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search vaccinations..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                </div>
              ) : filteredVaccinations.length > 0 ? (
                <div className="space-y-4">
                  {filteredVaccinations.map((vaccination) => (
                    <div
                      key={vaccination.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div
                        className="bg-white p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => 
                          setExpandedVaccination(expandedVaccination === vaccination.id ? null : vaccination.id)
                        }
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Syringe className="h-5 w-5 text-sky-600" />
                              <h3 className="font-medium">{vaccination.name}</h3>
                              <Badge className={`
                                ${vaccination.category === "COVID-19" 
                                  ? "bg-green-100 text-green-800" 
                                  : vaccination.category === "Influenza"
                                    ? "bg-blue-100 text-blue-800"
                                    : vaccination.category === "Hepatitis"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-purple-100 text-purple-800"
                                }
                              `}>
                                {vaccination.category}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(vaccination.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadVaccination(vaccination.id);
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareVaccination(vaccination.id);
                              }}
                            >
                              <Share2 className="h-4 w-4 mr-1" />
                              Share
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  expandedVaccination === vaccination.id ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {expandedVaccination === vaccination.id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Manufacturer</h4>
                                <p className="text-gray-900">{vaccination.manufacturer}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Batch Number</h4>
                                <p className="text-gray-900">{vaccination.batchNumber}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Location</h4>
                                <p className="text-gray-900">{vaccination.location}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Given By</h4>
                                <p className="text-gray-900">{vaccination.givenBy}</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-gray-600">Notes</h4>
                                <p className="text-gray-900">{vaccination.notes}</p>
                              </div>
                              
                              {vaccination.documents && vaccination.documents.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-600">Documents</h4>
                                  <ul className="mt-2 space-y-1">
                                    {vaccination.documents.map((doc, index) => (
                                      <li key={index} className="flex items-center">
                                        <FileText className="h-4 w-4 text-sky-600 mr-2" />
                                        <span className="text-sm">{doc.name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                  <Syringe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Vaccination Records</h3>
                  <p className="text-gray-600 mt-1">
                    {searchTerm || selectedCategory !== "all"
                      ? "No records match your search criteria. Try adjusting your filters."
                      : "You haven't added any vaccination records yet."}
                  </p>
                  {(searchTerm || selectedCategory !== "all") && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Vaccination Dialog */}
      <Dialog open={isAddVaccinationOpen} onOpenChange={setIsAddVaccinationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vaccination Record</DialogTitle>
            <DialogDescription>
              Enter the details of your vaccination to keep your health record up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Vaccine Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., COVID-19, Influenza, Tetanus"
                value={newVaccination.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date of Vaccination *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newVaccination.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  placeholder="e.g., Pfizer, Moderna"
                  value={newVaccination.manufacturer}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="batchNumber">Batch/Lot Number</Label>
                <Input
                  id="batchNumber"
                  name="batchNumber"
                  placeholder="e.g., EK5730"
                  value={newVaccination.batchNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Vaccination Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., City General Hospital"
                value={newVaccination.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="givenBy">Healthcare Provider</Label>
              <Input
                id="givenBy"
                name="givenBy"
                placeholder="e.g., Dr. Sarah Johnson"
                value={newVaccination.givenBy}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any side effects, observations, or additional information"
                value={newVaccination.notes}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label>Upload Documents (Optional)</Label>
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <Syringe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drag and drop your vaccination certificate or record</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG files up to 5MB</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Browse Files
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsAddVaccinationOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleAddVaccination}>
              <Check className="h-4 w-4 mr-2" />
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
