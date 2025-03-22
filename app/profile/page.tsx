"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "@/components/profile/personal-info-form"
import { MedicalHistoryForm } from "@/components/profile/medical-history-form"
import { InsuranceInfoForm } from "@/components/profile/insurance-info-form"
import { EmergencyContactsForm } from "@/components/profile/emergency-contacts-form"
import { PreferencesForm } from "@/components/profile/preferences-form"
import { Eye, Trash2 } from "lucide-react"

type UploadedFile = {
  name: string
  size: number
  url?: string
  type?: string
}

export default function ProfilePage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  // Load uploaded files from localStorage
  useEffect(() => {
    const storedFiles = localStorage.getItem("uploadedFiles")
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles))
    }
  }, [])

  // Delete file
  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...uploadedFiles]
    updatedFiles.splice(index, 1)
    setUploadedFiles(updatedFiles)
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles))
  }

  // Preview file
  const handlePreviewFile = (file: UploadedFile) => {
    if (file.url) {
      window.open(file.url, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal and medical information</p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Manage your medical history and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <MedicalHistoryForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insurance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
              <CardDescription>Manage your insurance details</CardDescription>
            </CardHeader>
            <CardContent>
              <InsuranceInfoForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>People to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyContactsForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <PreferencesForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Uploaded Files Section */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>Manage your uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length > 0 ? (
            <ul className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex flex-col space-y-2 md:flex-row md:items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Show Image Preview for Image Files */}
                    {file.type?.startsWith("image/") && file.url ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md text-sm font-medium">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      onClick={() => handlePreviewFile(file)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteFile(index)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
