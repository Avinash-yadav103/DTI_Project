import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "@/components/profile/personal-info-form"
import { MedicalHistoryForm } from "@/components/profile/medical-history-form"
import { InsuranceInfoForm } from "@/components/profile/insurance-info-form"
import { EmergencyContactsForm } from "@/components/profile/emergency-contacts-form"
import { PreferencesForm } from "@/components/profile/preferences-form"

export default function ProfilePage() {
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

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Login History</h3>
              <p className="text-sm text-muted-foreground">View your recent login activity</p>
            </div>
            <Button variant="outline">View History</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

