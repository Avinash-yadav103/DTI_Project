"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FloatingNavbar } from "@/components/aceternity/floating-navbar"
import { Button } from "@/components/aceternity/button"
import { Input } from "@/components/aceternity/input"
import { Card3D } from "@/components/aceternity/3d-card"
import { ConfirmationCard } from "@/components/aceternity/confirmation-card"
import { formatAadharNo } from "@/lib/utils"

type UserType = "patient" | "student"

interface AadharResponse {
  status: string
  message: string
  care_of: string
  full_address: string
  date_of_birth: string
  email_hash: string
  gender: string
  name: string
  address: {
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
  year_of_birth: number
  mobile_hash: string
  photo: string
  share_code: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>("patient")
  const [aadharNumber, setAadharNumber] = useState("1234 5678 9012")
  const [email, setEmail] = useState("user@example.com")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)
  const [aadharError, setAadharError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [otpError, setOtpError] = useState("")
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Add password fields and state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/#features" },
    { name: "How It Works", link: "/#how-it-works" },
    { name: "About", link: "/#about" },
  ]

  // Mock Aadhar API response data
  const [userData, setUserData] = useState<AadharResponse>({
    status: "VALID",
    message: "Aadhaar Card Exists",
    care_of: "C/O Ajay Kumar",
    full_address:
      "Flat No-154, Plot No-08, Chandanwari Appartment, ., Near Panchshil Appartement, Dwarka Sector-10, Delhi Cantonment, South West Delhi, District Court Complex Dwarka, Delhi, India, 110075",
    date_of_birth: "10-02-2005",
    email_hash: "0efffb30cfd80d561f00f8e5a3e6f3c8eec453255f707d3711510b40272e24ce",
    gender: "M",
    name: "Anubhav Verma",
    address: {
      "@entity": "in.co.sandbox.kyc.aadhaar.okyc.address",
      country: "India",
      district: "South West Delhi",
      house: "Flat No-154, Plot No-08, Chandanwari Appartment",
      landmark: "Near Panchshil Appartement",
      pincode: 110075,
      post_office: "",
      state: "Delhi",
      street: ".",
      subdistrict: "Delhi Cantonment",
      vtc: "District Court Complex Dwarka",
    },
    year_of_birth: 2005,
    mobile_hash: "9fd5b25c2e16a9d39e55a8ebe34abcf1f021ee0246ce704a637128cace0b2b60",
    // Using a placeholder for the photo to avoid encoding issues
    photo: "base64EncodedPhotoString",
    share_code: "2345",
  })

  // Generate a random 6-digit OTP when the component mounts
  useEffect(() => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(randomOtp)
    console.log("Generated OTP:", randomOtp) // For demo purposes
  }, [])

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadharNo(e.target.value.slice(0, 14))
    setAadharNumber(formatted)
    setAadharError("")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError("")
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    setOtpError("")
  }

  // Add password change handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError("")
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setConfirmPasswordError("")
  }
  const handleSendOtp = () => {
    // Validate Aadhar number
    if (aadharNumber.replace(/\s/g, "").length !== 12) {
      setAadharError("Please enter a valid 12-digit Aadhar number")
      return
    }

    // Validate password
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return
    }

    setIsLoading(true)

    // Simulate API call to fetch Aadhar data
    const aadharNumberMain = aadharNumber.replace(/\s/g, "") // Remove spaces for API call
    console.log("Sending Aadhar number:", aadharNumberMain);

    fetch("http://10.12.16.45:4505/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aadharNumberMain, password }), // Send Aadhar number and password to the backend
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          setGeneratedOtp(res.reference_id); // Save the reference ID from the response
          setStep(2); // Move to the OTP verification step
        } else {
          setAadharError("Failed to send OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err);
        setAadharError("An error occurred while sending OTP. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }

  const handleVerifyOtp = () => {
    if (otp.length === 0) {
      setOtpError("Please enter the OTP")
      return
    }

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setOtpError("Invalid OTP format. Please enter a 6-digit numeric code.")
      return
    }

    setIsLoading(true)

    // Send OTP verification request to the backend
    fetch("http://10.12.16.45:4505/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, reference_id: generatedOtp }), // Use the reference ID from handleSendOtp
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          setUserData(res.data); // Update userData with the response data
          setShowConfirmationModal(true);
        } else {
          setOtpError(res.message || "Failed to verify OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error(err)
        setOtpError("An error occurred while verifying OTP. Please try again.")
      })
      .finally(() => setIsLoading(false))
  }

  const handleConfirmRegister = () => {
    // Store user data in localStorage to use in medical-info page
    localStorage.setItem(
      "registrationData",
      JSON.stringify({
        aadharNumber: aadharNumber.replace(/\s/g, ""),
        password,
        userData,
      }),
    )

    // Navigate to medical info page
    router.push("/medical-info")
  }

  // For demo purposes, add a direct navigation button
  const renderDirectNavigationButton = () => (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">For demonstration purposes:</p>
      <Button variant="outline" className="w-full" onClick={() => router.push("/medical-info")}>
        Skip Verification & Continue
      </Button>
    </div>
  )

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <FloatingNavbar navItems={navItems} />

      <div className="flex-grow flex items-center justify-center p-4 mt-16">
        <div className="w-full max-w-4xl">
          <Card3D className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8">
              {/* User Type Selection - Always visible */}
              <div className="md:w-1/3 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select User Type</h2>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant={userType === "patient" ? "default" : "outline"}
                    className={userType === "patient" ? "bg-sky-600 hover:bg-sky-700" : ""}
                    onClick={() => setUserType("patient")}
                  >
                    Patient
                  </Button>
                  <Button variant="outline" className="opacity-50 cursor-not-allowed" disabled>
                    Doctor (Gov Only)
                  </Button>
                  <Button variant="outline" className="opacity-50 cursor-not-allowed" disabled>
                    Government (Gov Only)
                  </Button>
                  <Button
                    variant={userType === "student" ? "default" : "outline"}
                    className={userType === "student" ? "bg-sky-600 hover:bg-sky-700" : ""}
                    onClick={() => setUserType("student")}
                  >
                    Student
                  </Button>
                </div>
              </div>

              {/* Registration Form */}
              <div className="md:w-2/3 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>

                {/* Step 1: User Details */}
                {step === 1 && (
                  <div className="space-y-6">
                    <Input
                      label="Aadhar Number"
                      value={aadharNumber}
                      onChange={handleAadharChange}
                      placeholder="XXXX XXXX XXXX"
                      error={aadharError}
                    />

                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Create a password"
                      error={passwordError}
                      description="Must be at least 8 characters"
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Confirm your password"
                      error={confirmPasswordError}
                    />

                    <Button
                      variant="pill"
                      className="w-full bg-sky-600 hover:bg-sky-700"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </Button>

                    {renderDirectNavigationButton()}
                  </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      A 6-digit verification code has been sent to your{" "}
                      {email ? "email" : "Aadhar-linked mobile number"}.
                    </p>

                    <Input
                      label="Verification Code"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="6-digit code"
                      error={otpError}
                    />

                    <Button
                      variant="pill"
                      className="w-full bg-sky-600 hover:bg-sky-700"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify & Continue"}
                    </Button>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Didn&apos;t receive code?
                      <button className="ml-1 text-sky-600 hover:text-sky-700" onClick={handleSendOtp}>
                        Resend
                      </button>
                    </p>

                    <button
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setStep(1)}
                    >
                      Go Back
                    </button>

                    {renderDirectNavigationButton()}
                  </div>
                )}
              </div>
            </div>
          </Card3D>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ConfirmationCard
            userData={userData}
            onConfirm={handleConfirmRegister}
            onCancel={() => setShowConfirmationModal(false)}
          />
        </div>
      )}
    </main>
  )
}

