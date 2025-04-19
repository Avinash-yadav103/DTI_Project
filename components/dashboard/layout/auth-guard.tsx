"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Add a small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // Check if user has required role
      if (requiredRole && user?.role !== requiredRole) {
        router.push("/dashboard")
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, pathname, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-sky-600" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

