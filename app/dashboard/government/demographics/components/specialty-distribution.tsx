"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/component/ui/chart"

const data = [
  { name: "General Medicine", value: 320 },
  { name: "Pediatrics", value: 180 },
  { name: "Cardiology", value: 150 },
  { name: "Orthopedics", value: 140 },
  { name: "Neurology", value: 120 },
  { name: "Gynecology", value: 110 },
  { name: "Others", value: 225 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

export function SpecialtyDistribution() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} doctors`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

