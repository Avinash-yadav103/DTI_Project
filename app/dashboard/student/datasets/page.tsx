"use client"

import { useState } from "react"
import { Database, Download, Search, Filter, Eye, FileText, BarChart, Settings, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function DatasetsPage() {
  const { user } = useAuth()
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [accessFilter, setAccessFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock datasets data
  const datasets = [
    {
      id: 1,
      title: "Anonymized Patient Records 2023",
      category: "Clinical Data",
      records: 12450,
      size: "1.2 GB",
      lastUpdated: "2023-06-10",
      access: "full",
      description:
        "Comprehensive anonymized patient records from multiple healthcare facilities across the country. Includes demographic information, diagnoses, treatments, and outcomes.",
      tags: ["demographics", "diagnoses", "treatments", "outcomes"],
    },
    {
      id: 2,
      title: "Diabetes Treatment Outcomes",
      category: "Research Data",
      records: 5280,
      size: "850 MB",
      lastUpdated: "2023-05-25",
      access: "full",
      description:
        "Longitudinal study data on diabetes treatment outcomes across different demographic groups. Includes medication efficacy, lifestyle interventions, and complication rates.",
      tags: ["diabetes", "treatment", "longitudinal", "complications"],
    },
    {
      id: 3,
      title: "COVID-19 Vaccination Efficacy",
      category: "Epidemiology",
      records: 8750,
      size: "1.5 GB",
      lastUpdated: "2023-06-01",
      access: "partial",
      description:
        "Data on COVID-19 vaccination efficacy across different age groups, demographics, and pre-existing conditions. Includes breakthrough infection rates and severity.",
      tags: ["covid-19", "vaccines", "efficacy", "demographics"],
    },
    {
      id: 4,
      title: "Heart Disease Risk Factors",
      category: "Cardiology",
      records: 3200,
      size: "620 MB",
      lastUpdated: "2023-04-15",
      access: "full",
      description:
        "Comprehensive dataset on heart disease risk factors including genetic markers, lifestyle factors, and environmental influences. Includes longitudinal follow-up data.",
      tags: ["heart disease", "risk factors", "genetics", "lifestyle"],
    },
    {
      id: 5,
      title: "Mental Health in Healthcare Workers",
      category: "Psychology",
      records: 2800,
      size: "450 MB",
      lastUpdated: "2023-05-05",
      access: "partial",
      description:
        "Survey data on mental health conditions among healthcare workers, including burnout rates, stress factors, and intervention efficacy.",
      tags: ["mental health", "healthcare workers", "burnout", "interventions"],
    },
  ]

  const handleDownloadDataset = (id: number) => {
    toast.success(`Downloading dataset ${id}`)
  }

  const handleViewDataset = (id: number) => {
    toast.success(`Viewing dataset ${id}`)
  }

  // Filter datasets based on selected filters and search query
  const filteredDatasets = datasets.filter((dataset) => {
    // Filter by category
    if (categoryFilter !== "all" && dataset.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false
    }

    // Filter by access level
    if (accessFilter !== "all" && dataset.access !== accessFilter) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = dataset.title.toLowerCase().includes(query)
      const matchesDescription = dataset.description.toLowerCase().includes(query)
      const matchesTags = dataset.tags.some((tag) => tag.toLowerCase().includes(query))

      if (!matchesTitle && !matchesDescription && !matchesTags) {
        return false
      }
    }

    return true
  })

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
      title="Available Datasets"
      user={user || { name: "", email: "" }}
      notifications={1}
      requiredRole="student"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-2xl">Available Datasets</CardTitle>
              <CardDescription>Anonymized healthcare data for research purposes</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  placeholder="Search datasets..."
                  className="pl-9 border border-gray-300 rounded-md h-10 w-full text-gray-900 placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="clinical data">Clinical Data</SelectItem>
                  <SelectItem value="research data">Research Data</SelectItem>
                  <SelectItem value="epidemiology">Epidemiology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="psychology">Psychology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access Levels</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="partial">Partial Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDatasets.length > 0 ? (
                filteredDatasets.map((dataset) => (
                  <div key={dataset.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{dataset.title}</h3>
                          <Badge
                            className={`
                              ${dataset.access === "full" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}
                            `}
                          >
                            {dataset.access === "full" ? "Full Access" : "Partial Access"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {dataset.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Category: {dataset.category}</span>
                          <span>Records: {dataset.records.toLocaleString()}</span>
                          <span>Size: {dataset.size}</span>
                          <span>Updated: {dataset.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => handleViewDataset(dataset.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 bg-sky-600 hover:bg-sky-700 text-white"
                          onClick={() => handleDownloadDataset(dataset.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Datasets Found</h3>
                  <p className="text-gray-600 mt-1">
                    No datasets match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

