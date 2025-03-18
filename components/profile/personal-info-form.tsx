"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function PersonalInfoForm() {
  const [dob, setDob] = useState<Date>()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" defaultValue="Alex" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" defaultValue="Morgan" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="alex.morgan@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dob && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dob ? format(dob, "PPP") : "January 15, 1984"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dob} onSelect={setDob} initialFocus defaultMonth={new Date(1984, 0)} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select defaultValue="male">
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="blood-type">Blood Type</Label>
          <Select defaultValue="o-positive">
            <SelectTrigger id="blood-type">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a-positive">A+</SelectItem>
              <SelectItem value="a-negative">A-</SelectItem>
              <SelectItem value="b-positive">B+</SelectItem>
              <SelectItem value="b-negative">B-</SelectItem>
              <SelectItem value="ab-positive">AB+</SelectItem>
              <SelectItem value="ab-negative">AB-</SelectItem>
              <SelectItem value="o-positive">O+</SelectItem>
              <SelectItem value="o-negative">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" defaultValue="123 Main Street" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" defaultValue="Anytown" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select defaultValue="ca">
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="al">Alabama</SelectItem>
              <SelectItem value="ak">Alaska</SelectItem>
              <SelectItem value="az">Arizona</SelectItem>
              <SelectItem value="ar">Arkansas</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="co">Colorado</SelectItem>
              {/* More states would be listed here */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" defaultValue="12345" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select defaultValue="us">
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              {/* More countries would be listed here */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation">Occupation</Label>
        <Input id="occupation" defaultValue="Software Engineer" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

