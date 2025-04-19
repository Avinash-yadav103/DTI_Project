export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-sky-600 border-gray-200 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading doctor dashboard...</p>
      </div>
    </div>
  )
}

