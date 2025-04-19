"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function DashboardRedirect() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Add a small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Redirect based on user role
      if (user?.role === "patient") {
        router.push("/dashboard/patient")
      } else if (user?.role === "doctor") {
        router.push("/dashboard/doctor")
      } else if (user?.role === "government") {
        router.push("/dashboard/government")
      } else if (user?.role === "student") {
        router.push("/dashboard/student")
      } else {
        // Fallback if role is not recognized
        router.push("/login")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-sky-600" />
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}

