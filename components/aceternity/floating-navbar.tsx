"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  link: string
}

interface FloatingNavbarProps {
  navItems: NavItem[]
  className?: string
}

export const FloatingNavbar = ({ navItems, className }: FloatingNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("fixed top-4 inset-x-0 mx-auto z-50 w-full max-w-5xl px-4", className)}
    >
      <div
        className={cn(
          "flex items-center justify-between rounded-full px-4 py-2 transition-all duration-300",
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-white/50 backdrop-blur-sm",
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
            MC
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
            Charak
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="relative px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              onMouseEnter={() => setActiveItem(item.name)}
              onMouseLeave={() => setActiveItem(null)}
            >
              {item.name}
              {activeItem === item.name && (
                <motion.div
                  layoutId="navbar-active-item"
                  className="absolute inset-0 rounded-full bg-gray-100"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
          <div className="h-8 border-l border-gray-300 mx-2" />
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-medium hover:shadow-md transition-all"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 rounded-xl bg-white shadow-lg overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2" />
              <Link
                href="/login"
                className="mx-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

