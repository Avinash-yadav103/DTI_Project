import { Skeleton } from "@/component/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-[180px] mb-1" />
                </CardTitle>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent className="pl-2">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

