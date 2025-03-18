"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddHealthMetricForm() {
  const [date, setDate] = useState<Date>()
  const [metricType, setMetricType] = useState<string>("blood-pressure")

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metric-type">Metric Type</Label>
          <Select defaultValue="blood-pressure" onValueChange={(value) => setMetricType(value)}>
            <SelectTrigger id="metric-type">
              <SelectValue placeholder="Select metric type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
              <SelectItem value="heart-rate">Heart Rate</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="blood-glucose">Blood Glucose</SelectItem>
              <SelectItem value="cholesterol">Cholesterol</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input type="time" id="time" />
          </div>
        </div>

        {metricType === "blood-pressure" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systolic">Systolic (mmHg)</Label>
              <Input type="number" id="systolic" placeholder="120" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
              <Input type="number" id="diastolic" placeholder="80" />
            </div>
          </div>
        )}

        {metricType === "heart-rate" && (
          <div className="space-y-2">
            <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
            <Input type="number" id="heart-rate" placeholder="70" />
          </div>
        )}

        {metricType === "weight" && (
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <div className="flex gap-2">
              <Input type="number" id="weight" placeholder="175" className="flex-1" />
              <Select defaultValue="lbs">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lbs">lbs</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {metricType === "blood-glucose" && (
          <div className="space-y-2">
            <Label htmlFor="glucose">Blood Glucose</Label>
            <div className="flex gap-2">
              <Input type="number" id="glucose" placeholder="100" className="flex-1" />
              <Select defaultValue="mg/dL">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg/dL">mg/dL</SelectItem>
                  <SelectItem value="mmol/L">mmol/L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {metricType === "cholesterol" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="total-cholesterol">Total Cholesterol (mg/dL)</Label>
              <Input type="number" id="total-cholesterol" placeholder="185" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ldl">LDL (mg/dL)</Label>
              <Input type="number" id="ldl" placeholder="110" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hdl">HDL (mg/dL)</Label>
              <Input type="number" id="hdl" placeholder="55" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
              <Input type="number" id="triglycerides" placeholder="120" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="activity">Activity Level</Label>
          <Select>
            <SelectTrigger id="activity">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resting">Resting</SelectItem>
              <SelectItem value="light">After Light Activity</SelectItem>
              <SelectItem value="moderate">After Moderate Activity</SelectItem>
              <SelectItem value="intense">After Intense Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medication">Medication</Label>
          <Select>
            <SelectTrigger id="medication">
              <SelectValue placeholder="Select medication status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="before">Before Medication</SelectItem>
              <SelectItem value="after">After Medication</SelectItem>
              <SelectItem value="none">No Medication</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meal">Meal Status</Label>
          <Select>
            <SelectTrigger id="meal">
              <SelectValue placeholder="Select meal status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fasting">Fasting</SelectItem>
              <SelectItem value="before">Before Meal</SelectItem>
              <SelectItem value="after">After Meal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="Add any additional notes or observations" className="min-h-[120px]" />
        </div>

        <Button className="w-full mt-4">Save Measurement</Button>
      </div>
    </div>
  )
}

