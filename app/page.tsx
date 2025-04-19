"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { Environment, useGLTF, PresentationControls } from "@react-three/drei"
import { motion } from "framer-motion"
import { Button } from "@/components/aceternity/button"
import { Spotlight } from "@/components/aceternity/spotlight"
import { AnimatedGradient } from "@/components/aceternity/animated-gradient"
import { TextReveal } from "@/components/aceternity/text-reveal"
import { FloatingNavbar } from "@/components/aceternity/floating-navbar"
import { FeatureCard } from "@/components/aceternity/feature-card"
import { StepCard } from "@/components/aceternity/step-card"
import { ChevronRight, Shield, Users, Database, Lock, Stethoscope, FileText, Fingerprint } from "lucide-react"
import dynamic from "next/dynamic"

// Use dynamic import with no SSR for the chatbot component
const ChatbotPopup = dynamic(() => import("@/components/ChatbotPopup"), { ssr: false })

// Use a simple 3D model for the medical representation
function MedicalModel(props) {
  // Use the duck model which is available by default
  const { scene } = useGLTF("/assets/ste.glb")
  return <primitive object={scene} {...props} />
}

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/#features" },
    { name: "How It Works", link: "/#how-it-works" },
    { name: "About", link: "/#about" },
  ]

  const features = [
    {
      title: "Patient-Centric Control",
      description: "Full control over your electronic health records with secure blockchain technology",
      icon: <Lock className="h-6 w-6" />,
    },
    {
      title: "Seamless Data Sharing",
      description: "Securely share your medical data with healthcare providers with your explicit consent",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Interoperable Systems",
      description: "Bridge disparate healthcare infrastructures for better coordination of care",
      icon: <Database className="h-6 w-6" />,
    },
    {
      title: "Privacy Protection",
      description: "Advanced encryption and blockchain security to protect your sensitive health information",
      icon: <Shield className="h-6 w-6" />,
    },
  ]

  const steps = [
    {
      title: "Register with Aadhar",
      description: "Securely verify your identity using your Aadhar number and OTP verification",
    },
    {
      title: "Add Your Medical Information",
      description: "Input your allergies, medical history, and other important health information",
    },
    {
      title: "Control Access Permissions",
      description: "Decide which doctors, hospitals, or researchers can access your data",
    },
    {
      title: "Secure Data Sharing",
      description: "Your data is securely shared with authorized parties through blockchain technology",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <FloatingNavbar navItems={navItems} />

      {/* Hero Section with 3D Model */}
      <Spotlight className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0.5, 1, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <Suspense fallback={null}>
              <PresentationControls
                global
                rotation={[0.3, -Math.PI / 4, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
              >
                <MedicalModel position={[0, 0.2, 0.2]} scale={3} rotation={[0, Math.PI / 2, 0.2]} />
              </PresentationControls>
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-3xl mx-auto"
          >
            <TextReveal
              text="Secure Healthcare Records "
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            />
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              A patient-centric system that gives you complete control over your electronic health records while
              enabling seamless sharing between healthcare providers.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <Link href="/login">
                <Button
                  variant="pill"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg text-white px-8 py-6 rounded-lg text-lg font-medium"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Get Started
                  <ChevronRight
                    className={`ml-2 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  className="border-sky-200 text-sky-700 hover:bg-sky-50 px-8 py-6 rounded-lg text-lg font-medium"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Spotlight>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <TextReveal text="Key Features" className="text-3xl md:text-4xl font-bold text-gray-900" />
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <AnimatedGradient containerClassName="py-20" gradientColors={["#0ea5e9", "#2563eb", "#4f46e5", "#8b5cf6"]}>
        <section id="how-it-works" className="container mx-auto px-4">
          <div className="text-center mb-16">
            <TextReveal text="How It Works" className="text-3xl md:text-4xl font-bold text-gray-900" />
            <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full opacity-70" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  isActive={activeStep === index + 1}
                  className="cursor-pointer"
                  onClick={() => setActiveStep(index + 1)}
                />
              ))}
            </div>
          </div>
        </section>
      </AnimatedGradient>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <TextReveal text="For Everyone in Healthcare" className="text-3xl md:text-4xl font-bold text-gray-900" />
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-sky-50 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Patients</h3>
              <p className="text-gray-600">
                Take control of your health records and decide who can access your medical information.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-sky-50 p-3 rounded-lg w-fit mb-4">
                <Stethoscope className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Doctors</h3>
              <p className="text-gray-600">
                Access patient records with consent and provide better care with complete medical history.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-sky-50 p-3 rounded-lg w-fit mb-4">
                <FileText className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Researchers</h3>
              <p className="text-gray-600">
                Access anonymized data for research purposes with proper authorization and consent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="bg-sky-50 p-3 rounded-lg w-fit mb-4">
                <Fingerprint className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Government</h3>
              <p className="text-gray-600">
                Oversee healthcare data with transparency while maintaining privacy and security.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
            <TextReveal
              text="Ready to Take Control of Your Health Data?"
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            />
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of patients, doctors, and researchers on our secure blockchain platform.
            </p>
            <Link href="/login">
              <Button
                variant="pill"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:shadow-lg text-white px-8 py-6 rounded-lg text-lg font-medium"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold text-sky-400">MediChain</h3>
              <p className="text-gray-400 mt-1">Secure blockchain healthcare system</p>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-300 hover:text-sky-400 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MediChain. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add the ChatbotPopup component here */}
      <ChatbotPopup />
    </div>
  )
}

