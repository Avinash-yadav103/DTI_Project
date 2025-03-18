"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { date: "10/27", heartRate: 68 },
  { date: "10/29", heartRate: 65 },
  { date: "11/4", heartRate: 70 },
  { date: "11/11", heartRate: 72 },
  { date: "11/18", heartRate: 68 },
  { date: "11/25", heartRate: 69 },
]

export function HeartRateChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[50, 90]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

