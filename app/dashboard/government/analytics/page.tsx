"use client"

import { useState } from "react"
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Building2, 
  Bed, 
  Map, 
  Star, 
  Filter, 
  Download, 
  Users, 
  Heart, 
  Activity, 
  Settings, 
  LogOut, 
  Home,
  User
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"

export default function AnalyticsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stateFilter, setStateFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("year")
  const [hospitalTypeFilter, setHospitalTypeFilter] = useState("all")
  
  // Mock user for development
  const admin = {
    name: "Admin User",
    id: "GOV-1234-5678",
    department: "Health Department",
    email: "admin@gov.health.org",
    photo: "/placeholder.svg?height=40&width=40",
  }

  // Mock data for hospital beds
  const hospitalBedsData = [
    { name: "Delhi", government: 12500, private: 18700, total: 31200 },
    { name: "Maharashtra", government: 18900, private: 23400, total: 42300 },
    { name: "Karnataka", government: 10200, private: 14500, total: 24700 },
    { name: "Tamil Nadu", government: 11800, private: 15900, total: 27700 },
    { name: "Gujarat", government: 9400, private: 12800, total: 22200 },
    { name: "West Bengal", government: 8700, private: 10200, total: 18900 },
  ]

  // Mock data for hospital occupancy over time
  const occupancyData = [
    { month: "Jan", government: 75, private: 68 },
    { month: "Feb", government: 78, private: 72 },
    { month: "Mar", government: 82, private: 76 },
    { month: "Apr", government: 76, private: 73 },
    { month: "May", government: 72, private: 70 },
    { month: "Jun", government: 70, private: 65 },
    { month: "Jul", government: 68, private: 62 },
    { month: "Aug", government: 72, private: 68 },
    { month: "Sep", government: 76, private: 71 },
    { month: "Oct", government: 80, private: 75 },
    { month: "Nov", government: 84, private: 79 },
    { month: "Dec", government: 88, private: 82 },
  ]

  // Mock data for hospital types
  const hospitalTypesData = [
    { name: "General Hospitals", value: 245 },
    { name: "Specialty Hospitals", value: 178 },
    { name: "Teaching Hospitals", value: 87 },
    { name: "Community Health Centers", value: 325 },
    { name: "Primary Health Centers", value: 652 },
  ]

  // Mock data for cancer treatment facilities
  const cancerTreatmentData = [
    { name: "Comprehensive Cancer Centers", value: 42 },
    { name: "Surgical Oncology", value: 145 },
    { name: "Radiation Therapy", value: 128 },
    { name: "Medical Oncology", value: 185 },
    { name: "Pediatric Oncology", value: 68 },
  ]

  // Mock data for top 10 hospitals by rank
  const topHospitalsData = [
    { name: "AIIMS Delhi", ranking: 9.8, beds: 2500, specialty: "Multi-specialty" },
    { name: "CMC Vellore", ranking: 9.6, beds: 2800, specialty: "Multi-specialty" },
    { name: "PGIMER Chandigarh", ranking: 9.5, beds: 1900, specialty: "Multi-specialty" },
    { name: "Tata Memorial", ranking: 9.4, beds: 1200, specialty: "Oncology" },
    { name: "NIMHANS Bangalore", ranking: 9.3, beds: 850, specialty: "Neuroscience" },
    { name: "SGPGI Lucknow", ranking: 9.2, beds: 1500, specialty: "Multi-specialty" },
    { name: "JIPMER Puducherry", ranking: 9.1, beds: 2100, specialty: "Multi-specialty" },
    { name: "Apollo Hospitals", ranking: 9.0, beds: 1800, specialty: "Multi-specialty" },
    { name: "Manipal Hospitals", ranking: 8.9, beds: 1650, specialty: "Multi-specialty" },
    { name: "Medanta", ranking: 8.8, beds: 1350, specialty: "Multi-specialty" },
  ]

  // Mock data for healthcare quality metrics radar chart
  const hospitalQualityData = [
    { subject: "Patient Safety", A: 120, B: 110, fullMark: 150 },
    { subject: "Staff-to-Patient Ratio", A: 98, B: 130, fullMark: 150 },
    { subject: "Patient Satisfaction", A: 86, B: 130, fullMark: 150 },
    { subject: "Treatment Success", A: 99, B: 100, fullMark: 150 },
    { subject: "Infrastructure", A: 85, B: 90, fullMark: 150 },
    { subject: "Technology Adoption", A: 65, B: 85, fullMark: 150 },
  ]

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleExportData = () => {
    toast.success("Exporting analytics data as CSV")
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard/government",
      icon: <Home className="h-4 w-4" />,
    },
    {
      title: "Hospitals",
      href: "/dashboard/government/hospitals",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/government/analytics",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/government/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  const sidebarFooterItems = [
    {
      title: "Settings",
      href: "/dashboard/government/settings",
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
      title="Healthcare Analytics"
      user={admin}
      notifications={2}
      requiredRole="government"
    >
      <div className="mb-6">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Healthcare Analytics Dashboard</CardTitle>
                <CardDescription>Comprehensive data visualization for healthcare infrastructure</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="5year">Last 5 Years</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="infrastructure" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="infrastructure">
                  <Building2 className="h-4 w-4 mr-2" />
                  Infrastructure
                </TabsTrigger>
                <TabsTrigger value="occupancy">
                  <Bed className="h-4 w-4 mr-2" />
                  Bed Capacity
                </TabsTrigger>
                <TabsTrigger value="specialties">
                  <Heart className="h-4 w-4 mr-2" />
                  Specialties
                </TabsTrigger>
                <TabsTrigger value="rankings">
                  <Star className="h-4 w-4 mr-2" />
                  Rankings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="infrastructure">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hospital Beds by State */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Hospital Beds by State</CardTitle>
                      <CardDescription>Distribution of hospital beds across states</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={hospitalBedsData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="government" fill="#0088FE" name="Government Hospitals" />
                            <Bar dataKey="private" fill="#00C49F" name="Private Hospitals" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Hospital Types */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Hospital Types</CardTitle>
                      <CardDescription>Distribution of hospitals by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={hospitalTypesData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {hospitalTypesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} hospitals`, 'Count']} />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="occupancy">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hospital Bed Occupancy Trends */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Bed Occupancy Rate</CardTitle>
                      <CardDescription>Monthly trends in hospital bed occupancy rates (%)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={occupancyData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="government" stroke="#0088FE" name="Government Hospitals" />
                            <Line type="monotone" dataKey="private" stroke="#00C49F" name="Private Hospitals" />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Hospital Quality Metrics */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Healthcare Quality Metrics</CardTitle>
                      <CardDescription>Comparison between public and private hospitals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={hospitalQualityData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} />
                            <Radar name="Government Hospitals" dataKey="A" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                            <Radar name="Private Hospitals" dataKey="B" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="specialties">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cancer Treatment Facilities */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Cancer Treatment Facilities</CardTitle>
                      <CardDescription>Distribution of oncology facilities by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={cancerTreatmentData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {cancerTreatmentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} facilities`, 'Count']} />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Specialty Distribution */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Medical Specialty Distribution</CardTitle>
                      <CardDescription>Number of hospitals by specialty</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            layout="vertical"
                            data={[
                              { name: "Cardiology", count: 175 },
                              { name: "Orthopedics", count: 148 },
                              { name: "Neurology", count: 120 },
                              { name: "Oncology", count: 95 },
                              { name: "Pediatrics", count: 210 },
                              { name: "Gynecology", count: 182 },
                              { name: "Ophthalmology", count: 112 },
                              { name: "Psychiatry", count: 86 },
                            ]}
                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" name="Hospitals" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="rankings">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top 10 Hospitals by Ranking</CardTitle>
                    <CardDescription>Based on infrastructure, patient outcomes, and services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={topHospitalsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                          barSize={30}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end"
                            height={70}
                            interval={0}
                          />
                          <YAxis domain={[8, 10]} />
                          <Tooltip 
                            formatter={(value, name, props) => {
                              return [`${value}${name === 'ranking' ? '/10' : ' beds'}`, 
                                      name === 'ranking' ? 'Rating' : 'Capacity']
                            }}
                          />
                          <Legend />
                          <Bar dataKey="ranking" fill="#0088FE" name="Rating (out of 10)" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Hospital Infrastructure Statistics</CardTitle>
                      <CardDescription>Aggregated metrics by hospital rankings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="text-sm font-medium text-blue-800">Average Beds per Hospital</h3>
                          <p className="text-3xl font-bold text-blue-700 mt-2">
                            {Math.round(topHospitalsData.reduce((acc, h) => acc + h.beds, 0) / topHospitalsData.length)}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">Among top 10 ranked hospitals</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <h3 className="text-sm font-medium text-green-800">Average Rating</h3>
                          <p className="text-3xl font-bold text-green-700 mt-2">
                            {(topHospitalsData.reduce((acc, h) => acc + h.ranking, 0) / topHospitalsData.length).toFixed(1)}/10
                          </p>
                          <p className="text-xs text-green-600 mt-1">Among top 10 ranked hospitals</p>
                        </div>
                        
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <h3 className="text-sm font-medium text-amber-800">Multi-specialty Ratio</h3>
                          <p className="text-3xl font-bold text-amber-700 mt-2">
                            {Math.round((topHospitalsData.filter(h => h.specialty === "Multi-specialty").length / topHospitalsData.length) * 100)}%
                          </p>
                          <p className="text-xs text-amber-600 mt-1">Percentage of multi-specialty hospitals</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <h3 className="text-sm font-medium text-purple-800">Total Bed Capacity</h3>
                          <p className="text-3xl font-bold text-purple-700 mt-2">
                            {topHospitalsData.reduce((acc, h) => acc + h.beds, 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-purple-600 mt-1">Among top 10 ranked hospitals</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Quality vs Size Correlation</CardTitle>
                      <CardDescription>Analysis of hospital bed capacity vs ranking</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={topHospitalsData.sort((a, b) => a.beds - b.beds)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="beds" type="number" domain={['dataMin', 'dataMax']} />
                            <YAxis dataKey="ranking" domain={[8.5, 10]} />
                            <Tooltip formatter={(value, name, props) => {
                              if (name === "ranking") return [`${value}/10`, "Rating"];
                              return [value, props.payload.name];
                            }} />
                            <Legend />
                            <Line type="monotone" dataKey="ranking" stroke="#8884d8" name="Hospital Rating" />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}