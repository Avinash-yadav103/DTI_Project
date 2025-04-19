"use client"

import { useState } from "react"
import { FileText, Plus, BarChart, Settings, LogOut, Database, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

export default function ProjectsPage() {
  const { user } = useAuth()
  const [creatingProject, setCreatingProject] = useState(false)

  // Mock research projects data
  const researchProjects = [
    {
      id: 1,
      title: "AI-Based Diagnosis Assistance",
      description:
        "Developing a machine learning model to assist in early diagnosis of cardiovascular diseases using patient data and imaging.",
      status: "active",
      collaborators: [
        { name: "Dr. Sarah Johnson", role: "Principal Investigator" },
        { name: "Alex Johnson", role: "Data Scientist" },
        { name: "Dr. Michael Chen", role: "Medical Advisor" },
      ],
      datasets: [
        { id: 4, name: "Heart Disease Risk Factors" },
        { id: 2, name: "Diabetes Treatment Outcomes" },
      ],
      progress: 65,
      startDate: "2023-03-15",
      endDate: "2023-09-15",
      lastUpdated: "2023-06-12",
    },
    {
      id: 2,
      title: "Predictive Analytics for Patient Outcomes",
      description:
        "Using historical patient data to develop predictive models for treatment outcomes across various medical conditions.",
      status: "active",
      collaborators: [
        { name: "Dr. Emily Wong", role: "Principal Investigator" },
        { name: "Alex Johnson", role: "Data Scientist" },
        { name: "Dr. Robert Miller", role: "Statistical Analyst" },
        { name: "Lisa Chen", role: "Research Assistant" },
        { name: "Dr. James Wilson", role: "Medical Advisor" },
      ],
      datasets: [
        { id: 1, name: "Anonymized Patient Records 2023" },
        { id: 2, name: "Diabetes Treatment Outcomes" },
        { id: 4, name: "Heart Disease Risk Factors" },
      ],
      progress: 40,
      startDate: "2023-04-10",
      endDate: "2023-10-10",
      lastUpdated: "2023-06-10",
    },
    {
      id: 3,
      title: "Healthcare Accessibility Study",
      description:
        "Analyzing geographic and demographic factors affecting healthcare accessibility and outcomes in rural vs. urban areas.",
      status: "completed",
      collaborators: [
        { name: "Dr. Lisa Patel", role: "Principal Investigator" },
        { name: "Alex Johnson", role: "Data Analyst" },
      ],
      datasets: [{ id: 1, name: "Anonymized Patient Records 2023" }],
      progress: 100,
      startDate: "2023-01-05",
      endDate: "2023-04-05",
      completedDate: "2023-04-02",
      lastUpdated: "2023-04-02",
      publications: [
        {
          title: "Healthcare Accessibility Disparities in Rural Communities",
          journal: "Journal of Public Health",
          date: "2023-05-15",
        },
      ],
    },
  ]

  const handleCreateProject = () => {
    setCreatingProject(true)
    setTimeout(() => {
      toast.success("New research project created successfully")
      setCreatingProject(false)
    }, 1500)
  }

  const handleViewProject = (id: number) => {
    toast.success(`Viewing project details for project ${id}`)
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
    {
      title: "Analytics",
      href: "/dashboard/student/analytics",
      icon: <BarChart className="h-4 w-4" />,
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
      title="Research Projects"
      user={user || { name: "", email: "" }}
      notifications={1}
      requiredRole="student"
    >
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
            <div>
              <CardTitle className="text-2xl">Research Projects</CardTitle>
              <CardDescription>Your ongoing and completed research projects</CardDescription>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleCreateProject} disabled={creatingProject}>
              {creatingProject ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </>
              )}
            </Button>
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
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <Badge
                            className={`
                              ${project.status === "active" ? "bg-sky-100 text-sky-600" : "bg-green-100 text-green-600"}
                            `}
                          >
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 whitespace-nowrap"
                        onClick={() => handleViewProject(project.id)}
                      >
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Collaborators ({project.collaborators.length})
                        </h4>
                        <div className="space-y-2">
                          {project.collaborators.slice(0, 3).map((collaborator, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                                {collaborator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{collaborator.name}</p>
                                <p className="text-xs text-gray-600">{collaborator.role}</p>
                              </div>
                            </div>
                          ))}
                          {project.collaborators.length > 3 && (
                            <div className="text-sm text-sky-600 mt-1">
                              +{project.collaborators.length - 3} more collaborators
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Datasets ({project.datasets.length})</h4>
                        <div className="space-y-2">
                          {project.datasets.map((dataset, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200"
                            >
                              <Database className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{dataset.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Start: {project.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">
                              {project.status === "completed"
                                ? `Completed: ${project.completedDate}`
                                : `Expected End: ${project.endDate}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Last Updated: {project.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{project.progress}%</span>
                      </div>
                      <Progress
                        value={project.progress}
                        className="h-2 bg-gray-200"
                        indicatorClassName={project.status === "completed" ? "bg-green-500" : "bg-sky-500"}
                      />
                    </div>

                    {project.publications && project.publications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Publications</h4>
                        <div className="space-y-2">
                          {project.publications.map((publication, index) => (
                            <div key={index} className="bg-white p-2 rounded border border-gray-200">
                              <p className="text-sm font-medium">{publication.title}</p>
                              <p className="text-xs text-gray-600">
                                {publication.journal} • {publication.date}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

