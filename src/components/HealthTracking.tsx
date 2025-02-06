"use client"

import { useState } from "react"

function HealthTracking() {
  const [healthData, setHealthData] = useState({
    height: "",
    weight: "",
    bloodPressure: "",
    heartRate: "",
    bloodSugar: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setHealthData({ ...healthData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the data to a server
    console.log("Health data submitted:", healthData)
    // Reset form or show success message
  }

  return (
    <div className="health-tracking">
      <h1>Health Tracking</h1>
      <form className="health-tracking-form" onSubmit={handleSubmit}>
        <label>
          Height (cm):
          <input type="number" name="height" value={healthData.height} onChange={handleInputChange} />
        </label>
        <label>
          Weight (kg):
          <input type="number" name="weight" value={healthData.weight} onChange={handleInputChange} />
        </label>
        <label>
          Blood Pressure:
          <input type="text" name="bloodPressure" value={healthData.bloodPressure} onChange={handleInputChange} />
        </label>
        <label>
          Heart Rate (bpm):
          <input type="number" name="heartRate" value={healthData.heartRate} onChange={handleInputChange} />
        </label>
        <label>
          Blood Sugar:
          <input type="text" name="bloodSugar" value={healthData.bloodSugar} onChange={handleInputChange} />
        </label>
        <button type="submit">Save Health Data</button>
      </form>
    </div>
  )
}

export default HealthTracking

