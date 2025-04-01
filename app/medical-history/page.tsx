import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicalTimeline } from "@/components/medical-history/medical-timeline"
import { MedicationHistory } from "@/components/medical-history/medication-history"
import { ProceduresHistory } from "@/components/medical-history/procedures-history"
import { LabTestsHistory } from "@/components/medical-history/lab-test-history"

export default function MedicalHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Medical History</h1>
        <p className="text-muted-foreground">View your complete medical history and records</p>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-6">
          <MedicalTimeline />
        </TabsContent>
        <TabsContent value="medications" className="mt-6">
          <MedicationHistory />
        </TabsContent>
        <TabsContent value="procedures" className="mt-6">
          <ProceduresHistory />
        </TabsContent>
        <TabsContent value="lab-tests" className="mt-6">
          <LabTestsHistory />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Export Medical Records</CardTitle>
          <CardDescription>Download your medical records in various formats</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="outline">Export as PDF</Button>
          <Button variant="outline">Export as CSV</Button>
          <Button variant="outline">Print Records</Button>
          <Button variant="outline">Share with Provider</Button>
        </CardContent>
      </Card>
    </div>
  )
}

