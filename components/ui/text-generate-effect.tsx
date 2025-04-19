"use client"

import { useEffect, useState } from "react"

export const TextGenerateEffect = ({ words }: { words: string }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prevText) => prevText + words[currentIndex])
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, 30) // Adjust speed as needed

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, words])

  return <>{displayedText}</>
}

