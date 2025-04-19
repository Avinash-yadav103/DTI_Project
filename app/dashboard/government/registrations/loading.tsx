import { Skeleton } from "@/component/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-[120px]" />
                </CardTitle>
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="form">Registration Form</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-[180px] mb-1" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

