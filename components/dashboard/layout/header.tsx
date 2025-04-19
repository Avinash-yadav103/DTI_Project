"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, Settings, LogOut, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

interface HeaderProps {
  title: string
  user: {
    name: string
    email: string
    image?: string
  }
  notifications?: number
}

export function Header({ title, user, notifications = 0 }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
    setShowUserMenu(false)
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>

          <div className="hidden md:flex relative ml-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search..." className="pl-9 w-64 bg-gray-50 border-gray-200 focus:bg-white" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-sky-600 text-[10px] flex items-center justify-center text-white">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </Button>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-1 rounded-full"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-sky-100 text-sky-700">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
            </Button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20"
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

