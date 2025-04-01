import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ChevronRight } from "lucide-react"
import Link from "next/link"

type TimelineEvent = {
  id: string
  date: string
  condition: string
  doctor: string
  treatment: string
  notes: string
  type: "Visit" | "Procedure" | "Test" | "Medication"
}

export function MedicalTimeline({ limit }: { limit?: number }) {
  const events: TimelineEvent[] = [
    {
      id: "event1",
      date: "2023-11-15",
      condition: "Common Cold",
      doctor: "Dr. Michael Stevens",
      treatment: "Rest, fluids, over-the-counter cold medications",
      notes: "Patient presented with mild fever, sore throat, and nasal congestion",
      type: "Visit",
    },
    {
      id: "event2",
      date: "2023-09-20",
      condition: "Hypertension",
      doctor: "Dr. Emily Chen",
      treatment: "Prescribed Lisinopril 10mg daily, recommended diet changes",
      notes: "Blood pressure consistently high over multiple readings",
      type: "Visit",
    },
    {
      id: "event3",
      date: "2023-08-05",
      condition: "Knee Sprain",
      doctor: "Dr. James Wilson",
      treatment: "Physical therapy, RICE protocol, ibuprofen for pain",
      notes: "MRI showed minor ligament damage, no surgery required",
      type: "Visit",
    },
    {
      id: "event4",
      date: "2023-06-12",
      condition: "Annual Physical",
      doctor: "Dr. Sarah Johnson",
      treatment: "No treatment required",
      notes: "All vitals normal, recommended increased physical activity",
      type: "Visit",
    },
    {
      id: "event5",
      date: "2023-04-30",
      condition: "Lisinopril Treatment",
      doctor: "Dr. Emily Chen",
      treatment: "Completed 3-month course of Lisinopril 10mg",
      notes: "Blood pressure stabilized to normal range",
      type: "Medication",
    },
  ]

  const displayEvents = limit ? events.slice(0, limit) : events

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Medical Timeline</h3>
        {limit && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/medical-history">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-9 before:border-l-2 before:border-muted pl-[74px]">
        {displayEvents.map((event) => (
          <div key={event.id} className="relative -left-[74px]">
            <div className="flex mb-4 items-start">
              <div className="flex flex-col items-center mr-4 w-[74px]">
                <div className="bg-background z-10 p-1">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground mt-1">{event.date}</span>
              </div>

              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{event.condition}</h4>
                      <p className="text-sm text-muted-foreground">{event.doctor}</p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>

                  <div className="space-y-2 mt-3">
                    <p className="text-sm font-medium">{event.treatment}</p>
                    <p className="text-sm text-muted-foreground">{event.notes}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

