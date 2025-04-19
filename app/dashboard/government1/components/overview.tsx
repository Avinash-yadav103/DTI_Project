"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    patients: 1200,
    hospitals: 2,
  },
  {
    name: "Feb",
    patients: 1800,
    hospitals: 3,
  },
  {
    name: "Mar",
    patients: 1600,
    hospitals: 1,
  },
  {
    name: "Apr",
    patients: 2200,
    hospitals: 4,
  },
  {
    name: "May",
    patients: 1700,
    hospitals: 2,
  },
  {
    name: "Jun",
    patients: 1900,
    hospitals: 3,
  },
  {
    name: "Jul",
    patients: 2100,
    hospitals: 5,
  },
  {
    name: "Aug",
    patients: 2500,
    hospitals: 7,
  },
  {
    name: "Sep",
    patients: 2300,
    hospitals: 4,
  },
  {
    name: "Oct",
    patients: 2400,
    hospitals: 6,
  },
  {
    name: "Nov",
    patients: 2700,
    hospitals: 8,
  },
  {
    name: "Dec",
    patients: 3000,
    hospitals: 10,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="patients" name="Patient Registrations" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="hospitals" name="Hospital Enrollments" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

