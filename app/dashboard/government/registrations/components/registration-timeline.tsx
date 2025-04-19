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
} from "@/component/ui/chart"

const data = [
  {
    name: "Jan",
    requests: 8,
    approved: 7,
    rejected: 1,
  },
  {
    name: "Feb",
    requests: 10,
    approved: 9,
    rejected: 0,
  },
  {
    name: "Mar",
    requests: 12,
    approved: 10,
    rejected: 1,
  },
  {
    name: "Apr",
    requests: 15,
    approved: 13,
    rejected: 0,
  },
  {
    name: "May",
    requests: 11,
    approved: 10,
    rejected: 1,
  },
  {
    name: "Jun",
    requests: 14,
    approved: 12,
    rejected: 0,
  },
  {
    name: "Jul",
    requests: 16,
    approved: 15,
    rejected: 0,
  },
  {
    name: "Aug",
    requests: 18,
    approved: 16,
    rejected: 1,
  },
  {
    name: "Sep",
    requests: 13,
    approved: 12,
    rejected: 0,
  },
  {
    name: "Oct",
    requests: 15,
    approved: 13,
    rejected: 1,
  },
  {
    name: "Nov",
    requests: 17,
    approved: 15,
    rejected: 0,
  },
  {
    name: "Dec",
    requests: 20,
    approved: 18,
    rejected: 0,
  },
]

export function RegistrationTimeline() {
  return (
    <ResponsiveContainer width="100%" height={300}>
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
        <Area type="monotone" dataKey="requests" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="approved" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="rejected" stackId="2" stroke="#ffc658" fill="#ffc658" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

