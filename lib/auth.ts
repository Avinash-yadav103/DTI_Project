// This is a simplified auth utility for demo purposes
// In a real app, you would use a proper auth solution like NextAuth.js or Clerk

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "patient" | "doctor" | "government" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Mock users for demo
export const mockUsers = {
  patient: {
    id: "patient-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "patient" as UserRole,
    image: "/placeholder.svg?height=40&width=40",
  },
  doctor: {
    id: "doctor-1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@cityhospital.com",
    role: "doctor" as UserRole,
    image: "/placeholder.svg?height=40&width=40",
  },
  government: {
    id: "gov-1",
    name: "Admin User",
    email: "admin@gov.health.org",
    role: "government" as UserRole,
    image: "/placeholder.svg?height=40&width=40",
  },
  student: {
    id: "student-1",
    name: "Alex Johnson",
    email: "alex.johnson@mru.edu",
    role: "student" as UserRole,
    image: "/placeholder.svg?height=40&width=40",
  },
}

// Helper function to check if user is authenticated
export function requireAuth() {
  const { isAuthenticated, user } = useAuth.getState()
  return { isAuthenticated, user }
}

// Helper function to check if user has a specific role
export function hasRole(role: UserRole) {
  const { user } = useAuth.getState()
  return user?.role === role
}

