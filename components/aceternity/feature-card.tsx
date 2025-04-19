"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  className?: string
}

export const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300",
        isHovered && "shadow-md border-sky-100 scale-[1.02]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600">{icon}</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div
        className={cn(
          "absolute inset-0 z-0 bg-gradient-to-br from-sky-50 via-transparent to-transparent opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100",
        )}
      />
    </motion.div>
  )
}

