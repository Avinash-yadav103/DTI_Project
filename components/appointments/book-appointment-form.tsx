"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function BookAppointmentForm() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          <Select>
            <SelectTrigger id="doctor">
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-emily-chen">Dr. Emily Chen (Cardiology)</SelectItem>
              <SelectItem value="dr-sarah-johnson">Dr. Sarah Johnson (Neurology)</SelectItem>
              <SelectItem value="dr-michael-lee">Dr. Michael Lee (General Practice)</SelectItem>
              <SelectItem value="dr-jessica-wong">Dr. Jessica Wong (Dermatology)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-type">Appointment Type</Label>
          <Select>
            <SelectTrigger id="appointment-type">
              <SelectValue placeholder="Select appointment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="check-up">Regular Check-up</SelectItem>
              <SelectItem value="follow-up">Follow-up Consultation</SelectItem>
              <SelectItem value="new-issue">New Health Issue</SelectItem>
              <SelectItem value="procedure">Medical Procedure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Date</Label>
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
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => {
                  // Disable past dates and weekends
                  const now = new Date()
                  now.setHours(0, 0, 0, 0)
                  const day = date.getDay()
                  return date < now || day === 0 || day === 6
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Select Time</Label>
          <Select>
            <SelectTrigger id="time" className="w-full">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9:00">9:00 AM</SelectItem>
              <SelectItem value="9:30">9:30 AM</SelectItem>
              <SelectItem value="10:00">10:00 AM</SelectItem>
              <SelectItem value="10:30">10:30 AM</SelectItem>
              <SelectItem value="11:00">11:00 AM</SelectItem>
              <SelectItem value="11:30">11:30 AM</SelectItem>
              <SelectItem value="1:00">1:00 PM</SelectItem>
              <SelectItem value="1:30">1:30 PM</SelectItem>
              <SelectItem value="2:00">2:00 PM</SelectItem>
              <SelectItem value="2:30">2:30 PM</SelectItem>
              <SelectItem value="3:00">3:00 PM</SelectItem>
              <SelectItem value="3:30">3:30 PM</SelectItem>
              <SelectItem value="4:00">4:00 PM</SelectItem>
              <SelectItem value="4:30">4:30 PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Textarea
            id="reason"
            placeholder="Please describe your symptoms or reason for the appointment"
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurance">Insurance Information</Label>
          <Input id="insurance" placeholder="Insurance provider and policy number" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" placeholder="Any additional information for the doctor" className="min-h-[80px]" />
        </div>

        <Button className="w-full mt-4">Schedule Appointment</Button>
      </div>
    </div>
  )
}

