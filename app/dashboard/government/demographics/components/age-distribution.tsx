"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/component/ui/chart"

const data = [
  {
    name: "0-10",
    patients: 1250,
  },
  {
    name: "11-20",
    patients: 1450,
  },
  {
    name: "21-30",
    patients: 2100,
  },
  {
    name: "31-40",
    patients: 2400,
  },
  {
    name: "41-50",
    patients: 1900,
  },
  {
    name: "51-60",
    patients: 1600,
  },
  {
    name: "61-70",
    patients: 1100,
  },
  {
    name: "71+",
    patients: 650,
  },
]

export function AgeDistribution() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="patients" name="Patients" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

