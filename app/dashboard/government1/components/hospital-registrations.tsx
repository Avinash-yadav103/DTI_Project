"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    "City Hospitals": 1,
    "Rural Hospitals": 1,
    "Private Clinics": 0,
  },
  {
    name: "Feb",
    "City Hospitals": 2,
    "Rural Hospitals": 0,
    "Private Clinics": 1,
  },
  {
    name: "Mar",
    "City Hospitals": 0,
    "Rural Hospitals": 1,
    "Private Clinics": 0,
  },
  {
    name: "Apr",
    "City Hospitals": 1,
    "Rural Hospitals": 2,
    "Private Clinics": 1,
  },
  {
    name: "May",
    "City Hospitals": 1,
    "Rural Hospitals": 0,
    "Private Clinics": 1,
  },
  {
    name: "Jun",
    "City Hospitals": 2,
    "Rural Hospitals": 1,
    "Private Clinics": 0,
  },
  {
    name: "Jul",
    "City Hospitals": 3,
    "Rural Hospitals": 1,
    "Private Clinics": 1,
  },
  {
    name: "Aug",
    "City Hospitals": 4,
    "Rural Hospitals": 2,
    "Private Clinics": 1,
  },
  {
    name: "Sep",
    "City Hospitals": 2,
    "Rural Hospitals": 1,
    "Private Clinics": 1,
  },
  {
    name: "Oct",
    "City Hospitals": 3,
    "Rural Hospitals": 2,
    "Private Clinics": 1,
  },
  {
    name: "Nov",
    "City Hospitals": 5,
    "Rural Hospitals": 2,
    "Private Clinics": 1,
  },
  {
    name: "Dec",
    "City Hospitals": 6,
    "Rural Hospitals": 3,
    "Private Clinics": 1,
  },
]

export function HospitalRegistrations() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="City Hospitals" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="Rural Hospitals" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="Private Clinics" stackId="1" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

