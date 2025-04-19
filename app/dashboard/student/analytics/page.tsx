"use client"

import { useState } from "react"
import { BarChart, LineChart, PieChart, Database, FileText, Settings, LogOut, Download, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("month")
  const [datasetFilter, setDatasetFilter] = useState("all")

  const handleExportData = () => {
    toast.success("Exporting analytics data")
  }

  const handleRunQuery = () => {
    toast.success("Opening SQL query tool")
  }

  const handleCreateVisualization = () => {
    toast.success("Opening visualization builder")
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard/student",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Datasets",
      href: "/dashboard/student/datasets",
      icon: <Database className="h-4 w-4" />,
    },
    {
      title: "Projects",
      href: "/dashboard/student/projects",
      icon: <FileText className="h-4 w-4" />,
    },
    
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/student/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: "Logout",
      href: "/login",
      icon: <LogOut className="h-4 w-4" />,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Data Analytics"
      user={user || { name: "", email: "" }}
      notifications={1}
      requiredRole="student"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-2xl">Data Analytics</CardTitle>
              <CardDescription>Visualize and analyze healthcare data</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] border-gray-300">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="quarter">Past Quarter</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={datasetFilter} onValueChange={setDatasetFilter}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by dataset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Datasets</SelectItem>
                  <SelectItem value="patient-records">Patient Records</SelectItem>
                  <SelectItem value="diabetes">Diabetes Treatment</SelectItem>
                  <SelectItem value="covid">COVID-19 Vaccination</SelectItem>
                  <SelectItem value="heart">Heart Disease</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-gray-300" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Disease Distribution</h3>
                  <PieChart className="h-5 w-5 text-gray-600" />
                </div>
                <div className="h-48 flex items-center justify-center bg-white rounded border border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Interactive chart will appear here</p>
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                      <PieChart className="h-12 w-12 text-sky-500 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Treatment Outcomes</h3>
                  <BarChart className="h-5 w-5 text-gray-600" />
                </div>
                <div className="h-48 flex items-center justify-center bg-white rounded border border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Interactive chart will appear here</p>
                    <div className="w-32 h-32 mx-auto flex items-end justify-center gap-2">
                      {[40, 65, 35, 85, 55].map((height, i) => (
                        <div
                          key={i}
                          className="w-4 bg-sky-500 opacity-50 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Patient Demographics</h3>
                  <LineChart className="h-5 w-5 text-gray-600" />
                </div>
                <div className="h-48 flex items-center justify-center bg-white rounded border border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Interactive chart will appear here</p>
                    <div className="w-32 h-32 mx-auto relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-0.5 bg-gray-200"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-around">
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Data Analysis Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 h-auto py-3 justify-start w-full"
                  onClick={handleRunQuery}
                >
                  <Database className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">SQL Query Tool</div>
                    <div className="text-xs text-gray-600">Run custom SQL queries on datasets</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 h-auto py-3 justify-start w-full"
                  onClick={handleCreateVisualization}
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Visualization Builder</div>
                    <div className="text-xs text-gray-600">Create custom charts and graphs</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Recent Analyses</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Diabetes Treatment Efficacy Analysis</h4>
                      <p className="text-sm text-gray-600">Created 2 days ago • Last run: Yesterday</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Again
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">COVID-19 Vaccination Side Effects by Age Group</h4>
                      <p className="text-sm text-gray-600">Created 1 week ago • Last run: 3 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Again
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Heart Disease Risk Factor Correlation</h4>
                      <p className="text-sm text-gray-600">Created 2 weeks ago • Last run: 1 week ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Run Again
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

