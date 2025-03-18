"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function GenerateReportForm() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment-history">Appointment History</SelectItem>
              <SelectItem value="health-metrics">Health Metrics</SelectItem>
              <SelectItem value="medication-history">Medication History</SelectItem>
              <SelectItem value="lab-results">Lab Results</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Health Report</SelectItem>
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
            <div className="flex items-center space-x-2 border rounded-md px-3 py-1">
              <RadioGroupItem value="past-3-months" id="past-3-months" />
              <Label htmlFor="past-3-months" className="cursor-pointer">
                Past 3 months
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md px-3 py-1">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="cursor-pointer">
                Custom range
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Custom Date Range</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="start-date" className="sr-only">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-center">to</div>

            <div className="flex-1">
              <Label htmlFor="end-date" className="sr-only">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Include in Report</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="include-appointments" defaultChecked />
            <Label htmlFor="include-appointments">Appointments</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-blood-pressure" defaultChecked />
            <Label htmlFor="include-blood-pressure">Blood Pressure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-heart-rate" defaultChecked />
            <Label htmlFor="include-heart-rate">Heart Rate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-weight" defaultChecked />
            <Label htmlFor="include-weight">Weight</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-blood-glucose" />
            <Label htmlFor="include-blood-glucose">Blood Glucose</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-cholesterol" />
            <Label htmlFor="include-cholesterol">Cholesterol</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-medications" defaultChecked />
            <Label htmlFor="include-medications">Medications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-lab-results" />
            <Label htmlFor="include-lab-results">Lab Results</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Report Format</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="include-charts" defaultChecked />
            <Label htmlFor="include-charts">Include Charts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-tables" defaultChecked />
            <Label htmlFor="include-tables">Include Tables</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="include-summary" defaultChecked />
            <Label htmlFor="include-summary">Include Summary</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-name">Report Name</Label>
        <Input id="report-name" placeholder="Enter a name for this report" />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="flex-1">Generate Report</Button>
        <Button variant="outline">Save as Template</Button>
      </div>
    </div>
  )
}

