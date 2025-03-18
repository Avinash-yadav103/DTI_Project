export function PatientInfo() {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-blue-100 p-4 rounded-full">
        <div className="h-10 w-10 flex items-center justify-center text-blue-600">
          <span className="sr-only">Patient Avatar</span>
          AM
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Alex Morgan</h1>
        <p className="text-sm text-muted-foreground">39 years • Male • O+</p>
        <p className="text-sm max-w-2xl">
          Welcome to your medical portfolio. Here you can view your complete medical history, track your health metrics,
          and generate comprehensive reports to share with your healthcare providers.
        </p>
      </div>
    </div>
  )
}

