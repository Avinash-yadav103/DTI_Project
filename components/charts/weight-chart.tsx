"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

const data = [
  { date: "Jun 15", weight: 182 },
  { date: "Jul 15", weight: 180 },
  { date: "Aug 15", weight: 178 },
  { date: "Sep 15", weight: 177 },
  { date: "Oct 15", weight: 176 },
  { date: "Nov 15", weight: 175 },
]

export function WeightChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[165, 185]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

