export default function MedicalRecordsLoading() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-8 w-64 bg-indigo-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-indigo-100 rounded"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-64 bg-indigo-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-indigo-300 rounded-lg"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="bg-white/80 rounded-xl p-4 h-96"></div>
            <div className="bg-white/80 rounded-xl p-4 h-48"></div>
          </div>

          {/* Main content skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 rounded-xl overflow-hidden">
              <div className="p-4 bg-indigo-50/80 border-b border-indigo-100">
                <div className="h-6 w-48 bg-indigo-200 rounded"></div>
              </div>
              <div className="p-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="border-b py-4">
                      <div className="grid grid-cols-7 gap-4">
                        <div className="h-6 bg-indigo-100 rounded"></div>
                        <div className="h-6 bg-indigo-100 rounded"></div>
                        <div className="h-6 bg-indigo-100 rounded"></div>
                        <div className="h-6 bg-indigo-100 rounded"></div>
                        <div className="h-6 bg-indigo-100 rounded"></div>
                        <div className="h-6 bg-indigo-100 rounded"></div>
                        <div className="h-6 bg-indigo-100 rounded"></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

