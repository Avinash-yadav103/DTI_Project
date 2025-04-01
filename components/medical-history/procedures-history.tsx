import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Filter } from "lucide-react"

export function ProceduresHistory() {
  const procedures = [
    {
      id: 1,
      name: "Knee MRI",
      date: "2023-08-03",
      provider: "City Imaging Center",
      doctor: "Dr. James Wilson",
      reason: "Knee Sprain",
      result: "Minor ligament damage, no surgery required",
    },
    {
      id: 2,
      name: "Echocardiogram",
      date: "2023-09-15",
      provider: "Heart Care Center",
      doctor: "Dr. Emily Chen",
      reason: "Hypertension Evaluation",
      result: "Normal heart function",
    },
    {
      id: 3,
      name: "Physical Therapy",
      date: "2023-08-10 - 2023-09-30",
      provider: "Rehabilitation Center",
      doctor: "Dr. James Wilson",
      reason: "Knee Sprain Rehabilitation",
      result: "Completed with full recovery",
    },
    {
      id: 4,
      name: "Colonoscopy",
      date: "2022-05-20",
      provider: "Digestive Health Center",
      doctor: "Dr. Lisa Rodriguez",
      reason: "Routine Screening",
      result: "Normal, no polyps found",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Procedures & Tests History</CardTitle>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Procedure</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell>
                  <div className="font-medium">{procedure.name}</div>
                </TableCell>
                <TableCell>{procedure.date}</TableCell>
                <TableCell>{procedure.provider}</TableCell>
                <TableCell>{procedure.doctor}</TableCell>
                <TableCell>{procedure.reason}</TableCell>
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

