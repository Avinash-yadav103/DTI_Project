"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { date: "10/27", systolic: 118, diastolic: 78 },
  { date: "10/29", systolic: 122, diastolic: 80 },
  { date: "11/4", systolic: 120, diastolic: 79 },
  { date: "11/11", systolic: 118, diastolic: 76 },
  { date: "11/18", systolic: 120, diastolic: 80 },
  { date: "11/25", systolic: 119, diastolic: 78 },
]

export function BloodPressureChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[60, 140]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

