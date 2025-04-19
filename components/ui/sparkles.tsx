"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface SparklesProps {
  id?: string
  className?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleCount?: number
  particleDensity?: number
  particleColor?: string
  particleOpacity?: number
  speed?: number
}

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleCount,
  particleDensity = 50,
  particleColor = "#FFF",
  particleOpacity = 0.8,
  speed = 1,
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [particles, setParticles] = useState<any[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      setContext(ctx)
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const initParticles = useCallback(() => {
    if (!canvasRef.current || !context) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height

    const calculatedParticleCount = particleCount || Math.floor((width * height) / particleDensity)

    const newParticles = []
    for (let i = 0; i < calculatedParticleCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * (maxSize - minSize) + minSize
      const opacity = Math.random() * particleOpacity
      const speedFactor = Math.random() * speed

      newParticles.push({
        x,
        y,
        size,
        opacity,
        speedFactor,
      })
    }

    setParticles(newParticles)
  }, [context, maxSize, minSize, particleCount, particleDensity, particleOpacity, speed])

  useEffect(() => {
    if (!context) return

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        initParticles()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [context, initParticles])

  useEffect(() => {
    if (!context || particles.length === 0 || !canvasRef.current) return

    const animate = () => {
      if (!context || !canvasRef.current) return

      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      context.fillStyle = background
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      particles.forEach((particle) => {
        context.fillStyle = `rgba(${hexToRgb(particleColor)}, ${particle.opacity})`
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()

        // Update particle position for next frame
        particle.y -= 0.1 * particle.speedFactor

        // Reset particle if it goes off screen
        if (particle.y < -particle.size) {
          particle.y = canvasRef.current!.height + particle.size
          particle.x = Math.random() * canvasRef.current!.width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [context, particles, background, particleColor])

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace("#", "")

    // Convert 3-digit hex to 6-digits
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("")
    }

    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return `${r}, ${g}, ${b}`
  }

  return <canvas id={id} ref={canvasRef} className={cn("h-full w-full", className)} />
}

