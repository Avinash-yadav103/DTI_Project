"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/component/ui/chart"

const data = [
  { name: "Male", value: 6200 },
  { name: "Female", value: 5800 },
  { name: "Other", value: 450 },
]

const COLORS = ["#0088FE", "#FF8042", "#00C49F"]

export function GenderDistribution() {
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
        <Tooltip formatter={(value) => [`${value} patients`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

