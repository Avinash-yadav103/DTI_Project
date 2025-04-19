"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StepCardProps {
  step: number
  title: string
  description: string
  isActive?: boolean
  className?: string
}

export const StepCard = ({ step, title, description, isActive = false, className }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative rounded-xl border p-6 transition-all duration-300",
        isActive ? "border-sky-200 bg-sky-50 shadow-sm" : "border-gray-200 bg-white",
        className,
      )}
    >
      <div className="absolute -top-4 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-md">
        {step}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

