"use client"

import { useState } from "react"

function BedBooking() {
  const [bedBooking, setBedBooking] = useState({
    patientName: "",
    hospitalName: "",
    roomType: "",
    admissionDate: "",
    expectedStayDuration: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBedBooking({ ...bedBooking, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically send the bed booking data to a server
    console.log("Bed booked:", bedBooking)
    // Reset form or show success message
  }

  return (
    <div className="bed-booking">
      <h1>Book a Hospital Bed</h1>
      <form className="bed-booking-form" onSubmit={handleSubmit}>
        <label>
          Patient Name:
          <input type="text" name="patientName" value={bedBooking.patientName} onChange={handleInputChange} required />
        </label>
        <label>
          Hospital Name:
          <input
            type="text"
            name="hospitalName"
            value={bedBooking.hospitalName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Room Type:
          <select name="roomType" value={bedBooking.roomType} onChange={handleInputChange} required>
            <option value="">Select Room Type</option>
            <option value="general">General Ward</option>
            <option value="semi-private">Semi-Private Room</option>
            <option value="private">Private Room</option>
            <option value="icu">ICU</option>
          </select>
        </label>
        <label>
          Admission Date:
          <input
            type="date"
            name="admissionDate"
            value={bedBooking.admissionDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Expected Stay Duration (days):
          <input
            type="number"
            name="expectedStayDuration"
            value={bedBooking.expectedStayDuration}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Book Bed</button>
      </form>
    </div>
  )
}

export default BedBooking

