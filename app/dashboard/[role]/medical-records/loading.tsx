import { Skeleton } from "@/components/ui/skeleton"

export default function MedicalRecordsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>

      <div className="grid gap-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/6" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

