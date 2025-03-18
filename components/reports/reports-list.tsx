import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Star } from "lucide-react"

export function ReportsList() {
  const reports = [
    {
      id: 1,
      name: "Annual Health Summary",
      type: "Comprehensive",
      date: "Nov 20, 2023",
      status: "Generated",
      saved: true,
    },
    {
      id: 2,
      name: "Blood Pressure Report",
      type: "Health Metrics",
      date: "Nov 15, 2023",
      status: "Generated",
      saved: false,
    },
    {
      id: 3,
      name: "Cardiology Appointment Summary",
      type: "Appointment History",
      date: "Nov 10, 2023",
      status: "Generated",
      saved: true,
    },
    {
      id: 4,
      name: "Medication Effectiveness Report",
      type: "Medication History",
      date: "Oct 28, 2023",
      status: "Generated",
      saved: false,
    },
    {
      id: 5,
      name: "Weight Management Progress",
      type: "Health Metrics",
      date: "Oct 15, 2023",
      status: "Generated",
      saved: false,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reports</CardTitle>
        <Button variant="outline" size="sm">
          Filter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {report.name}
                    {report.saved && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{report.type}</Badge>
                </TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{report.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Star className={`h-4 w-4 ${report.saved ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      <span className="sr-only">{report.saved ? "Unsave" : "Save"}</span>
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

