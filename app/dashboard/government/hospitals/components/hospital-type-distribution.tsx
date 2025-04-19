"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/component/ui/chart"

const data = [
  { name: "Government", value: 42 },
  { name: "Private", value: 65 },
  { name: "Trust", value: 21 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function HospitalTypeDistribution() {
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

