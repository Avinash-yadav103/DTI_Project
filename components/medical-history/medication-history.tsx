import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Filter } from "lucide-react"

export function MedicationHistory() {
  const medications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      startDate: "2023-01-15",
      endDate: "2023-04-15",
      frequency: "Once daily",
      prescribedBy: "Dr. Emily Chen",
      condition: "Hypertension",
      status: "Completed",
    },
    {
      id: 2,
      name: "Atorvastatin",
      dosage: "20mg",
      startDate: "2023-02-10",
      endDate: "2023-08-10",
      frequency: "Once daily",
      prescribedBy: "Dr. Emily Chen",
      condition: "High Cholesterol",
      status: "Completed",
    },
    {
      id: 3,
      name: "Ibuprofen",
      dosage: "400mg",
      startDate: "2023-08-05",
      endDate: "2023-08-12",
      frequency: "Three times daily",
      prescribedBy: "Dr. James Wilson",
      condition: "Knee Sprain",
      status: "Completed",
    },
    {
      id: 4,
      name: "Amoxicillin",
      dosage: "500mg",
      startDate: "2022-11-20",
      endDate: "2022-11-30",
      frequency: "Three times daily",
      prescribedBy: "Dr. Michael Stevens",
      condition: "Bacterial Infection",
      status: "Completed",
    },
    {
      id: 5,
      name: "Lisinopril",
      dosage: "10mg",
      startDate: "2023-09-20",
      endDate: "Present",
      frequency: "Once daily",
      prescribedBy: "Dr. Emily Chen",
      condition: "Hypertension",
      status: "Active",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Medication History</CardTitle>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Prescribed By</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{medication.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {medication.dosage}, {medication.frequency}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{medication.condition}</TableCell>
                <TableCell>{medication.prescribedBy}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{medication.startDate}</div>
                    <div>to {medication.endDate}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={medication.status === "Active" ? "default" : "secondary"}>{medication.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

