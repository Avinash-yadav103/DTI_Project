"use client"

import * as React from "react"
import { AreaChart as RechartsAreaChart, Area as RechartsArea } from "recharts"
import { BarChart as RechartsBarChart, Bar as RechartsBar } from "recharts"
import { LineChart as RechartsLineChart, Line as RechartsLine } from "recharts"
import { PieChart as RechartsPieChart, Pie as RechartsPie } from "recharts"
import { CartesianGrid as RechartsCartesianGrid } from "recharts"
import { XAxis as RechartsXAxis } from "recharts"
import { YAxis as RechartsYAxis } from "recharts"
import { Tooltip as RechartsTooltip } from "recharts"
import { Legend as RechartsLegend } from "recharts"
import { ResponsiveContainer as RechartsResponsiveContainer } from "recharts"
import { Cell as RechartsCell } from "recharts"

export const Area = RechartsArea
export const AreaChart = RechartsAreaChart
export const Bar = RechartsBar
export const BarChart = RechartsBarChart
export const CartesianGrid = RechartsCartesianGrid
export const Cell = RechartsCell
export const Legend = RechartsLegend
export const Line = RechartsLine
export const LineChart = RechartsLineChart
export const Pie = RechartsPie
export const PieChart = RechartsPieChart
export const ResponsiveContainer = RechartsResponsiveContainer
export const Tooltip = RechartsTooltip
export const XAxis = RechartsXAxis
export const YAxis = RechartsYAxis

export const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className="rounded-lg border bg-background p-2 shadow-md" {...props} />
  ),
)
ChartTooltip.displayName = "ChartTooltip"

export const ChartTooltipLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className="mb-1 font-medium leading-none tracking-tight" {...props} />
  ),
)
ChartTooltipLabel.displayName = "ChartTooltipLabel"

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className="text-sm text-muted-foreground" {...props} />,
)
ChartTooltipContent.displayName = "ChartTooltipContent"

