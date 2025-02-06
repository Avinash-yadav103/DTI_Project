import React, { useState } from "react";
import "../assets/css/AppointmentBooking.css"; // Import CSS

// Define TypeScript interface for appointment data
interface Appointment {
  name: string;
  email: string;
  date: string;
  time: string;
  doctor: string;
}

// Doctor options
const doctors: string[] = ["Dr. John Doe", "Dr. Emily Smith", "Dr. Alex Brown"];

const AppointmentBooking: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment>({
    name: "",
    email: "",
    date: "",
    time: "",
    doctor: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!appointment.name || !appointment.email || !appointment.date || !appointment.time || !appointment.doctor) {
      alert("Please fill in all fields!");
      return;
    }

    setSuccessMessage(`✅ Appointment booked with ${appointment.doctor} on ${appointment.date} at ${appointment.time}`);

    // Reset form
    setAppointment({ name: "", email: "", date: "", time: "", doctor: "" });
  };

  return (
    <div className="appointment-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <input type="text" name="name" value={appointment.name} onChange={handleChange} placeholder="Your Name" required />
        <input type="email" name="email" value={appointment.email} onChange={handleChange} placeholder="Your Email" required />
        <input type="date" name="date" value={appointment.date} onChange={handleChange} required />
        <input type="time" name="time" value={appointment.time} onChange={handleChange} required />

        <select name="doctor" value={appointment.doctor} onChange={handleChange} required>
          <option value="">Select a Doctor</option>
          {doctors.map((doc, index) => (
            <option key={index} value={doc}>
              {doc}
            </option>
          ))}
        </select>

        <button type="submit" className="book-btn">Book Appointment</button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default AppointmentBooking;
