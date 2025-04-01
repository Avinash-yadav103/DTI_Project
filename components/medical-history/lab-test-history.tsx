import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Filter, TrendingUp } from "lucide-react"

export function LabTestsHistory() {
  const labTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      date: "2023-09-15",
      orderedBy: "Dr. Emily Chen",
      lab: "City Medical Lab",
      result: "Normal",
      status: "Completed",
    },
    {
      id: 2,
      name: "Lipid Panel",
      date: "2023-09-15",
      orderedBy: "Dr. Emily Chen",
      lab: "City Medical Lab",
      result: "Slightly elevated LDL",
      status: "Completed",
    },
    {
      id: 3,
      name: "Comprehensive Metabolic Panel",
      date: "2023-09-15",
      orderedBy: "Dr. Emily Chen",
      lab: "City Medical Lab",
      result: "Normal",
      status: "Completed",
    },
    {
      id: 4,
      name: "Hemoglobin A1C",
      date: "2023-09-15",
      orderedBy: "Dr. Emily Chen",
      lab: "City Medical Lab",
      result: "Normal (5.4%)",
      status: "Completed",
    },
    {
      id: 5,
      name: "Thyroid Function Test",
      date: "2023-03-10",
      orderedBy: "Dr. Michael Stevens",
      lab: "City Medical Lab",
      result: "Normal",
      status: "Completed",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lab Tests History</CardTitle>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Ordered By</TableHead>
              <TableHead>Lab</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell>
                  <div className="font-medium">{test.name}</div>
                </TableCell>
                <TableCell>{test.date}</TableCell>
                <TableCell>{test.orderedBy}</TableCell>
                <TableCell>{test.lab}</TableCell>
                <TableCell>
                  <Badge variant={test.result.includes("elevated") ? "outline" : "secondary"}>{test.result}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <TrendingUp className="h-4 w-4" />
                      <span className="sr-only">View Trends</span>
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

