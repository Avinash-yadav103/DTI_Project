import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/component/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs"
import { HospitalTable } from "./components/hospital-table"
import { HospitalTypeDistribution } from "./components/hospital-type-distribution"
import { HospitalMap } from "./components/hospital-map"
import { HospitalCapacity } from "./components/hospital-capacity"

export default function HospitalsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">City Hospitals</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">65.6% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rural Hospitals</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">44</div>
            <p className="text-xs text-muted-foreground">34.4% of total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Hospitals</TabsTrigger>
          <TabsTrigger value="city">City Hospitals</TabsTrigger>
          <TabsTrigger value="rural">Rural Hospitals</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Registered Hospitals</CardTitle>
              <CardDescription>Complete list of all hospitals registered in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <HospitalTable />
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Type Distribution</CardTitle>
                <CardDescription>Distribution of hospitals by type</CardDescription>
              </CardHeader>
              <CardContent>
                <HospitalTypeDistribution />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Hospital Capacity</CardTitle>
                <CardDescription>Bed capacity by hospital type</CardDescription>
              </CardHeader>
              <CardContent>
                <HospitalCapacity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="city" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>City Hospitals</CardTitle>
              <CardDescription>List of all city hospitals registered in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <HospitalTable filter="city" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rural Hospitals</CardTitle>
              <CardDescription>List of all rural hospitals registered in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <HospitalTable filter="rural" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Locations</CardTitle>
              <CardDescription>Geographic distribution of hospitals across the country</CardDescription>
            </CardHeader>
            <CardContent>
              <HospitalMap />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

