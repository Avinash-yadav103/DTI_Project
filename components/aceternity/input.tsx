import React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  description?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, description, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {description && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

