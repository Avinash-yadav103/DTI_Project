"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export default function VaccinationsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { user: loggedInUser } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [vaccinations, setVaccinations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedVaccination, setExpandedVaccination] = useState(null)
  const [isAddVaccinationOpen, setIsAddVaccinationOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDemoData, setShowDemoData] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState([])

  // Add API base URL
  const API_BASE_URL = 'http://localhost:5000/api/vaccinations';

  const [newVaccination, setNewVaccination] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    manufacturer: "",
    batchNumber: "",
    location: "",
    givenBy: "",
    notes: "",
  })

  // Add these with your other state declarations
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareVaccination, setShareVaccination] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  // Keep your mockVaccinations array as fallback data
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

  // Function to fetch vaccinations from MongoDB
  const fetchVaccinations = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { patientId: user.id },
        headers: {
          'user-id': user.id,
          'user-name': user.name || 'Patient',
          'user-role': 'Patient'
        }
      });
      
      const apiVaccinations = response.data;
      
      // Format vaccinations to match our component structure
      const formattedVaccinations = apiVaccinations.map(vax => ({
        id: vax._id,
        name: vax.name,
        date: vax.date,
        manufacturer: vax.manufacturer,
        batchNumber: vax.batchNumber,
        location: vax.location,
        givenBy: vax.givenBy,
        category: vax.category,
        notes: vax.notes,
        documents: vax.documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.fileUrl
        }))
      }));
      
      // If we have real data, use it instead of mock data
      if (formattedVaccinations.length > 0) {
        setVaccinations(formattedVaccinations);
        setShowDemoData(false);
      } else if (showDemoData) {
        // Use mock data if we have no real data and demo mode is on
        setVaccinations(mockVaccinations);
      } else {
        // Empty array if no real data and demo mode is off
        setVaccinations([]);
      }
    } catch (error) {
      console.error("Error loading vaccinations:", error);
      toast.error("Failed to load vaccination records");
      
      // Use mock data in case of error
      if (showDemoData) {
        setVaccinations(mockVaccinations);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch real data if user is logged in
    if (user?.id) {
      fetchVaccinations();
    } else {
      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false);
        
        // Show mock data if demo mode is enabled
        if (showDemoData) {
          setVaccinations(mockVaccinations);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user?.id, showDemoData]);

  // Handle file input change
  const handleFileChange = (e) => {
    setUploadedFiles(Array.from(e.target.files));
  };

  // Modified function to add vaccination to MongoDB
  const handleAddVaccination = async () => {
    if (!newVaccination.name || !newVaccination.date) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      if (!user?.id) {
        // For demo mode without backend
        if (showDemoData) {
          const newRecord = {
            id: vaccinations.length + 1,
            ...newVaccination,
            category: determineCategoryFromName(newVaccination.name),
            documents: [],
          };
          
          setVaccinations([newRecord, ...vaccinations]);
          setNewVaccination({
            name: "",
            date: new Date().toISOString().split("T")[0],
            manufacturer: "",
            batchNumber: "",
            location: "",
            givenBy: "",
            notes: "",
          });
          
          setIsAddVaccinationOpen(false);
          toast.success("Vaccination record added successfully (Demo mode)");
        } else {
          toast.error("User authentication required");
        }
        setIsLoading(false);
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('patientId', user.id);
      formData.append('name', newVaccination.name);
      formData.append('date', newVaccination.date);
      formData.append('manufacturer', newVaccination.manufacturer || '');
      formData.append('batchNumber', newVaccination.batchNumber || '');
      formData.append('location', newVaccination.location || '');
      formData.append('givenBy', newVaccination.givenBy || '');
      formData.append('notes', newVaccination.notes || '');
      formData.append('category', determineCategoryFromName(newVaccination.name));
      
      // Add files
      uploadedFiles.forEach(file => {
        formData.append('documents', file);
      });
      
      // Send to MongoDB through API
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-id': user.id,
          'user-name': user.name || 'Patient',
          'user-role': 'Patient'
        }
      });
      
      // Format the saved vaccination to match our component structure
      const savedVaccination = response.data;
      const formattedVaccination = {
        id: savedVaccination._id,
        name: savedVaccination.name,
        date: savedVaccination.date,
        manufacturer: savedVaccination.manufacturer,
        batchNumber: savedVaccination.batchNumber,
        location: savedVaccination.location,
        givenBy: savedVaccination.givenBy,
        category: savedVaccination.category,
        notes: savedVaccination.notes,
        documents: savedVaccination.documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.fileUrl
        }))
      };
      
      // Add to our state
      setVaccinations(prev => [formattedVaccination, ...prev]);
      
      // Reset form
      setNewVaccination({
        name: "",
        date: new Date().toISOString().split("T")[0],
        manufacturer: "",
        batchNumber: "",
        location: "",
        givenBy: "",
        notes: "",
      });
      setUploadedFiles([]);
      setIsAddVaccinationOpen(false);
      toast.success("Vaccination record added successfully");
    } catch (error) {
      console.error("Error saving vaccination record:", error);
      toast.error("Failed to save vaccination record");
    } finally {
      setIsLoading(false);
    }
  };

  // Improve the download function to handle different document types
  const handleDownloadVaccination = (vaccination) => {
    try {
      // Check if it's a real record with documents
      if (vaccination.documents && vaccination.documents.length > 0 && vaccination.documents[0].url) {
        // For real documents stored on the server
        window.open(`http://localhost:5000${vaccination.documents[0].url}`, '_blank');
        toast.success(`Downloading ${vaccination.documents[0].name}`);
      } else {
        // For demo records, create a better formatted document
        let content = `VACCINATION RECORD\n\n`;
        content += `Name: ${vaccination.name}\n`;
        content += `Date: ${new Date(vaccination.date).toLocaleDateString()}\n`;
        content += `Manufacturer: ${vaccination.manufacturer}\n`;
        content += `Batch Number: ${vaccination.batchNumber}\n`;
        content += `Location: ${vaccination.location}\n`;
        content += `Given By: ${vaccination.givenBy}\n\n`;
        content += `Category: ${vaccination.category}\n\n`;
        content += `Notes:\n${vaccination.notes}\n\n`;
        content += `This is a digital record of your vaccination. For official verification, please consult with your healthcare provider.`;
        
        // Create a downloadable file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${vaccination.name.replace(/\s+/g, '_')}_record.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Log this download action
        if (user?.id) {
          try {
            axios.post("http://localhost:5000/api/transaction-logs", {
              patientId: user.id,
              action: "download",
              actor: {
                name: user.name || "Patient",
                role: "Patient",
                id: user.id
              },
              details: `Downloaded vaccination record: ${vaccination.name}`,
              hash: '0x' + Math.random().toString(16).substring(2, 34),
              blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
              consensusTimestamp: new Date(),
              additionalInfo: {
                ipAddress: "127.0.0.1",
                device: navigator.userAgent,
                location: "Local"
              }
            }).catch(err => console.error("Error logging download:", err));
          } catch (error) {
            console.error("Error logging download action:", error);
          }
        }
        
        toast.success("Vaccination record downloaded");
      }
    } catch (error) {
      console.error("Error downloading vaccination:", error);
      toast.error("Failed to download vaccination record");
    }
  };

  // Function to handle document download
  const handleDownloadVaccinationOld = (vaccination) => {
    // Check if it's a real record with documents
    if (vaccination.documents && vaccination.documents.length > 0 && vaccination.documents[0].url) {
      // For real documents stored on the server
      window.open(`http://localhost:5000${vaccination.documents[0].url}`, '_blank');
      toast.success(`Downloading ${vaccination.documents[0].name}`);
    } else {
      // For demo records, create a simple text file
      const content = `Vaccination Record\n\nName: ${vaccination.name}\nDate: ${vaccination.date}\nManufacturer: ${vaccination.manufacturer}\nBatch Number: ${vaccination.batchNumber}\nLocation: ${vaccination.location}\nGiven By: ${vaccination.givenBy}\nNotes: ${vaccination.notes}`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${vaccination.name.replace(/\s+/g, '_')}_record.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Vaccination record downloaded");
    }
  };

  // Helper function to determine category from name
  const determineCategoryFromName = (name) => {
    name = name.toLowerCase();
    if (name.includes('covid')) return 'COVID-19';
    if (name.includes('flu') || name.includes('influenza')) return 'Influenza';
    if (name.includes('hepatitis')) return 'Hepatitis';
    if (name.includes('tetanus') || name.includes('mmr') || name.includes('polio')) return 'Routine';
    return 'Other';
  };

  // Toggle demo data on/off
  const toggleDemoData = () => {
    setShowDemoData(prev => !prev);
  };

  // Keep all your existing handlers and state for UI functionality
  
  // Use this modified JSX in the upload section of your dialog:
  
  // In the dialog component, update the file upload section:
  // <div className="grid gap-2">
  //   <Label>Upload Documents (Optional)</Label>
  //   <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
  //     <input
  //       type="file"
  //       multiple
  //       id="document-upload"
  //       className="hidden"
  //       onChange={handleFileChange}
  //     />
  //     <label htmlFor="document-upload" className="cursor-pointer">
  //       <Syringe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
  //       <p className="text-sm text-gray-500">Upload your vaccination certificate or record</p>
  //       <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG files up to 5MB</p>
  //       <Button variant="outline" size="sm" className="mt-2" type="button">
  //         Browse Files
  //       </Button>
  //       {uploadedFiles.length > 0 && (
  //         <div className="mt-2 text-sm text-gray-600">
  //           {uploadedFiles.length} file(s) selected
  //         </div>
  //       )}
  //     </label>
  //   </div>
  // </div>

  // Add demo data toggle button
  const renderDemoToggle = () => (
    <div className="flex justify-end mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDemoData}
        className="text-xs"
      >
        {showDemoData ? "Hide Demo Data" : "Show Demo Data"}
      </Button>
    </div>
  );

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleUploadVaccination = () => {
    setIsAddVaccinationOpen(true);
  };

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

  // Move handleInputChange inside the component
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVaccination(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Move handleShareVaccination inside the component
  const handleShareVaccination = async (vaccinationId) => {
    try {
      // Find the vaccination to share
      const vaccination = vaccinations.find(v => v.id === vaccinationId);
      
      if (!vaccination) {
        toast.error("Vaccination record not found");
        return;
      }
      
      // Generate a shareable URL
      const url = generateShareUrl(vaccination);
      setShareUrl(url);
      
      // Save vaccination to share
      setShareVaccination(vaccination);
      
      // Open the share modal
      setIsShareModalOpen(true);
      
      // In a real app, you would register this link with the backend
      if (user?.id) {
        try {
          // Create a record of this share action in the backend
          // You'd typically store the shareToken, expiration, etc.
          const mockPayload = {
            patientId: user.id,
            vaccinationId: vaccination.id,
            shareToken: url.split('/').pop(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            dataShared: {
              name: vaccination.name,
              date: vaccination.date,
              manufacturer: vaccination.manufacturer,
              category: vaccination.category,
              batchNumber: vaccination.batchNumber
            }
          };
          
          // For demo purposes, we're not actually storing this
          console.log("Share payload (would be sent to server):", mockPayload);
        } catch (error) {
          console.error("Error creating shareable link:", error);
        }
      }
    } catch (error) {
      console.error("Error sharing vaccination:", error);
      toast.error("Failed to share vaccination record");
    }
  };

  // Add these inside your component
  const generateShareUrl = (vaccination) => {
    const shareToken = Math.random().toString(36).substring(2, 15);
    return `${window.location.origin}/share/vaccination/${shareToken}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
      
      // Log this action
      if (user?.id && shareVaccination) {
        logShareAction(shareVaccination, "copy");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleShareTo = async (platform, vaccination) => {
    let shareText = `Vaccination Record: ${vaccination.name} on ${new Date(vaccination.date).toLocaleDateString()}`;
    let url = "";
    
    try {
      // Log this share action
      if (user?.id) {
        logShareAction(vaccination, platform);
      }
      
      switch(platform) {
        case "whatsapp":
          url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
          window.open(url, "_blank");
          break;
          
        case "email":
          url = `mailto:?subject=Vaccination Record: ${encodeURIComponent(vaccination.name)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
          window.location.href = url;
          break;
          
        case "message":
          url = `sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`;
          window.location.href = url;
          break;
          
        case "more":
          // For mobile devices with Web Share API
          if (navigator.share) {
            await navigator.share({
              title: `Vaccination Record: ${vaccination.name}`,
              text: shareText,
              url: shareUrl
            });
          } else {
            // Fallback to copying to clipboard
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard");
          }
          break;
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      toast.error(`Failed to share to ${platform}`);
    }
  };

  const logShareAction = async (vaccination, method) => {
    try {
      await axios.post("http://localhost:5000/api/transaction-logs", {
        patientId: user.id,
        action: "share",
        actor: {
          name: user.name || "Patient",
          role: "Patient",
          id: user.id
        },
        details: `Shared vaccination record: ${vaccination.name} via ${method}`,
        hash: '0x' + Math.random().toString(16).substring(2, 34),
        blockNumber: Math.floor(Math.random() * 1000000) + 14000000,
        consensusTimestamp: new Date(),
        additionalInfo: {
          ipAddress: "127.0.0.1",
          device: navigator.userAgent,
          location: "Local",
          shareMethod: method
        }
      });
    } catch (error) {
      console.error("Error logging share action:", error);
    }
  };

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
            <div className="flex gap-2">
              {/* Add demo toggle button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDemoData} 
                className="text-xs"
              >
                {showDemoData ? "Hide Demo Data" : "Show Demo Data"}
              </Button>
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
            </div>
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
                                handleDownloadVaccination(vaccination);
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

            {/* Upload section in your Add Vaccination Dialog */}
            <div className="grid gap-2">
              <Label>Upload Documents (Optional)</Label>
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  multiple
                  id="document-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="document-upload" className="flex flex-col items-center cursor-pointer">
                  <Syringe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Upload your vaccination certificate or record</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG files up to 5MB</p>
                  <Button variant="outline" size="sm" className="mt-2" type="button">
                    Browse Files
                  </Button>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {uploadedFiles.length} file(s) selected
                    </div>
                  )}
                </label>
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

      {/* Share Vaccination Dialog */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Vaccination Record</DialogTitle>
            <DialogDescription>
              Share your vaccination record with healthcare providers or family members.
            </DialogDescription>
          </DialogHeader>
          {shareVaccination && (
            <div className="grid gap-4 py-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium">{shareVaccination.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(shareVaccination.date).toLocaleDateString()} • {shareVaccination.manufacturer}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Share via:</h4>
                
                <div className="grid grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center p-3 h-auto" 
                    onClick={() => handleShareTo("whatsapp", shareVaccination)}
                  >
                    <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={() => handleShareTo("email", shareVaccination)}
                  >
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs">Email</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={() => handleShareTo("message", shareVaccination)}
                  >
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"></path>
                      </svg>
                    </div>
                    <span className="text-xs">Message</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={() => handleShareTo("more", shareVaccination)}
                  >
                    <div className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </div>
                    <span className="text-xs">More</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="share-link">Or copy link</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="share-link" 
                    value={shareUrl} 
                    readOnly 
                    onClick={(e) => e.target.select()}
                  />
                  <Button 
                    size="sm" 
                    className="px-3"
                    onClick={handleCopyLink}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </Button>
                </div>
                <p className="text-xs text-gray-500">This link will expire in 7 days</p>
              </div>
              
              {/* New: Add QR code for scanning */}
              <div className="flex flex-col items-center border rounded p-3 bg-white">
                <div className="border border-gray-200 p-2 rounded bg-white">
                  {/* Placeholder for QR code - in a real app, you'd generate this */}
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                    <p className="text-sm text-gray-500">QR Code</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Scan to view record</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
