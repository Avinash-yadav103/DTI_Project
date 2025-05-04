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

// Age calculation function (from utils.js)
export function calculateAge(dateOfBirth: string | undefined | null): number | null {
  if (!dateOfBirth) return null;
  
  // Parse the date of birth
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  
  // Calculate the difference in years
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

