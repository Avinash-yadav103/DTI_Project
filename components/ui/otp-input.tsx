"use client"

import React, { useState, useRef, useEffect } from "react"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  numInputs: number
  renderInput: (props: any) => React.ReactNode
  containerStyle?: string
  inputStyle?: string
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  numInputs,
  renderInput,
  containerStyle,
  inputStyle,
}) => {
  const [activeInput, setActiveInput] = useState(0)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const getOTPValue = () => (value ? value.toString().split("") : [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value
    if (val === "") return

    const newValue = getOTPValue()
    const targetValue = val.slice(-1)

    newValue[index] = targetValue

    onChange(newValue.join(""))

    if (index < numInputs - 1) {
      setActiveInput(index + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const prevIndex = index - 1
    const nextIndex = index + 1
    const isBackspace = e.key === "Backspace"

    if (isBackspace && !getOTPValue()[index] && prevIndex >= 0) {
      setActiveInput(prevIndex)
    } else if (e.key === "ArrowLeft" && prevIndex >= 0) {
      e.preventDefault()
      setActiveInput(prevIndex)
    } else if (e.key === "ArrowRight" && nextIndex < numInputs) {
      e.preventDefault()
      setActiveInput(nextIndex)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, numInputs)

    if (pastedData) {
      let nextActiveInput = 0
      const updatedValue = Array(numInputs).fill("")

      for (let i = 0; i < pastedData.length; i++) {
        updatedValue[i] = pastedData[i]
        nextActiveInput = i + 1
      }

      onChange(updatedValue.join(""))
      setActiveInput(nextActiveInput >= numInputs ? numInputs - 1 : nextActiveInput)
    }
  }

  useEffect(() => {
    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput]?.focus()
    }
  }, [activeInput])

  return (
    <div className={containerStyle}>
      {Array(numInputs)
        .fill("")
        .map((_, index) => {
          const otp = getOTPValue()
          return (
            <React.Fragment key={index}>
              {renderInput({
                ref: (input: HTMLInputElement) => (inputRefs.current[index] = input),
                value: otp[index] || "",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index),
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index),
                onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e),
                className: inputStyle,
                maxLength: 1,
                type: "text",
                inputMode: "numeric",
                pattern: "[0-9]*",
                autoComplete: "one-time-code",
              })}
            </React.Fragment>
          )
        })}
    </div>
  )
}

