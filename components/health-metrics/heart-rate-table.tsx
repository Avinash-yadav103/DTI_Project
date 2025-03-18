import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Edit, Trash } from "lucide-react"

export function HeartRateTable() {
  const readings = [
    { id: 1, date: "Nov 18, 2023", time: "8:30 AM", heartRate: 68, activity: "Resting", notes: "Morning reading" },
    {
      id: 2,
      date: "Nov 11, 2023",
      time: "9:15 AM",
      heartRate: 72,
      activity: "After light activity",
      notes: "After breakfast",
    },
    { id: 3, date: "Nov 4, 2023", time: "7:45 AM", heartRate: 70, activity: "Resting", notes: "Before medication" },
    { id: 4, date: "Oct 29, 2023", time: "8:00 AM", heartRate: 65, activity: "Resting", notes: "" },
    { id: 5, date: "Oct 27, 2023", time: "7:30 AM", heartRate: 68, activity: "Resting", notes: "Feeling rested" },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Heart Rate History</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Heart Rate</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.map((reading) => (
              <TableRow key={reading.id}>
                <TableCell>{reading.date}</TableCell>
                <TableCell>{reading.time}</TableCell>
                <TableCell>{reading.heartRate} bpm</TableCell>
                <TableCell>{reading.activity}</TableCell>
                <TableCell>{reading.notes || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
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

