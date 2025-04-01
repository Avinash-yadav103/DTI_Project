"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { VaccinationPage } from "@/components/vaccination"
import { LayoutDashboard, Calendar, Activity, FileText, User, Syringe, PillIcon, } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Health Metrics",
    href: "/health-metrics",
    icon: Activity,
  },
  {
    title: "Medications",
    href: "/medications",
    icon: PillIcon,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Vaccination",
    href: "/vaccination",
    icon: Syringe,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
