"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export const Card3D = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [mouseLeaveDelay, setMouseLeaveDelay] = useState<NodeJS.Timeout | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const { left, top } = ref.current.getBoundingClientRect()
      const newMouseX = e.clientX - left
      const newMouseY = e.clientY - top
      setMouseX(newMouseX)
      setMouseY(newMouseY)
    }
  }

  const handleMouseEnter = () => {
    if (mouseLeaveDelay) {
      clearTimeout(mouseLeaveDelay)
      setMouseLeaveDelay(null)
    }
  }

  const handleMouseLeave = () => {
    const delay = setTimeout(() => {
      setMouseX(width / 2)
      setMouseY(height / 2)
    }, 100)
    setMouseLeaveDelay(delay)
  }

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
      setHeight(ref.current.offsetHeight)
      setMouseX(ref.current.offsetWidth / 2)
      setMouseY(ref.current.offsetHeight / 2)
    }
  }, [])

  const rotateX = mouseY !== 0 ? ((mouseY - height / 2) / height) * 20 : 0
  const rotateY = mouseX !== 0 ? ((mouseX - width / 2) / width) * -20 : 0

  return (
    <div
      className={`perspective-1000 ${containerClassName}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <motion.div
        className={`preserve-3d ${className}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: mouseLeaveDelay ? "all 0.5s ease" : "none",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

