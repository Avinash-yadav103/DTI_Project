import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CalendarIcon } from "lucide-react"

export function GenerateReport() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Generate Health Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select defaultValue="appointment-history">
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment-history">Appointment History</SelectItem>
              <SelectItem value="health-metrics">Health Metrics</SelectItem>
              <SelectItem value="medication-history">Medication History</SelectItem>
              <SelectItem value="lab-results">Lab Results</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Period</Label>
          <RadioGroup defaultValue="all-time" className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2 border rounded-md px-3 py-1">
              <RadioGroupItem value="all-time" id="all-time" />
              <Label htmlFor="all-time" className="cursor-pointer">
                All time
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md px-3 py-1">
              <RadioGroupItem value="past-year" id="past-year" />
              <Label htmlFor="past-year" className="cursor-pointer">
                Past year
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md px-3 py-1">
              <RadioGroupItem value="past-6-months" id="past-6-months" />
              <Label htmlFor="past-6-months" className="cursor-pointer">
                Past 6 months
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Custom Date Range (Optional)</Label>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="dd-mm-yyyy" className="pl-8" />
            </div>
            <span className="text-sm">to</span>
            <div className="relative">
              <CalendarIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="dd-mm-yyyy" className="pl-8" />
            </div>
          </div>
        </div>

        <Button className="w-full">Generate Report</Button>
      </CardContent>
    </Card>
  )
}

