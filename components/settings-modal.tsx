"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Shield, Info } from "lucide-react"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [dataSharing, setDataSharing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast.success("Settings saved successfully")
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your account and privacy settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="mt-0.5">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">Data Sharing for Research</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Help improve healthcare by sharing your anonymized data for research purposes.
                </p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing" className="font-medium">
                    Share Anonymized Data
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Your data will be fully anonymized and used only for medical research
                  </p>
                </div>
                <Switch id="data-sharing" checked={dataSharing} onCheckedChange={setDataSharing} />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto text-sm text-gray-600">
              <h4 className="font-medium text-gray-900 mb-2">Terms and Conditions for Data Sharing</h4>
              <p className="mb-2">
                By enabling data sharing, you agree to allow Charak to collect, process, and share your medical data
                under the following conditions:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>All data will be fully anonymized before being used for research.</li>
                <li>No personally identifiable information will be shared with research partners.</li>
                <li>Your data will only be used for legitimate medical research purposes.</li>
                <li>You can withdraw your consent at any time by changing this setting.</li>
                <li>Anonymized data that has already been shared cannot be recalled.</li>
                <li>Charak implements industry-standard security measures to protect your data.</li>
                <li>
                  Research findings may be published in academic journals without identifying individual patients.
                </li>
                <li>You will not receive financial compensation for the use of your anonymized data.</li>
              </ol>
              <div className="flex items-center gap-2 mt-3 text-blue-600">
                <Info className="h-4 w-4" />
                <span>For more information, please review our full Privacy Policy.</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

