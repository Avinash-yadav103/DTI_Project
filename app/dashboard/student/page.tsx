"use client"

import { useState } from "react"
import {
  FileText,
  Database,
  BarChartIcon as ChartBar,
  Settings,
  LogOut,
  Search,
  Download,
  Filter,
  BarChart,
  PieChart,
  LineChart,
  Home,
  PlusCircle,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("datasets")

  // Mock data
  const student = {
    name: "Alex Johnson",
    id: "STU-1234-5678",
    institution: "Medical Research University",
    department: "Health Informatics",
    email: "alex.johnson@mru.edu",
    photo: "/placeholder.svg?height=40&width=40",
  }

  const datasets = [
    {
      id: 1,
      title: "Anonymized Patient Records 2023",
      category: "Clinical Data",
      records: 12450,
      size: "1.2 GB",
      lastUpdated: "2023-06-10",
      access: "full",
    },
    {
      id: 2,
      title: "Diabetes Treatment Outcomes",
      category: "Research Data",
      records: 5280,
      size: "850 MB",
      lastUpdated: "2023-05-25",
      access: "full",
    },
    {
      id: 3,
      title: "COVID-19 Vaccination Efficacy",
      category: "Epidemiology",
      records: 8750,
      size: "1.5 GB",
      lastUpdated: "2023-06-01",
      access: "partial",
    },
    {
      id: 4,
      title: "Heart Disease Risk Factors",
      category: "Cardiology",
      records: 3200,
      size: "620 MB",
      lastUpdated: "2023-04-15",
      access: "full",
    },
  ]

  const researchProjects = [
    {
      id: 1,
      title: "AI-Based Diagnosis Assistance",
      status: "active",
      collaborators: 3,
      datasets: 2,
      progress: 65,
    },
    {
      id: 2,
      title: "Predictive Analytics for Patient Outcomes",
      status: "active",
      collaborators: 5,
      datasets: 3,
      progress: 40,
    },
    {
      id: 3,
      title: "Healthcare Accessibility Study",
      status: "completed",
      collaborators: 2,
      datasets: 1,
      progress: 100,
    },
  ]

  const handleDownloadDataset = (id) => {
    toast.success(`Downloading dataset ${id}`)
  }

  const handleViewDataset = (id) => {
    toast.success(`Viewing dataset ${id}`)
  }

  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard/student",
      icon: <Home className="h-4 w-4" />,
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
    {
      title: "Analytics",
      href: "/dashboard/student/analytics",
      icon: <ChartBar className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/student/profile",
      icon: <User className="h-4 w-4" />,
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
      href: "#",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
    },
  ]

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      footerItems={sidebarFooterItems}
      title="Student/Researcher Dashboard"
      user={student}
      notifications={1}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <div className="text-sm text-gray-600 mt-1">Datasets available for research</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setActiveTab("datasets")}>
              Browse Datasets
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <div className="text-sm text-gray-600 mt-1">Research projects in progress</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setActiveTab("projects")}>
              View Projects
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Data Access Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Level 3</div>
            <div className="text-sm text-gray-600 mt-1">Anonymized clinical data access</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Request Higher Access
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="datasets" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="projects">Research Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Available Datasets</CardTitle>
                  <CardDescription>Anonymized healthcare data for research purposes</CardDescription>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      placeholder="Search datasets..."
                      className="pl-9 border border-gray-300 rounded-md h-10 w-full text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] border-gray-300">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="clinical">Clinical Data</SelectItem>
                      <SelectItem value="research">Research Data</SelectItem>
                      <SelectItem value="epidemiology">Epidemiology</SelectItem>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">{dataset.title}</h3>
                          <Badge
                            className={`
                            ${dataset.access === "full" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}
                          `}
                          >
                            {dataset.access === "full" ? "Full Access" : "Partial Access"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Category: {dataset.category}</p>
                        <p className="text-xs text-gray-600">
                          Records: {dataset.records.toLocaleString()} • Size: {dataset.size} • Updated:{" "}
                          {dataset.lastUpdated}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => handleViewDataset(dataset.id)}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 bg-sky-600 hover:bg-sky-700 text-white"
                          onClick={() => handleDownloadDataset(dataset.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Research Projects</CardTitle>
                  <CardDescription>Your ongoing and completed research projects</CardDescription>
                </div>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {researchProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`
                    bg-gray-50 p-4 rounded-lg border border-gray-200
                    ${project.status === "completed" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-sky-500"}
                  `}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium">{project.title}</h3>
                          <Badge
                            className={`
                            ${project.status === "active" ? "bg-sky-100 text-sky-600" : "bg-green-100 text-green-600"}
                          `}
                          >
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Collaborators: {project.collaborators} • Datasets: {project.datasets}
                        </p>
                        <div className="mt-2 w-full max-w-xs">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                project.status === "completed" ? "bg-green-500" : "bg-sky-500"
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Data Analytics</CardTitle>
              <CardDescription>Visualize and analyze healthcare data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Disease Distribution</h3>
                    <PieChart className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Interactive chart will appear here</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Treatment Outcomes</h3>
                    <BarChart className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Interactive chart will appear here</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Patient Demographics</h3>
                    <LineChart className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Interactive chart will appear here</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Data Analysis Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 h-auto py-3 justify-start w-full"
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
                  >
                    <ChartBar className="h-5 w-5 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">Visualization Builder</div>
                      <div className="text-xs text-gray-600">Create custom charts and graphs</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

