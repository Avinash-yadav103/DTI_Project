"use client"

import type React from "react"
import { useState } from "react"
import { AuthGuard } from "@/components/dashboard/layout/auth-guard"
import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { Header } from "@/components/dashboard/layout/header"
import { SettingsModal } from "@/components/settings-modal"
import { SOSButton } from "@/components/emergency/sos-button"
import { NotificationsPopup } from "@/components/dashboard/notifications-popup"
import type { UserRole } from "@/lib/auth"
import { format } from "date-fns"

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebarItems: {
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
  title: string
  user: {
    name: string
    email: string
    image?: string
  }
  notifications?: number
  requiredRole?: UserRole
  accessRequests?: any[]
  recordUpdates?: any[]
  systemNotifications?: any[]
  onApproveAccess?: () => void
  onRejectAccess?: () => void
  onViewRecord?: () => void
  onMarkAllNotificationsRead?: () => void
  onViewAllNotifications?: () => void
}

export function DashboardLayout({
  children,
  sidebarItems,
  footerItems,
  title,
  user,
  notifications,
  requiredRole,
  accessRequests = [],
  recordUpdates = [],
  systemNotifications = [],
  onApproveAccess,
  onRejectAccess,
  onViewRecord,
  onMarkAllNotificationsRead,
  onViewAllNotifications
}: DashboardLayoutProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  // Find the settings item in the footer items and modify its onClick
  const updatedFooterItems = footerItems?.map((item) => {
    if (item.title === "Settings") {
      return {
        ...item,
        onClick: () => setShowSettingsModal(true),
      }
    }
    return item
  })

  return (
    <AuthGuard requiredRole={requiredRole}>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          items={sidebarItems}
          footerItems={updatedFooterItems}
          title="Charak"
          logo={
            <div className="h-8 w-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold">
              CH
            </div>
          }
        />
        <div className="md:ml-[250px] p-4 pt-[80px]">
          <Header title={title} user={user} notifications={notifications} />
          <div className="flex items-center gap-4">
            <NotificationsPopup
              notificationCount={notifications}
              accessRequests={accessRequests}
              recordUpdates={recordUpdates}
              systemNotifications={systemNotifications}
              onApproveAccess={onApproveAccess}
              onRejectAccess={onRejectAccess}
              onViewRecord={onViewRecord}
              onMarkAllRead={onMarkAllNotificationsRead}
              onViewAll={onViewAllNotifications}
            />
          </div>
          <main className="mt-6">{children}</main>
          {/* Add SOS button only for patient role */}
          {user && requiredRole === "patient" && (
            <SOSButton user={user} />
          )}
        </div>
        <SettingsModal open={showSettingsModal} onOpenChange={setShowSettingsModal} />
      </div>
    </AuthGuard>
  )
}

