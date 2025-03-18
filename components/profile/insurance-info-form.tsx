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

export function InsuranceInfoForm() {
  const [expiryDate, setExpiryDate] = useState<Date>()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Primary Insurance</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="insurance-provider">Insurance Provider</Label>
            <Input id="insurance-provider" defaultValue="Blue Cross Blue Shield" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-type">Plan Type</Label>
            <Select defaultValue="ppo">
              <SelectTrigger id="plan-type">
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hmo">HMO</SelectItem>
                <SelectItem value="ppo">PPO</SelectItem>
                <SelectItem value="epo">EPO</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
                <SelectItem value="hdhp">HDHP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="policy-number">Policy Number</Label>
            <Input id="policy-number" defaultValue="XYZ123456789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-number">Group Number</Label>
            <Input id="group-number" defaultValue="GRP987654321" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="member-id">Member ID</Label>
            <Input id="member-id" defaultValue="MEM123456789" />
          </div>
          <div className="space-y-2">
            <Label>Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "December 31, 2023"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Secondary Insurance (Optional)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="secondary-provider">Insurance Provider</Label>
            <Input id="secondary-provider" placeholder="Enter provider name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary-plan-type">Plan Type</Label>
            <Select>
              <SelectTrigger id="secondary-plan-type">
                <SelectValue placeholder="Select plan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hmo">HMO</SelectItem>
                <SelectItem value="ppo">PPO</SelectItem>
                <SelectItem value="epo">EPO</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
                <SelectItem value="hdhp">HDHP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="secondary-policy-number">Policy Number</Label>
            <Input id="secondary-policy-number" placeholder="Enter policy number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary-group-number">Group Number</Label>
            <Input id="secondary-group-number" placeholder="Enter group number" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Primary Care Physician</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pcp-name">Physician Name</Label>
            <Input id="pcp-name" defaultValue="Dr. Sarah Johnson" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pcp-phone">Phone Number</Label>
            <Input id="pcp-phone" defaultValue="(555) 123-4567" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

