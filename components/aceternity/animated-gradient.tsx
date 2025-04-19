"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientProps {
  className?: string
  containerClassName?: string
  children?: React.ReactNode
  gradientColors?: string[]
}

export const AnimatedGradient = ({
  className,
  containerClassName,
  children,
  gradientColors = ["#0ea5e9", "#2563eb", "#4f46e5", "#8b5cf6"],
}: AnimatedGradientProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let hue = 0

    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    const createGradient = (hue: number) => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradientColors.forEach((_, index) => {
        const color = `hsl(${(hue + index * 60) % 360}, 80%, 60%)`
        gradient.addColorStop(index / (gradientColors.length - 1), color)
      })
      return gradient
    }

    const render = () => {
      hue = (hue + 0.2) % 360
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = createGradient(hue)
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      animationFrameId = requestAnimationFrame(render)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    render()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [gradientColors])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
      <canvas ref={canvasRef} className={cn("absolute inset-0 w-full h-full object-cover opacity-20", className)} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

