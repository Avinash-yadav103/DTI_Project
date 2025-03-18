"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "@/components/ui/chart"

const data = [
  { date: "Jan 2023", total: 195, ldl: 120, hdl: 50, triglycerides: 125 },
  { date: "Apr 2023", total: 190, ldl: 115, hdl: 52, triglycerides: 122 },
  { date: "Jul 2023", total: 188, ldl: 112, hdl: 54, triglycerides: 121 },
  { date: "Oct 2023", total: 185, ldl: 110, hdl: 55, triglycerides: 120 },
]

export function CholesterolChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" name="Total" fill="#8884d8" />
        <Bar dataKey="ldl" name="LDL" fill="#f87171" />
        <Bar dataKey="hdl" name="HDL" fill="#4ade80" />
        <Bar dataKey="triglycerides" name="Triglycerides" fill="#facc15" />
      </BarChart>
    </ResponsiveContainer>
  )
}

