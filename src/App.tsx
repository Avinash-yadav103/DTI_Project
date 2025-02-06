"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import HealthTracking from "./components/HealthTracking"
import MedicationTracker from "./components/MedicationTracker"
import FitnessGraph from "./components/FitnessGraph"
import AppointmentBooking from "./components/AppointmentBooking"
import BedBooking from "./components/BedBooking"
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "healthTracking":
        return <HealthTracking />
      case "medicationTracker":
        return <MedicationTracker />
      case "fitnessGraph":
        return <FitnessGraph />
      case "appointmentBooking":
        return <AppointmentBooking />
      case "bedBooking":
        return <BedBooking />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Header />
      <div className="app-main-content">
        <Sidebar setCurrentPage={setCurrentPage} />
        <div className="app-page-content">{renderPage()}</div>
      </div>
      <Footer />
    </div>
  )
}

export default App

