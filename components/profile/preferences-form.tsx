"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function PreferencesForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Notifications</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="appointment-reminders" className="flex flex-col space-y-1">
              <span>Appointment Reminders</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive reminders about upcoming appointments
              </span>
            </Label>
            <Switch id="appointment-reminders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="medication-reminders" className="flex flex-col space-y-1">
              <span>Medication Reminders</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive reminders to take your medications
              </span>
            </Label>
            <Switch id="medication-reminders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lab-results" className="flex flex-col space-y-1">
              <span>Lab Results</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive notifications when new lab results are available
              </span>
            </Label>
            <Switch id="lab-results" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="health-tips" className="flex flex-col space-y-1">
              <span>Health Tips & News</span>
              <span className="font-normal text-sm text-muted-foreground">Receive occasional health tips and news</span>
            </Label>
            <Switch id="health-tips" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Notification Preferences</h3>
        <div className="space-y-2">
          <Label>Preferred Notification Method</Label>
          <RadioGroup defaultValue="email" className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sms" id="sms" />
              <Label htmlFor="sms">SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both">Both Email and SMS</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminder-time">Reminder Time</Label>
          <Select defaultValue="24hours">
            <SelectTrigger id="reminder-time">
              <SelectValue placeholder="Select reminder time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1hour">1 hour before</SelectItem>
              <SelectItem value="3hours">3 hours before</SelectItem>
              <SelectItem value="12hours">12 hours before</SelectItem>
              <SelectItem value="24hours">24 hours before</SelectItem>
              <SelectItem value="48hours">48 hours before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Privacy Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="share-data" defaultChecked />
            <Label htmlFor="share-data" className="flex flex-col">
              <span>Share data with healthcare providers</span>
              <span className="font-normal text-sm text-muted-foreground">
                Allow your healthcare providers to access your health data
              </span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="research" />
            <Label htmlFor="research" className="flex flex-col">
              <span>Participate in research</span>
              <span className="font-normal text-sm text-muted-foreground">
                Allow anonymized data to be used for medical research
              </span>
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Display Settings</h3>
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select defaultValue="system">
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="units">Measurement Units</Label>
          <Select defaultValue="imperial">
            <SelectTrigger id="units">
              <SelectValue placeholder="Select units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, in, F)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm, C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}

