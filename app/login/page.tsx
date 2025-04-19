"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FloatingNavbar } from "@/components/aceternity/floating-navbar"
import { Button } from "@/components/ui/button"
import { Card3D } from "@/components/aceternity/3d-card"
import { Input } from "@/components/aceternity/input"
import { formatAadharNo } from "@/lib/utils"
import { useAuth, mockUsers } from "@/lib/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"
  const { login, isAuthenticated } = useAuth()

  const API_BASE = 'http://10.12.16.45:8881/api'
  
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [userType, setUserType] = useState<"patient" | "doctor" | "government" | "student" | null>("patient")
  const [verificationMethod, setVerificationMethod] = useState<"aadhar" | "mobile" | "doctorId" | "governmentId">(
    "aadhar",
  )
  
  // Form fields
  const [aadharNumber, setAadharNumber] = useState("1234 5678 9012")
  const [mobileNumber, setMobileNumber] = useState("9876543210")
  const [doctorId, setDoctorId] = useState("DOC12345")
  const [governmentId, setGovernmentId] = useState("GOV12345")
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [medicalInfo, setMedicalInfo] = useState(JSON.stringify({
    bloodGroup: "",
    allergies: [],
    chronicConditions: []
  }, null, 2))
  
  // Authentication states
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Form validation errors
  const [aadharError, setAadharError] = useState("")
  const [mobileError, setMobileError] = useState("")
  const [doctorIdError, setDoctorIdError] = useState("")
  const [governmentIdError, setGovernmentIdError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [otpError, setOtpError] = useState("")
  const [nameError, setNameError] = useState("")
  const [ageError, setAgeError] = useState("")
  const [contactError, setContactError] = useState("")
  const [medicalInfoError, setMedicalInfoError] = useState("")
  
  // Registration status
  const [registrationStatus, setRegistrationStatus] = useState<{ message: string; success: boolean; walletAddress?: string } | null>(null)
  const [loginStatus, setLoginStatus] = useState<{ message: string; success: boolean; patientData?: any } | null>(null)

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/#features" },
    { name: "How It Works", link: "/#how-it-works" },
    { name: "About", link: "/#about" },
  ]

  const { setUser } = useUser();

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect])

  // Generate a random 6-digit OTP when the component mounts (for non-patient flows)
  useEffect(() => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(randomOtp)
    console.log("Generated OTP:", randomOtp) // For demo purposes
  }, [])

  // Input handlers
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadharNo(e.target.value.slice(0, 14))
    setAadharNumber(formatted)
    setAadharError("")
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setMobileNumber(value)
    setMobileError("")
  }

  const handleDoctorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDoctorId(e.target.value)
    setDoctorIdError("")
  }

  const handleGovernmentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGovernmentId(e.target.value)
    setGovernmentIdError("")
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
    setOtpError("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError("")
  }
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value)
    setNameError("")
  }
  
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
    setAge(value)
    setAgeError("")
  }
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setContactNumber(value)
    setContactError("")
  }
  
  const handleMedicalInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMedicalInfo(e.target.value)
    setMedicalInfoError("")
  }

  const handleSendOtp = () => {
    // For demo purposes, always allow OTP to be sent
    setOtpSent(true)
    toast.success(`OTP sent! For demo purposes, use: ${generatedOtp}`)
  }

  const handlePatientLogin = async () => {
    setIsLoading(true)
    setLoginStatus(null)

    // Validate inputs
    if (aadharNumber.replace(/\s/g, "").length !== 12) {
      setAadharError("Please enter a valid 12-digit Aadhar number")
      setIsLoading(false)
      return
    }

    if (password.length === 0) {
      setPasswordError("Please enter your password")
      setIsLoading(false)
      return
    }

    try {
      // Make the API call
      const response = await fetch(`http://10.12.16.45:4505/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: aadharNumber.replace(/\s/g, ""),
          password: password,
          role: "patients",
        })
      });

      const result = await response.json();
      console.log("Login result:", result); 
      setUser(result); // For debugging

      if (response.ok) {
        // Login successful
        setLoginStatus({
          message: "Login successful!",
          success: true,
          patientData: result.data
        });
        
        login(mockUsers.patient);
        toast.success("Login successful!");
        router.push(redirect);
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (error: any) {
      // Handle authentication error
      setLoginStatus({
        message: `Error: ${error.message || "Login failed"}`,
        success: false
      });
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }

    setIsLoading(false);
  }

  const handlePatientRegister = async () => {
    setIsLoading(true);
    setRegistrationStatus(null);

    // Validate inputs
    let hasErrors = false;

    if (aadharNumber.replace(/\s/g, "").length !== 12) {
      setAadharError("Please enter a valid 12-digit Aadhar number");
      hasErrors = true;
    }

    if (fullName.trim().length === 0) {
      setNameError("Name is required");
      hasErrors = true;
    }

    if (age.trim().length === 0) {
      setAgeError("Age is required");
      hasErrors = true;
    }

    if (contactNumber.length !== 10) {
      setContactError("Please enter a valid 10-digit contact number");
      hasErrors = true;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasErrors = true;
    }

    try {
      JSON.parse(medicalInfo);
    } catch (e) {
      setMedicalInfoError("Please enter valid JSON for medical info");
      hasErrors = true;
    }

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      // Make the API call
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientID: aadharNumber.replace(/\s/g, ""),
          name: fullName,
          age: parseInt(age),
          contact: contactNumber,
          password: password,
          medicalInfo: JSON.parse(medicalInfo),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Registration successful
        setRegistrationStatus({
          message: "Registration successful!",
          success: true,
          walletAddress: result.walletAddress,
        });
        toast.success("Registration successful!");

        // Redirect to medical-info page
        router.push("/medical-info");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error: any) {
      setRegistrationStatus({
        message: `Error: ${error.message || "Registration failed"}`,
        success: false,
      });
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }

    setIsLoading(false);
  };

  const handleOtherUserLogin = () => {
    setIsLoading(true)

    // For OTP based logins
    if (otp.length === 0) {
      setOtpError("Please enter the OTP")
      setIsLoading(false)
      return
    }

    // Simulate login delay
    setTimeout(() => {
      // Login based on user type
      if (userType === "doctor") {
        login(mockUsers.doctor)
      } else if (userType === "government") {
        login(mockUsers.government)
      } else if (userType === "student") {
        login(mockUsers.student)
      }

      toast.success("Login successful!")

      // Redirect to appropriate dashboard
      router.push(redirect)

      setIsLoading(false)
    }, 1500)
  }

  const renderPatientRegistrationForm = () => (
    <div className="space-y-4">
      {/* <Input
        label="Aadhar Number"
        value={aadharNumber}
        onChange={handleAadharChange}
        placeholder="XXXX XXXX XXXX"
        error={aadharError}
      />
      <Input
        label="Full Name"
        value={fullName}
        onChange={handleNameChange}
        placeholder="Enter your full name"
        error={nameError}
      />
      <Input
        label="Age"
        value={age}
        onChange={handleAgeChange}
        placeholder="Enter your age"
        error={ageError}
        type="number"
      />
      <Input
        label="Contact Number"
        value={contactNumber}
        onChange={handleContactChange}
        placeholder="10-digit contact number"
        error={contactError}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Choose a password"
        error={passwordError}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Medical Information (JSON Format)
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
          value={medicalInfo}
          onChange={handleMedicalInfoChange}
          rows={4}
          placeholder="Enter medical information in JSON format"
        />
        {medicalInfoError && <p className="text-sm text-red-600">{medicalInfoError}</p>}
      </div>
      
      {registrationStatus && (
        <div className={`p-3 rounded-md ${registrationStatus.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
          <p>{registrationStatus.message}</p>
          {registrationStatus.walletAddress && (
            <p className="mt-1 text-sm">Your wallet address: {registrationStatus.walletAddress}</p>
          )}
        </div>
      )}
       */}
      <Button
        className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
        onClick={() => router.push("/register")}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting...
          </>
        ) : (
          "Proceed to Registration"
        )}
      </Button>
    </div>
  )

  const getVerificationMethodForUserType = () => {
    // For register tab
    if (activeTab === "register" && userType === "patient") {
      return renderPatientRegistrationForm();
    }
    
    if (userType === "patient") {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verification Method</h2>
          <div className="flex space-x-4">
            <Button
              variant={verificationMethod === "aadhar" ? "default" : "outline"}
              className={verificationMethod === "aadhar" ? "bg-sky-600 hover:bg-sky-700 flex-1" : "flex-1"}
              onClick={() => setVerificationMethod("aadhar")}
            >
              Aadhar Number
            </Button>
            <Button
              variant={verificationMethod === "mobile" ? "default" : "outline"}
              className={verificationMethod === "mobile" ? "bg-sky-600 hover:bg-sky-700 flex-1" : "flex-1"}
              onClick={() => setVerificationMethod("mobile")}
            >
              Mobile Number
            </Button>
          </div>

          <div className="mt-4">
            {verificationMethod === "aadhar" ? (
              <div className="space-y-4">
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
                  placeholder="Enter your password"
                  error={passwordError}
                />
                
                {loginStatus && (
                  <div className={`p-3 rounded-md ${loginStatus.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
                    <p>{loginStatus.message}</p>
                    {loginStatus.patientData && (
                      <div className="mt-1 text-sm">
                        <p>Welcome, {loginStatus.patientData.name}!</p>
                        <p>Patient ID: {loginStatus.patientData.patientID}</p>
                        <p>Wallet Address: {loginStatus.patientData.walletAddress}</p>
                      </div>
                    )}
                  </div>
                )}
                
                <Button
                  className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
                  onClick={handlePatientLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            ) : (
              <>
                <Input
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="10-digit mobile number"
                  error={mobileError}
                />
                
                <Button
                  className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      )
    } else if (userType === "student") {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verification Method</h2>
          <div className="flex space-x-4">
            <Button
              variant={verificationMethod === "aadhar" ? "default" : "outline"}
              className={verificationMethod === "aadhar" ? "bg-sky-600 hover:bg-sky-700 flex-1" : "flex-1"}
              onClick={() => setVerificationMethod("aadhar")}
            >
              Aadhar Number
            </Button>
            <Button
              variant={verificationMethod === "mobile" ? "default" : "outline"}
              className={verificationMethod === "mobile" ? "bg-sky-600 hover:bg-sky-700 flex-1" : "flex-1"}
              onClick={() => setVerificationMethod("mobile")}
            >
              Mobile Number
            </Button>
          </div>

          <div className="mt-4">
            {verificationMethod === "aadhar" ? (
              <Input
                label="Aadhar Number"
                value={aadharNumber}
                onChange={handleAadharChange}
                placeholder="XXXX XXXX XXXX"
                error={aadharError}
              />
            ) : (
              <Input
                label="Mobile Number"
                value={mobileNumber}
                onChange={handleMobileChange}
                placeholder="10-digit mobile number"
                error={mobileError}
              />
            )}
          </div>
          
          <Button
            className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
      )
    } else if (userType === "doctor") {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Doctor Verification</h2>
          <Input
            label="Doctor ID"
            value={doctorId}
            onChange={handleDoctorIdChange}
            placeholder="Enter your Doctor ID"
            error={doctorIdError}
          />
          
          <Button
            className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
      )
    } else if (userType === "government") {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Government Verification</h2>
          <Input
            label="Government ID"
            value={governmentId}
            onChange={handleGovernmentIdChange}
            placeholder="Enter your Government ID"
            error={governmentIdError}
          />
          
          <Button
            className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
      )
    }

    return null
  }

  const renderOtpVerification = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">OTP Verification</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        A 6-digit OTP has been sent to your{" "}
        {userType === "doctor"
          ? "registered mobile number"
          : userType === "government"
            ? "registered mobile number"
            : verificationMethod === "aadhar"
              ? "Aadhar-linked mobile"
              : "mobile number"}.
      </p>

      <Input label="Enter OTP" value={otp} onChange={handleOtpChange} placeholder="6-digit OTP" error={otpError} />

      <Button
        className="w-full mt-4 z-50 bg-sky-600 hover:bg-sky-700"
        onClick={handleOtherUserLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {activeTab === "login" ? "Logging in..." : "Continuing..."}
          </>
        ) : activeTab === "login" ? (
          "Login"
        ) : (
          "Continue"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Didn&apos;t receive OTP?
        <button className="ml-1 text-sky-600 hover:text-sky-700" onClick={handleSendOtp}>
          Resend
        </button>
      </p>
    </div>
  )

  // For demo purposes, add a direct login button
  const renderDirectLoginButton = () => (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">For demonstration purposes:</p>
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => {
          if (userType === "patient") {
            login(mockUsers.patient);
          } else if (userType === "doctor") {
            login(mockUsers.doctor);
          } else if (userType === "government") {
            login(mockUsers.government);
          } else if (userType === "student") {
            login(mockUsers.student);
          }
          toast.success("Direct login successful!");
          router.push(redirect);
        }} 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Skip Verification & Login Directly"
        )}
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
                    onClick={() => {
                      setUserType("patient")
                      setVerificationMethod("aadhar")
                      setOtpSent(false)
                    }}
                  >
                    Patient
                  </Button>
                  <Button
                    variant={userType === "doctor" ? "default" : "outline"}
                    className={userType === "doctor" ? "bg-sky-600 hover:bg-sky-700" : ""}
                    onClick={() => {
                      setUserType("doctor")
                      setVerificationMethod("doctorId")
                      setOtpSent(false)
                    }}
                  >
                    Doctor
                  </Button>
                  <Button
                    variant={userType === "government" ? "default" : "outline"}
                    className={userType === "government" ? "bg-sky-600 hover:bg-sky-700" : ""}
                    onClick={() => {
                      setUserType("government")
                      setVerificationMethod("governmentId")
                      setOtpSent(false)
                    }}
                  >
                    Admin/Government
                  </Button>
                  <Button
                    variant={userType === "student" ? "default" : "outline"}
                    className={userType === "student" ? "bg-sky-600 hover:bg-sky-700" : ""}
                    onClick={() => {
                      setUserType("student")
                      setVerificationMethod("aadhar")
                      setOtpSent(false)
                    }}
                  >
                    Student
                  </Button>
                </div>
              </div>

              {/* Login/Register Form */}
              <div className="md:w-2/3 space-y-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "login"
                        ? "text-sky-600 border-b-2 border-sky-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => {
                      setActiveTab("login")
                      setOtpSent(false)
                      setRegistrationStatus(null)
                      setLoginStatus(null)
                    }}
                  >
                    Login
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === "register"
                        ? "text-sky-600 border-b-2 border-sky-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                    onClick={() => {
                      setActiveTab("register")
                      setOtpSent(false)
                      setRegistrationStatus(null)
                      setLoginStatus(null)
                    }}
                    disabled={userType === "doctor" || userType === "government"}
                  >
                    Register
                  </button>
                </div>

                {(userType === "doctor" || userType === "government") && activeTab === "register" && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Doctor and Government accounts can only be created by government officials. Please log in if you
                      have an account.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab("login")}>
                      Switch to Login
                    </Button>
                  </div>
                )}

                {userType && !((userType === "doctor" || userType === "government") && activeTab === "register") && (
                  <div className="space-y-6">
                    {/* Show OTP verification if OTP is sent and user is not patient with Aadhar */}
                    {otpSent && !(userType === "patient" && verificationMethod === "aadhar") ? (
                      renderOtpVerification()
                    ) : (
                      // Otherwise show regular verification methods
                      getVerificationMethodForUserType()
                    )}

                    {/* Direct login button for demo purposes */}
                    {activeTab === "login" && renderDirectLoginButton()}
                  </div>
                )}

                {!userType && (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500 dark:text-gray-400">Please select a user type to continue</p>
                  </div>
                )}
              </div>
            </div>
          </Card3D>
        </div>
      </div>
      </main>
  );
}