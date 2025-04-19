import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demographics - Government Dashboard",
  description: "Demographic data analysis for the healthcare system",
}

export default function DemographicsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Demographics</h2>
      </div>
      {children}
    </div>
  )
}

