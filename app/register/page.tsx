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
  const [aadharNumber, setAadharNumber] = useState("")
  const [email, setEmail] = useState("")
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
    status: "",
    message: "",
    care_of: "",
    full_address: "",
    date_of_birth: "",
    email_hash: "",
    gender: "",
    name: "",
    address: {
      country: "",
      district: "",
      house: "",
      landmark: "",
      pincode: 0,
      post_office: "",
      state: "",
      street: "",
      subdistrict: "",
      vtc: "",
    },
    year_of_birth: 0,
    mobile_hash: "",
    photo: "",
    share_code: "",
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
  const API_BASE = process.env.NEXT_PUBLIC_AADHAR_API_URL || "http://localhost:4505"
  const IS_DEV_MODE = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (IS_DEV_MODE) {
      console.log("%c🔧 DEVELOPMENT MODE ACTIVE", "background: #ffcc00; color: #000; font-weight: bold; padding: 4px;");
      console.log("Backend URL:", API_BASE);
      console.log("For testing in dev mode without backend:");
      console.log("1. Use any valid 12-digit Aadhar number");
      console.log("2. Use any password (8+ chars)");
      console.log("3. For OTP, use '123456'");
    }
  }, []);

  const handleSendOtp = () => {
    // Validate Aadhar number
    if (aadharNumber.replace(/\s/g, "").length !== 12) {
      setAadharError("Please enter a valid 12-digit Aadhar number");
      return;
    }

    // Validate password
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Clean Aadhar number without spaces for API call
    const cleanAadharNumber = aadharNumber.replace(/\s/g, "");
    
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 5 second timeout
    
    // Send to correct endpoint with timeout handling
    fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        aadhaarId: cleanAadharNumber, 
        password: password 
      }),
      signal: controller.signal
    })
      .then((res) => res.json())
      .then((res) => {
        clearTimeout(timeoutId);
        console.log("OTP Response:", res);
        if (res.success) {
          setGeneratedOtp(res.reference_id);
          setStep(2);
        } else {
          setAadharError(res.message || "Failed to send OTP. Please try again.");
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error("OTP Error:", err);
        
        if (err.name === 'AbortError' || err.message === 'Failed to fetch') {
          // Backend is unreachable, use development mode fallback
          if (IS_DEV_MODE) {
            console.log("Using development mode fallback");
            // Generate a mock reference ID for testing
            const mockReferenceId = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(mockReferenceId);
            console.log("Dev mode mock reference ID:", mockReferenceId);
            setStep(2);
            setAadharError("");
          } else {
            setAadharError("Unable to connect to verification server. Please check your connection and try again.");
          }
        } else {
          setAadharError("An error occurred while sending OTP. Please try again.");
        }
      })
      .finally(() => setIsLoading(false));
  }

  const handleVerifyOtp = () => {
    if (otp.length === 0) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setOtpError("Invalid OTP format. Please enter a 6-digit numeric code.");
      return;
    }

    setIsLoading(true);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Send OTP verification request to the backend
    fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        otp: otp, 
        reference_id: generatedOtp 
      }),
      signal: controller.signal
    })
      .then((res) => res.json())
      .then((res) => {
        clearTimeout(timeoutId);
        console.log("Verification Response:", res);
        if (res.success) {
          // Update the user data with the response from the server
          setUserData({
            ...userData,
            name: res.name,
            gender: res.gender,
            date_of_birth: res.dob,
            full_address: res.address,
            photo: res.photo,
            status: "VALID",
            message: "Aadhaar Card Verified Successfully"
          });
          setShowConfirmationModal(true);
        } else {
          setOtpError(res.message || "Failed to verify OTP. Please try again.");
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error("Verification Error:", err);
        
        if (err.name === 'AbortError' || err.message === 'Failed to fetch') {
          // Backend is unreachable, use development mode fallback
          if (IS_DEV_MODE) {
            console.log("Using development mode fallback for OTP verification");
            // In development mode, any OTP is valid
            if (otp === "123456" || IS_DEV_MODE) {
              // Mock user data for testing
              setUserData({
                ...userData,
                name: "Test User",
                gender: "M",
                date_of_birth: "01-01-1990",
                full_address: "123 Test Street, Test City, Test State, India",
                photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdQJ+8RYg9AAAAABJRU5ErkJggg==",
                status: "VALID",
                message: "Aadhaar Card Verified Successfully (Dev Mode)"
              });
              setShowConfirmationModal(true);
            } else {
              setOtpError("Invalid OTP. In dev mode, use '123456' or any 6 digits.");
            }
          } else {
            setOtpError("Unable to connect to verification server. Please check your connection and try again.");
          }
        } else {
          setOtpError("An error occurred while verifying OTP. Please try again.");
        }
      })
      .finally(() => setIsLoading(false));
  }

  const handleConfirmRegister = () => {
    setIsLoading(true);
    
    const cleanAadharNumber = aadharNumber.replace(/\s/g, "");
    
    // Call the MongoDB registration endpoint
    fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aadhaarId: cleanAadharNumber,
        password,
        name: userData.name,
        gender: userData.gender,
        dateOfBirth: userData.date_of_birth,
        fullAddress: userData.full_address,
        photo: userData.photo,
        role: userType
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Registration Response:", res);
        if (res.success) {
          // Store user data for the medical info page
          localStorage.setItem(
            "registrationData",
            JSON.stringify({
              aadhaarId: cleanAadharNumber,
              userData,
            })
          );
          
          // Navigate to medical info page
          router.push("/medical-info");
        } else {
          alert(res.message || "Registration failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Registration Error:", err);
        alert("An error occurred during registration. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }

  // For demo purposes, add a direct navigation button
  const renderDirectNavigationButton = () => (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">For demonstration purposes:</p>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => {
          // Simulate successful registration with test data
          localStorage.setItem(
            "registrationData",
            JSON.stringify({
              aadharNumber: "123456789012",
              password: "password123",
              userData: {
                name: "Test User",
                gender: "M",
                date_of_birth: "01-01-1990",
                full_address: "Test Address, India",
              },
            })
          );
          router.push("/medical-info");
        }}
      >
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
            className="max-w-lg"
          />
        </div>
      )}
    </main>
  )
}

