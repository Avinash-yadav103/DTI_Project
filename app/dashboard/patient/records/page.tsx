"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Share2, Eye, Upload, ChevronDown, FileUp, Pencil } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, File, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import axios from 'axios';

// Add this API base URL - adjust if needed
const API_BASE_URL = 'http://localhost:5000/api/medical-records';

export default function MedicalRecordsPage() {
  const { user } = useAuth()
  const [expandedRecord, setExpandedRecord] = useState<number | null>(1)
  const [isUploading, setIsUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    title: '',
    type: 'diagnosis',
    doctor: '',
    hospital: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    clinicalNotes: '',
    prescription: [''],
    documents: []
  })
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [recordToEdit, setRecordToEdit] = useState(null)

  // Add this state
  const [viewFullRecordId, setViewFullRecordId] = useState(null);
  const [fullRecord, setFullRecord] = useState(null);

  // Add these states for the share dialog
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [recordToShare, setRecordToShare] = useState(null);

  // Replace mock medical records with state
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      title: "Seasonal Allergic Rhinitis",
      doctor: "Dr. Rajesh Kumar",
      hospital: "City General Hospital",
      date: "June 15, 2023",
      type: "diagnosis",
      diagnosis: "Seasonal Allergic Rhinitis",
      prescription: [
        "Cetirizine 10mg - Take once daily for 10 days",
        "Fluticasone Nasal Spray - Use as directed twice daily",
      ],
      clinicalNotes:
        "Patient presented with nasal congestion, sneezing, and itchy eyes. Symptoms are consistent with seasonal allergies. Recommended to avoid outdoor activities during high pollen count days.",
      documents: [{ name: "Allergy Test Results", type: "PDF" }],
    },
    {
      id: 2,
      title: "Hypertension - Stage 1",
      doctor: "Dr. Priya Sharma",
      hospital: "Medical Research Institute",
      date: "May 10, 2023",
      type: "diagnosis",
      diagnosis: "Hypertension - Stage 1",
      prescription: ["Amlodipine 5mg - Take once daily", "Low sodium diet recommended"],
      clinicalNotes:
        "Blood pressure readings consistently above 130/80 mmHg. No other symptoms reported. Recommended lifestyle modifications including regular exercise and dietary changes.",
      documents: [
        { name: "Blood Pressure Chart", type: "PDF" },
        { name: "ECG Report", type: "PDF" },
      ],
    },
    {
      id: 3,
      title: "Annual Physical Examination",
      doctor: "Dr. Sarah Johnson",
      hospital: "City General Hospital",
      date: "April 5, 2023",
      type: "examination",
      diagnosis: "Healthy",
      prescription: [],
      clinicalNotes:
        "Routine annual physical examination. All vital signs within normal range. No significant findings.",
      documents: [
        { name: "Complete Blood Count", type: "PDF" },
        { name: "Lipid Profile", type: "PDF" },
      ],
    },
    {
      id: 4,
      title: "X-Ray Report",
      doctor: "Dr. Emily Wong",
      hospital: "City General Hospital",
      date: "March 10, 2023",
      type: "imaging",
      diagnosis: "No abnormalities detected",
      prescription: [],
      clinicalNotes:
        "Chest X-ray performed due to persistent cough. No abnormalities detected in lung fields. Cough likely due to post-viral irritation.",
      documents: [
        { name: "Chest X-Ray Images", type: "DICOM" },
        { name: "Radiologist Report", type: "PDF" },
      ],
    },
  ])

  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [showDemoData, setShowDemoData] = useState(false);

  // Fetch real records from MongoDB
  const fetchMedicalRecords = async () => {
    if (!user?.id) return;
    
    setIsLoadingRecords(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { patientId: user.id }
      });
      
      const apiRecords = response.data;
      
      // Format records to match our component's data structure
      const formattedRecords = apiRecords.map(record => ({
        id: record._id,
        title: record.title,
        doctor: record.doctor,
        hospital: record.hospital,
        date: record.date,
        type: record.type,
        diagnosis: record.diagnosis,
        prescription: record.prescription,
        clinicalNotes: record.clinicalNotes,
        documents: record.documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.fileUrl
        }))
      }));
      
      // If we have real records, don't show demo data
      if (formattedRecords.length > 0) {
        setMedicalRecords(formattedRecords);
        setShowDemoData(false);
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setIsLoadingRecords(false);
    }
  };

  // Upload medical record to MongoDB
  const uploadMedicalRecord = async () => {
    if (!user?.id) {
      toast.error('User authentication required');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create a FormData object to handle files
      const formData = new FormData();
      
      // Add text fields
      formData.append('patientId', user.id);
      formData.append('title', newRecord.title);
      formData.append('type', newRecord.type);
      formData.append('doctor', newRecord.doctor);
      formData.append('hospital', newRecord.hospital);
      formData.append('date', newRecord.date);
      formData.append('diagnosis', newRecord.diagnosis);
      formData.append('clinicalNotes', newRecord.clinicalNotes);
      
      // Add prescription as JSON string
      formData.append('prescription', JSON.stringify(newRecord.prescription.filter(p => p.trim() !== '')));
      
      // Add files
      uploadedFiles.forEach(file => {
        formData.append('documents', file);
      });
      
      // Add this right before the axios call
      console.log("Sending data to server:", {
        patientId: user.id,
        title: newRecord.title,
        // Log other fields to verify
      });

      // Then modify your axios call to log more details
      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Server response:", response.data);
      // Rest of your code...
      
      const savedRecord = response.data;
      
      // Format the saved record to match our component structure
      const formattedRecord = {
        id: savedRecord._id,
        title: savedRecord.title,
        doctor: savedRecord.doctor,
        hospital: savedRecord.hospital,
        date: savedRecord.date,
        type: savedRecord.type,
        diagnosis: savedRecord.diagnosis,
        prescription: savedRecord.prescription,
        clinicalNotes: savedRecord.clinicalNotes,
        documents: savedRecord.documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.fileUrl
        }))
      };
      
      // Add the new record to state
      setMedicalRecords(prevRecords => [formattedRecord, ...prevRecords]);
      
      // Close modal and show success message
      setIsModalOpen(false);
      toast.success('Medical record saved successfully');
      
      // If this is our first real record, turn off demo data
      if (showDemoData) {
        setShowDemoData(false);
      }
    } catch (error) {
      console.error("Detailed error info:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(`Failed to save: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Add this function to download a record as PDF
  const handleDownloadRecord = async (id) => {
    const record = medicalRecords.find(r => r.id === id);
    if (!record) return;
    
    // Create a hidden div to render the record
    const printElement = document.createElement('div');
    printElement.style.position = 'absolute';
    printElement.style.left = '-9999px';
    printElement.style.top = '-9999px';
    printElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #0369a1; font-size: 24px; margin-bottom: 10px;">${record.title}</h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px;">Date: ${record.date}</p>
          <p style="margin: 0; font-size: 14px;">Type: ${record.type}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px;">Doctor: ${record.doctor}</p>
          <p style="margin: 0; font-size: 14px;">Hospital: ${record.hospital}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Diagnosis</h2>
          <p style="margin: 0; font-size: 14px;">${record.diagnosis}</p>
        </div>
        ${record.prescription.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 18px; margin-bottom: 10px;">Prescription</h2>
            <ul style="margin: 0; padding-left: 20px;">
              ${record.prescription.map(med => `<li style="font-size: 14px;">${med}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Clinical Notes</h2>
          <p style="margin: 0; font-size: 14px;">${record.clinicalNotes}</p>
        </div>
        ${record.documents.length > 0 ? `
          <div>
            <h2 style="font-size: 18px; margin-bottom: 10px;">Documents</h2>
            <ul style="margin: 0; padding-left: 20px;">
              ${record.documents.map(doc => `<li style="font-size: 14px;">${doc.name} (${doc.type})</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
    
    document.body.appendChild(printElement);
    
    try {
      // Generate PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const canvas = await html2canvas(printElement, {
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`Medical_Record_${record.id}.pdf`);
      toast.success('Record downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF', error);
      toast.error('Failed to download record');
    } finally {
      document.body.removeChild(printElement);
    }
  };

  // Add this function for downloading files from your API
  const handleDocumentDownload = (doc) => {
    if (doc.url) {
      // This is a real file from the API
      window.open(`http://localhost:5000${doc.url}`, '_blank');
    } else {
      // This is a demo file, create a sample text file
      const blob = new Blob([`This is a sample ${doc.type} file for ${doc.name}`], { 
        type: 'text/plain;charset=utf-8' 
      });
      saveAs(blob, doc.name);
    }
    toast.success(`Downloaded ${doc.name}`);
  };

  const handleShareRecord = (id) => {
    const record = medicalRecords.find(r => r.id === id);
    setRecordToShare(record);
    setShareModalOpen(true);
  };

  const shareViaWhatsApp = (record) => {
    const text = encodeURIComponent(
      `*Medical Record: ${record.title}*\n` +
      `Doctor: ${record.doctor}\n` +
      `Hospital: ${record.hospital}\n` +
      `Date: ${record.date}\n` +
      `Diagnosis: ${record.diagnosis}\n\n` +
      `View full record in CareFolio`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShareModalOpen(false);
    toast.success('Shared via WhatsApp');
  };

  const shareViaEmail = (record) => {
    const subject = encodeURIComponent(`Medical Record: ${record.title}`);
    const body = encodeURIComponent(
      `Medical Record: ${record.title}\n\n` +
      `Doctor: ${record.doctor}\n` +
      `Hospital: ${record.hospital}\n` +
      `Date: ${record.date}\n` +
      `Diagnosis: ${record.diagnosis}\n\n` +
      `View full record in CareFolio`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShareModalOpen(false);
    toast.success('Email drafted');
  };

  const copyShareLink = (record) => {
    // In a real app, generate an actual sharing link
    const dummyLink = `https://carefolio.com/share/${record.id}`;
    navigator.clipboard.writeText(dummyLink);
    setShareModalOpen(false);
    toast.success('Link copied to clipboard');
  };

  const handleViewFullRecord = (id) => {
    const record = medicalRecords.find(r => r.id === id);
    setFullRecord(record);
    setViewFullRecordId(id);
  }

  const handleUploadRecord = () => {
    setIsModalOpen(true)
    setIsPreviewMode(false)
    setNewRecord({
      title: '',
      type: 'diagnosis',
      doctor: '',
      hospital: '',
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      clinicalNotes: '',
      prescription: [''],
      documents: []
    })
    setUploadedFiles([])
  }

  const toggleExpandRecord = (id: number) => {
    if (expandedRecord === id) {
      setExpandedRecord(null)
    } else {
      setExpandedRecord(id)
    }
  }

  const formatDate = (dateString: string) => {
    const months = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    }

    const parts = dateString.split(" ")
    if (parts.length === 3) {
      const month = months[parts[0]] || parts[0]
      return `${month} ${parts[1]} ${parts[2]}`
    }
    return dateString
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
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Appointments",
      href: "/dashboard/patient/appointments",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Access Logs",
      href: "/dashboard/patient/logs",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/patient/settings",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <FileText className="h-4 w-4" />,
    },
  ]

  // File upload handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles([...uploadedFiles, ...files])
  }

  // Add prescription field
  const addPrescriptionField = () => {
    setNewRecord({
      ...newRecord,
      prescription: [...newRecord.prescription, '']
    })
  }

  // Remove prescription field
  const removePrescriptionField = (index) => {
    const updatedPrescription = [...newRecord.prescription]
    updatedPrescription.splice(index, 1)
    setNewRecord({
      ...newRecord,
      prescription: updatedPrescription
    })
  }

  // Update prescription field
  const updatePrescriptionField = (index, value) => {
    const updatedPrescription = [...newRecord.prescription]
    updatedPrescription[index] = value
    setNewRecord({
      ...newRecord,
      prescription: updatedPrescription
    })
  }

  // Remove file
  const removeFile = (index) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  // Save record
  const saveRecord = () => {
    if (recordToEdit) {
      // For real records from MongoDB
      if (!showDemoData || typeof recordToEdit.id === 'string') {
        updateMedicalRecord();
      } else {
        // For demo records
        const updatedRecords = medicalRecords.map(record => 
          record.id === recordToEdit.id ? {
            ...newRecord,
            id: recordToEdit.id,
            documents: [...recordToEdit.documents, ...uploadedFiles.map(file => ({
              name: file.name,
              type: file.name.split('.').pop().toUpperCase()
            }))]
          } : record
        );
        setMedicalRecords(updatedRecords);
        setIsModalOpen(false);
        toast.success("Medical record updated successfully");
      }
    } else {
      // For new records
      if (!showDemoData) {
        uploadMedicalRecord();
      } else {
        // Add to demo data
        const demoRecord = {
          ...newRecord,
          id: medicalRecords.length + 1,
          documents: uploadedFiles.map(file => ({
            name: file.name,
            type: file.name.split('.').pop().toUpperCase()
          })),
          prescription: newRecord.prescription.filter(p => p.trim() !== '')
        };
        setMedicalRecords([demoRecord, ...medicalRecords]);
        setIsModalOpen(false);
        toast.success("Medical record uploaded successfully");
      }
    }
  };

  // Preview mode toggle
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  // Edit record
  const handleEditRecord = (record) => {
    setRecordToEdit(record)
    setNewRecord({
      title: record.title,
      type: record.type,
      doctor: record.doctor,
      hospital: record.hospital,
      date: record.date,
      diagnosis: record.diagnosis || '',
      clinicalNotes: record.clinicalNotes || '',
      prescription: record.prescription.length > 0 ? record.prescription : [''],
      documents: record.documents
    })
    setUploadedFiles([]) // Would need actual files here in a real implementation
    setIsModalOpen(true)
    setIsPreviewMode(false)
  }

  // Add this to close the modal
  const closeFullRecordView = () => {
    setViewFullRecordId(null);
    setFullRecord(null);
  }

  // Add this function to update records
  const updateMedicalRecord = async () => {
    if (!user?.id || !recordToEdit) return;
    
    setIsLoading(true);
    
    try {
      // Create a FormData object to handle files
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', newRecord.title);
      formData.append('type', newRecord.type);
      formData.append('doctor', newRecord.doctor);
      formData.append('hospital', newRecord.hospital);
      formData.append('date', newRecord.date);
      formData.append('diagnosis', newRecord.diagnosis);
      formData.append('clinicalNotes', newRecord.clinicalNotes);
      
      // Add prescription as JSON string
      formData.append('prescription', JSON.stringify(newRecord.prescription.filter(p => p.trim() !== '')));
      
      // Add any new files
      uploadedFiles.forEach(file => {
        formData.append('newDocuments', file);
      });
      
      // Send to API
      const response = await axios.put(`${API_BASE_URL}/${recordToEdit.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedRecord = response.data;
      
      // Format the updated record to match our component structure
      const formattedRecord = {
        id: updatedRecord._id,
        title: updatedRecord.title,
        doctor: updatedRecord.doctor,
        hospital: updatedRecord.hospital,
        date: updatedRecord.date,
        type: updatedRecord.type,
        diagnosis: updatedRecord.diagnosis,
        prescription: updatedRecord.prescription,
        clinicalNotes: updatedRecord.clinicalNotes,
        documents: updatedRecord.documents.map(doc => ({
          name: doc.name,
          type: doc.type,
          url: doc.fileUrl
        }))
      };
      
      // Update the record in state
      setMedicalRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === formattedRecord.id ? formattedRecord : record
        )
      );
      
      // Close modal and show success message
      setIsModalOpen(false);
      toast.success('Medical record updated successfully');
    } catch (error) {
      console.error('Error updating medical record:', error);
      toast.error('Failed to update medical record');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMedicalRecords();
    }
  }, [user?.id]);

  const toggleDemoData = () => {
    setShowDemoData(prev => !prev);
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Medical Records"
      user={user || { name: "", email: "" }}
      notifications={3}
      requiredRole="patient"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl">Medical Records</CardTitle>
              <CardDescription>View your complete medical history</CardDescription>
            </div>
            <Button onClick={handleUploadRecord} className="bg-sky-600 hover:bg-sky-700" disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Record
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={toggleDemoData}
                className="text-xs"
              >
                {showDemoData ? "Show Real Data Only" : "Include Demo Data"}
              </Button>
            </div>
            <div className="space-y-6">
              {medicalRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpandRecord(record.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{record.title}</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(record.date)} • {record.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={`mr-4 ${
                          record.type === "diagnosis"
                            ? "bg-amber-100 text-amber-800"
                            : record.type === "examination"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                      </Badge>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${expandedRecord === record.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {expandedRecord === record.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Diagnosis</h4>
                          <p className="text-gray-900">{record.diagnosis}</p>

                          {record.prescription.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Prescription</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {record.prescription.map((med, index) => (
                                  <li key={index} className="text-gray-900">
                                    {med}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Clinical Notes</h4>
                          <p className="text-gray-900">{record.clinicalNotes}</p>

                          {record.documents.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Documents</h4>
                              <div className="space-y-2">
                                {record.documents.map((doc, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                                  >
                                    <FileUp className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{doc.name}</span>
                                    <Badge className="ml-auto text-xs bg-gray-100 text-gray-800">{doc.type}</Badge>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleDocumentDownload(doc)}
                                    >
                                      <Download className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShareRecord(record.id)}>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadRecord(record.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRecord(record)}
                          className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          className="bg-sky-600 hover:bg-sky-700"
                          size="sm"
                          onClick={() => handleViewFullRecord(record.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Full Record
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Record Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{recordToEdit ? 'Edit Medical Record' : 'Upload New Medical Record'}</DialogTitle>
            <DialogDescription>
              {isPreviewMode 
                ? "Preview your medical record before saving" 
                : "Enter the details of your medical record"}
            </DialogDescription>
          </DialogHeader>

          {!isPreviewMode ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                    placeholder="e.g. Annual Physical Examination"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type</Label>
                  <Select 
                    value={newRecord.type} 
                    onValueChange={(value) => setNewRecord({...newRecord, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="examination">Examination</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="labTest">Laboratory Test</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor's Name</Label>
                  <Input
                    id="doctor"
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                    placeholder="e.g. Dr. Sarah Johnson"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    value={newRecord.hospital}
                    onChange={(e) => setNewRecord({...newRecord, hospital: e.target.value})}
                    placeholder="e.g. City General Hospital"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={newRecord.diagnosis}
                    onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                    placeholder="e.g. Seasonal Allergic Rhinitis"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                <Textarea
                  id="clinicalNotes"
                  value={newRecord.clinicalNotes}
                  onChange={(e) => setNewRecord({...newRecord, clinicalNotes: e.target.value})}
                  placeholder="Enter any notes from the doctor"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Prescription</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addPrescriptionField}
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {newRecord.prescription.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updatePrescriptionField(index, e.target.value)}
                        placeholder="e.g. Cetirizine 10mg - Once daily"
                      />
                      {newRecord.prescription.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removePrescriptionField(index)}
                          className="hover:bg-red-100 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Documents</Label>
                <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <File className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="cursor-pointer"
                      type="button"
                      onClick={() => document.getElementById('fileUpload').click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Uploaded Files</Label>
                    <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <div className="flex items-center">
                            <File className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Preview mode
            <div className="border border-gray-200 rounded-lg p-4 mt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{newRecord.title}</h3>
                  <p className="text-sm text-gray-600">
                    {newRecord.date} • {newRecord.doctor}
                  </p>
                </div>
                <Badge
                  className={`${
                    newRecord.type === "diagnosis"
                      ? "bg-amber-100 text-amber-800"
                      : newRecord.type === "examination"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {newRecord.type.charAt(0).toUpperCase() + newRecord.type.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Diagnosis</h4>
                  <p className="text-gray-900">{newRecord.diagnosis}</p>

                  {newRecord.prescription.filter(p => p.trim() !== '').length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Prescription</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {newRecord.prescription
                          .filter(p => p.trim() !== '')
                          .map((med, index) => (
                            <li key={index} className="text-gray-900">
                              {med}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Clinical Notes</h4>
                  <p className="text-gray-900">{newRecord.clinicalNotes}</p>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Documents</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200"
                          >
                            <File className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <Badge className="ml-auto text-xs bg-gray-100 text-gray-800">
                              {file.name.split('.').pop().toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {isPreviewMode ? (
              <>
                <Button variant="outline" onClick={togglePreviewMode}>
                  Back to Edit
                </Button>
                <Button onClick={saveRecord}>
                  Save Record
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={togglePreviewMode} disabled={!newRecord.title}>
                  Preview
                </Button>
                <Button onClick={saveRecord} disabled={!newRecord.title}>
                  {recordToEdit ? 'Update' : 'Upload'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Record View Modal */}
      <Dialog open={viewFullRecordId !== null} onOpenChange={closeFullRecordView}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Medical Record Details</DialogTitle>
            <DialogDescription>
              Complete information for this medical record
            </DialogDescription>
          </DialogHeader>

          {fullRecord && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">{fullRecord.title}</h2>
                    <Badge
                      className={`${
                        fullRecord.type === "diagnosis"
                          ? "bg-amber-100 text-amber-800"
                          : fullRecord.type === "examination"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {fullRecord.type.charAt(0).toUpperCase() + fullRecord.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Doctor</p>
                      <p>{fullRecord.doctor}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Hospital/Clinic</p>
                      <p>{fullRecord.hospital}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p>{formatDate(fullRecord.date)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                      <p>{fullRecord.diagnosis}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <h3 className="text-lg font-medium">Clinical Notes</h3>
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                      <p className="whitespace-pre-line">{fullRecord.clinicalNotes}</p>
                    </div>
                  </div>
                  
                  {fullRecord.prescription && fullRecord.prescription.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-lg font-medium">Prescription</h3>
                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <ul className="list-disc pl-5 space-y-2">
                          {fullRecord.prescription.map((med, index) => (
                            <li key={index}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Related Documents</h3>
                  {fullRecord.documents.length > 0 ? (
                    <div className="space-y-3">
                      {fullRecord.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">Added on {formatDate(fullRecord.date)}</p>
                          </div>
                          <Badge>{doc.type}</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleDocumentDownload(doc)}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No documents attached to this record</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Record History</h3>
                  <div className="border-l-2 border-gray-200 pl-4 ml-3 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-sky-600"></div>
                      <p className="text-sm font-medium">Record Created</p>
                      <p className="text-sm text-gray-500">{formatDate(fullRecord.date)}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-gray-400"></div>
                      <p className="text-sm font-medium">Last Viewed</p>
                      <p className="text-sm text-gray-500">Today</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="flex flex-row gap-2 justify-end mt-6">
            <Button 
              variant="outline" 
              onClick={() => handleShareRecord(fullRecord.id)}
              className="flex-1 sm:flex-none"
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleDownloadRecord(fullRecord.id)}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button onClick={closeFullRecordView} className="flex-1 sm:flex-none">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Medical Record</DialogTitle>
            <DialogDescription>
              Choose how you want to share this medical record
            </DialogDescription>
          </DialogHeader>
          
          {recordToShare && (
            <div className="grid gap-4 py-4">
              <div className="p-4 bg-gray-50 rounded-md mb-4">
                <h3 className="font-medium">{recordToShare.title}</h3>
                <p className="text-sm text-gray-500">{formatDate(recordToShare.date)}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={() => shareViaWhatsApp(recordToShare)}
                  className="w-full justify-start bg-green-500 hover:bg-green-600"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Share via WhatsApp
                </Button>
                
                <Button 
                  onClick={() => window.open(`https://www.instagram.com/direct/t/?text=${encodeURIComponent(`Medical Record: ${recordToShare.title}`)}`, '_blank')}
                  className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Share via Instagram
                </Button>
                
                <Button 
                  onClick={() => shareViaEmail(recordToShare)}
                  className="w-full justify-start bg-gray-800 hover:bg-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Share via Email
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => copyShareLink(recordToShare)}
                  className="w-full justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Copy Link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

