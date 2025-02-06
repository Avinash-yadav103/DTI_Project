"use client"

import { useState, ChangeEvent, FormEvent } from "react"

interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate: string
}

function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewMedication({ ...newMedication, [name]: value })
  }

  const handleAddMedication = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMedications([...medications, newMedication])
    setNewMedication({ name: "", dosage: "", frequency: "", startDate: "" })
  }

  return (
    <div className="medication-tracker">
      <h1>Medication Tracker</h1>
      <form className="medication-tracker-form" onSubmit={handleAddMedication}>
        <label>
          Medication Name:
          <input type="text" name="name" value={newMedication.name} onChange={handleInputChange} required />
        </label>
        <label>
          Dosage:
          <input type="text" name="dosage" value={newMedication.dosage} onChange={handleInputChange} required />
        </label>
        <label>
          Frequency:
          <input type="text" name="frequency" value={newMedication.frequency} onChange={handleInputChange} required />
        </label>
        <label>
          Start Date:
          <input type="date" name="startDate" value={newMedication.startDate} onChange={handleInputChange} required />
        </label>
        <button type="submit">Add Medication</button>
      </form>
      <div className="medication-list">
        <h2>Current Medications</h2>
        <ul>
          {medications.map((med, index) => (
            <li key={index}>
              {med.name} - {med.dosage} - {med.frequency} (Started: {med.startDate})
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MedicationTracker

