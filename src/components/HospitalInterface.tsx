"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Phone, Mail, MapPin, AlertCircle } from "lucide-react"
import '../assets/css/hospital-frontend.css'

interface Hospital {
  name: string
  bedsAvailable: number
  email: string
  contact: string
  address: string
  emergencyServices: boolean
}

const hospitals: Hospital[] = [
  {
    name: "Max Super Specialty Hospital",
    bedsAvailable: 170,
    email: "contact@maxhealthcare.com",
    contact: "+911126599999",
    address: "1 2, Press Enclave Marg, Saket Institutional Area, Saket, New Delhi, Delhi 110017",
    emergencyServices: false,
  },
  {
    name: "Fortis Escorts Heart Institute",
    bedsAvailable: 321,
    email: "info@fortishealthcare.com",
    contact: "+911147135000",
    address: "Okhla Road, New Delhi, Delhi 110025, India",
    emergencyServices: false,
  },
  {
    name: "Apollo Hospital",
    bedsAvailable: 201,
    email: "contact@apollohospitals.com",
    contact: "+911126925858",
    address: "Mathura Road, Sarita Vihar, New Delhi, Delhi 110076, India",
    emergencyServices: false,
  },
  {
    name: "Sir Ganga Ram Hospital",
    bedsAvailable: 180,
    email: "info@sgrh.com",
    contact: "+911125750000",
    address: "Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi, Delhi 110060, India",
    emergencyServices: false,
  },
  {
    name: "BLK Super Specialty Hospital",
    bedsAvailable: 130,
    email: "contact@blkhospital.com",
    contact: "+911130403040",
    address: "Pusa Road, New Delhi, Delhi 110005, India",
    emergencyServices: false,
  },
]

export default function HospitalInterface() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            <span className="text-xl font-bold">CareFolio</span>
          </div>
          <nav className="flex items-center gap-6">
            {/* <a href="#" className="text-sm font-medium hover:text-primary">
              Contact Us
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Sign Up / Sign In
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
              Medication
            </a> */}
            <Button variant="destructive" className="animate-pulse">
              EMERGENCY
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">Hospitals</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{hospital.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="font-medium">Beds Available: {hospital.bedsAvailable}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{hospital.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{hospital.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span>Emergency Services: {hospital.emergencyServices ? "Yes" : "No"}</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100">All doctors</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

