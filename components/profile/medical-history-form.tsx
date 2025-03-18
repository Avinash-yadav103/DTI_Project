"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash } from "lucide-react"

export function MedicalHistoryForm() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Current Medications</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Lisinopril</TableCell>
              <TableCell>10mg</TableCell>
              <TableCell>Once daily</TableCell>
              <TableCell>Blood pressure</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Atorvastatin</TableCell>
              <TableCell>20mg</TableCell>
              <TableCell>Once daily</TableCell>
              <TableCell>Cholesterol</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Allergies</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Allergen</TableHead>
              <TableHead>Reaction</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Penicillin</TableCell>
              <TableCell>Rash</TableCell>
              <TableCell>Moderate</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Peanuts</TableCell>
              <TableCell>Swelling, difficulty breathing</TableCell>
              <TableCell>Severe</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Allergy
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Medical Conditions</h3>
        <div className="grid gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="hypertension" />
            <Label htmlFor="hypertension">Hypertension</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="diabetes" />
            <Label htmlFor="diabetes">Diabetes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="asthma" />
            <Label htmlFor="asthma">Asthma</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="heart-disease" />
            <Label htmlFor="heart-disease">Heart Disease</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cancer" />
            <Label htmlFor="cancer">Cancer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="arthritis" />
            <Label htmlFor="arthritis">Arthritis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="depression" />
            <Label htmlFor="depression">Depression</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="anxiety" />
            <Label htmlFor="anxiety">Anxiety</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="other-conditions">Other Conditions</Label>
        <Textarea id="other-conditions" placeholder="List any other medical conditions not mentioned above" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surgical-history">Surgical History</Label>
        <Textarea id="surgical-history" placeholder="List any surgeries you've had, including dates" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="family-history">Family Medical History</Label>
        <Textarea id="family-history" placeholder="List any significant medical conditions in your immediate family" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

