"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, Check, AlertCircle } from "lucide-react"
import { AddMedicationDialog } from "@/components/medications/add-medication-dialog"
import { cn } from "@/lib/utils"

type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  reason: string
  startDate: string
  endDate: string
  timesPerDay: number
  daysLeft: number
  schedule: {
    [date: string]: boolean[]
  }
}

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Daily",
      reason: "Hypertension",
      startDate: "2023-03-01",
      endDate: "2023-03-31",
      timesPerDay: 1,
      daysLeft: 10,
      schedule: {
        "2023-03-01": [true],
        "2023-03-02": [true],
        "2023-03-03": [true],
        "2023-03-04": [false],
        "2023-03-05": [true],
        "2023-03-06": [true],
        "2023-03-07": [true],
        "2023-03-08": [true],
        "2023-03-09": [true],
        "2023-03-10": [true],
        "2023-03-11": [false],
        "2023-03-12": [false],
        "2023-03-13": [false],
        "2023-03-14": [false],
        "2023-03-15": [false],
        "2023-03-16": [false],
        "2023-03-17": [false],
        "2023-03-18": [false],
        "2023-03-19": [false],
        "2023-03-20": [false],
      },
    },
    {
      id: "med2",
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      reason: "Pain relief",
      startDate: "2023-03-05",
      endDate: "2023-03-12",
      timesPerDay: 3,
      daysLeft: 2,
      schedule: {
        "2023-03-05": [true, true, true],
        "2023-03-06": [true, true, false],
        "2023-03-07": [true, false, true],
        "2023-03-08": [true, true, true],
        "2023-03-09": [false, false, false],
        "2023-03-10": [false, false, false],
        "2023-03-11": [false, false, false],
        "2023-03-12": [false, false, false],
      },
    },
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Function to toggle medication taken status
  const toggleMedicationTaken = (medicationId: string, date: string, doseIndex: number) => {
    setMedications(
      medications.map((med) => {
        if (med.id === medicationId) {
          const updatedSchedule = { ...med.schedule }
          if (!updatedSchedule[date]) {
            updatedSchedule[date] = Array(med.timesPerDay).fill(false)
          }
          updatedSchedule[date][doseIndex] = !updatedSchedule[date][doseIndex]
          return { ...med, schedule: updatedSchedule }
        }
        return med
      }),
    )
  }

  // Function to add a new medication
  const addMedication = (medication: Omit<Medication, "id" | "schedule">) => {
    const newMedication: Medication = {
      ...medication,
      id: `med${medications.length + 1}`,
      schedule: {},
    }

    setMedications([...medications, newMedication])
    setShowAddDialog(false)
  }

  // Generate dates for the current month
  const getDaysInMonth = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      return dateStr
    })
  }

  const currentMonthDates = getDaysInMonth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Medication Tracker</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>

      <div className="grid gap-4">
        {medications.map((medication) => (
          <Card key={medication.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    {medication.name} {medication.dosage}
                  </CardTitle>
                  <CardDescription>
                    {medication.frequency} • {medication.reason}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{medication.daysLeft} days left</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Take {medication.timesPerDay} time{medication.timesPerDay > 1 ? "s" : ""} per day • Started on{" "}
                  {medication.startDate} • Ends on {medication.endDate}
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-2 min-w-max">
                    {currentMonthDates.map((date) => {
                      const day = Number.parseInt(date.split("-")[2])
                      const isToday = date === today
                      const isPast = new Date(date) < new Date(today)

                      return (
                        <div
                          key={date}
                          className={cn("flex flex-col items-center", isToday && "bg-primary/10 rounded-md")}
                        >
                          <span className="text-xs font-medium mb-1">{day}</span>
                          <div className="space-y-1">
                            {Array.from({ length: medication.timesPerDay }, (_, i) => {
                              const taken = medication.schedule[date]?.[i] || false
                              return (
                                <div key={`${date}-${i}`} className="flex items-center justify-center">
                                  <Checkbox
                                    checked={taken}
                                    onCheckedChange={() => toggleMedicationTaken(medication.id, date, i)}
                                    className={cn(
                                      taken && "bg-primary border-primary",
                                      taken &&
                                        "after:content-[''] after:absolute after:inset-0 after:border-t-2 after:border-background/50 after:rotate-[-45deg]",
                                    )}
                                    disabled={isPast && !taken}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Taken: 12</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>Missed: 2</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddMedicationDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={addMedication} />
    </div>
  )
}

