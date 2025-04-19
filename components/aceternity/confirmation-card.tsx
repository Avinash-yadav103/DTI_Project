"use client"

import { motion } from "framer-motion"
import { CheckCircle, X } from "lucide-react"

interface AadharResponse {
  status: string
  message: string
  care_of: string
  full_address: string
  date_of_birth: string
  email_hash?: string
  gender: string
  name: string
  address?: {
    country: string
    district: string
    house: string
    landmark: string
    pincode: number
    post_office: string
    state: string
    street: string
    subdistrict: string
    vtc: string
  }
  year_of_birth?: number
  mobile_hash?: string
  photo?: string
  share_code?: string
  email?: string
}

interface ConfirmationCardProps {
  userData: AadharResponse
  onConfirm: () => void
  onCancel: () => void
  className?: string
}

export const ConfirmationCard = ({ userData, onConfirm, onCancel, className }: ConfirmationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden max-w-md w-full ${className}`}
    >
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Aadhaar Card Info</h2>
          <button onClick={onCancel} className="text-white/80 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sky-100 text-sm">Please verify that the information fetched from your Aadhar is correct.</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          {userData.photo ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-sky-100">
              <img
                src={`data:image/jpeg;base64,${userData.photo}`}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xl font-bold">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{userData.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {userData.gender === "M" ? "Male" : userData.gender === "F" ? "Female" : userData.gender} •{" "}
              {userData.date_of_birth}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{userData.care_of}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</h4>
            <p className="text-gray-900 dark:text-white">{userData.full_address}</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h4 className="text-sm font-medium text-green-700 dark:text-green-300">Verification Status</h4>
            </div>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              {userData.status === "VALID" ? "Aadhaar details successfully verified" : userData.message}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={onCancel}
          >
            Go Back
          </button>
          <button
            className="flex-1 py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            onClick={onConfirm}
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </motion.div>
  )
}

