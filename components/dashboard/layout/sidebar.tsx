"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarProps {
  items: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
  footerItems?: {
    title: string
    href: string
    icon: React.ReactNode
    onClick?: () => void
  }[]
  logo?: React.ReactNode
  title?: string
}

export function Sidebar({ items, footerItems, logo, title }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[250px]",
          isMobile && (mobileOpen ? "translate-x-0" : "-translate-x-full"),
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 overflow-hidden">
            {logo || (
              <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                CH
              </div>
            )}
            {!collapsed && title && <h1 className="text-lg font-bold text-sky-700 truncate">{title}</h1>}
          </div>
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-sky-50 text-sky-700"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        {footerItems && (
          <div className="border-t border-gray-200 py-4">
            <nav className="space-y-1 px-2">
              {footerItems.map((item) =>
                item.onClick ? (
                  <button
                    key={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left",
                      pathname === item.href ? "bg-sky-50 text-sky-700" : "text-gray-700 hover:bg-gray-100",
                    )}
                    onClick={() => {
                      if (isMobile) setMobileOpen(false)
                      item.onClick?.()
                    }}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href ? "bg-sky-50 text-sky-700" : "text-gray-700 hover:bg-gray-100",
                    )}
                    onClick={() => isMobile && setMobileOpen(false)}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                ),
              )}
            </nav>
          </div>
        )}
      </div>
    </>
  )
}

