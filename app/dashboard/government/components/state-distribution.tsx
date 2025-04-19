"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/component/ui/chart"

const data = [
  { name: "Maharashtra", value: 28 },
  { name: "Karnataka", value: 22 },
  { name: "Tamil Nadu", value: 18 },
  { name: "Delhi", value: 15 },
  { name: "Gujarat", value: 12 },
  { name: "Uttar Pradesh", value: 10 },
  { name: "Others", value: 23 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

export function StateDistribution() {
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
        <Tooltip formatter={(value) => [`${value} hospitals`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

