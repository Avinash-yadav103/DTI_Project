import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bell, Clock, Calendar, Smartphone, Mail } from "lucide-react"

export function MedicationReminders() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span>Push Notifications</span>
                </Label>
                <Switch id="push-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email Notifications</span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span>SMS Notifications</span>
                </Label>
                <Switch id="sms-notifications" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Reminder Timing</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Select defaultValue="15min">
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Select reminder time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">5 minutes before</SelectItem>
                    <SelectItem value="15min">15 minutes before</SelectItem>
                    <SelectItem value="30min">30 minutes before</SelectItem>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                <Select defaultValue="once">
                  <SelectTrigger id="reminder-frequency">
                    <SelectValue placeholder="Select reminder frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once only</SelectItem>
                    <SelectItem value="twice">Twice (with 5 min interval)</SelectItem>
                    <SelectItem value="until-taken">Until marked as taken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Daily Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-summary" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Daily Medication Summary</span>
                </Label>
                <Switch id="daily-summary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="summary-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Summary Time</span>
                </Label>
                <Select defaultValue="morning">
                  <SelectTrigger id="summary-time" className="w-[180px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                    <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                    <SelectItem value="night">Night (9:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button>Save Reminder Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Lisinopril 10mg</h4>
                  <p className="text-sm text-muted-foreground">Today at 8:00 AM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Snooze
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Ibuprofen 400mg</h4>
                  <p className="text-sm text-muted-foreground">Today at 12:00 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Snooze
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Ibuprofen 400mg</h4>
                  <p className="text-sm text-muted-foreground">Today at 6:00 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Snooze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

