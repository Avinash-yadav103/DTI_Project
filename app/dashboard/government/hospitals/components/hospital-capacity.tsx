"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/component/ui/chart"

const data = [
  {
    name: "Government",
    beds: 12500,
  },
  {
    name: "Private",
    beds: 18500,
  },
  {
    name: "Trust",
    beds: 6800,
  },
]

export function HospitalCapacity() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} beds`, "Capacity"]} />
        <Legend />
        <Bar dataKey="beds" name="Bed Capacity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

