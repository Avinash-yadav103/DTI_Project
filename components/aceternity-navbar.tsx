"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function AceternityNavbar() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
            MediChain
          </span>
        </Link>

        <nav className="hidden md:flex gap-4 sm:gap-6">
          <NavItem href="/" setActive={setActive} active={active} item="Home" />
          <NavItem href="/about" setActive={setActive} active={active} item="About" />
          <NavItem href="/services" setActive={setActive} active={active} item="Services" />
          <NavItem href="/contact" setActive={setActive} active={active} item="Contact" />
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Login
          </Link>
          <button className="block md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  href,
  setActive,
  active,
  item,
}: {
  href: string
  setActive: (item: string | null) => void
  active: string | null
  item: string
}) {
  return (
    <Link
      href={href}
      onMouseEnter={() => setActive(item)}
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors",
      )}
    >
      <span>{item}</span>
      {active === item && (
        <motion.div
          layoutId="navbar-active-item"
          className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600"
          style={{ borderRadius: 2 }}
          transition={{ type: "spring", bounce: 0.25, stiffness: 130, damping: 15 }}
        />
      )}
    </Link>
  )
}

