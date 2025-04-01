import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicationTracker } from "@/components/medications/medication-tracker"
import { MedicationHistory } from "@/components/medical-history/medication-history"
import { MedicationReminders } from "@/components/medications/medication-reminders"

export default function MedicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Medications</h1>
        <p className="text-muted-foreground">Track and manage your medications</p>
      </div>

      <Tabs defaultValue="current">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="current">Current Medications</TabsTrigger>
          <TabsTrigger value="history">Medication History</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="mt-6">
          <MedicationTracker />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <MedicationHistory />
        </TabsContent>
        <TabsContent value="reminders" className="mt-6">
          <MedicationReminders />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Medication Resources</CardTitle>
          <CardDescription>Helpful information about your medications</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Medication Interactions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check for potential interactions between your medications
              </p>
              <Button variant="outline" className="w-full">
                Check Interactions
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Pharmacy Locator</h3>
              <p className="text-sm text-muted-foreground mb-4">Find pharmacies near you for prescription refills</p>
              <Button variant="outline" className="w-full">
                Find Pharmacies
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

