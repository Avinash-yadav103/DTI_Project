"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  children?: React.ReactNode
}

export const Spotlight = ({ className, children }: SpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !containerRef.current) return

    const handleMouseMove = (event: MouseEvent) => {
      const { left, top, width, height } = containerRef.current!.getBoundingClientRect()
      mouseX.current = event.clientX - left
      mouseY.current = event.clientY - top

      const spotlightEl = containerRef.current!.querySelector(".spotlight") as HTMLElement
      if (spotlightEl) {
        spotlightEl.style.background = `radial-gradient(600px circle at ${mouseX.current}px ${mouseY.current}px, rgba(120, 180, 255, 0.15), transparent 40%)`
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMounted])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div className="spotlight absolute inset-0 z-10 transition-all duration-300 ease-out" />
      {children}
    </div>
  )
}

