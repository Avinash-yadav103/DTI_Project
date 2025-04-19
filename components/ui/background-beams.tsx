"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const beamsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!beamsRef.current) return

      const rect = beamsRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setMousePosition({ x, y })
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={beamsRef} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} {...props}>
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black opacity-60"
        style={{
          transform: `translateX(${mousePosition.x / 20}px) translateY(${mousePosition.y / 20}px)`,
        }}
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-black to-transparent opacity-60"
        style={{
          transform: `translateX(${-mousePosition.x / 20}px) translateY(${-mousePosition.y / 20}px)`,
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 128, 128, 0.15) 0%, transparent 60%)`,
        }}
      />
    </div>
  )
}

