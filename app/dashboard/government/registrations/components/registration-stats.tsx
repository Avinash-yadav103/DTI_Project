"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "@/component/ui/chart"

const typeData = [
  { name: "Government", value: 58 },
  { name: "Private", value: 72 },
  { name: "Trust", value: 15 },
]

const statusData = [
  { name: "Approved", value: 128 },
  { name: "Pending", value: 12 },
  { name: "Rejected", value: 5 },
]

const TYPE_COLORS = ["#0088FE", "#00C49F", "#FFBB28"]
const STATUS_COLORS = ["#82ca9d", "#ffc658", "#ff8042"]

export function RegistrationStats() {
  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Registration by Hospital Type</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Registration by Status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

