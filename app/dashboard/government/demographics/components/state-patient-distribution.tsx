"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/component/ui/chart"

const data = [
  {
    name: "Maharashtra",
    patients: 2450,
  },
  {
    name: "Karnataka",
    patients: 1850,
  },
  {
    name: "Tamil Nadu",
    patients: 1650,
  },
  {
    name: "Delhi",
    patients: 1450,
  },
  {
    name: "Gujarat",
    patients: 1250,
  },
  {
    name: "Uttar Pradesh",
    patients: 1150,
  },
  {
    name: "West Bengal",
    patients: 950,
  },
  {
    name: "Others",
    patients: 1700,
  },
]

export function StatePatientDistribution() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar dataKey="patients" name="Patients" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

