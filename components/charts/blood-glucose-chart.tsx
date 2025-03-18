"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { date: "10/27", glucose: 102 },
  { date: "10/29", glucose: 98 },
  { date: "11/4", glucose: 105 },
  { date: "11/11", glucose: 100 },
  { date: "11/18", glucose: 98 },
  { date: "11/25", glucose: 97 },
]

export function BloodGlucoseChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[80, 140]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="glucose" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

