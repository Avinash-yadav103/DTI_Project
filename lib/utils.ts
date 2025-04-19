import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAadharNo(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "")

  // Format with spaces after every 4 digits
  const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")

  return formatted
}

