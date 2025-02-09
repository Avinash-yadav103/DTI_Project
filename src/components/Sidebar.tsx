import {Link } from "react-router-dom";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

function Sidebar({ setCurrentPage }: SidebarProps) {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <Link to="/"><li onClick={() => setCurrentPage("dashboard")}>Dashboard</li></Link>
            <Link to="/healthTracking"><li onClick={() => setCurrentPage("healthTracking")}>Health Tracking</li></Link>
            <Link to="/medicationTracker"><li onClick={() => setCurrentPage("medicationTracker")}>Medication Tracker</li></Link>
            <Link to="/fitnessGraph"><li onClick={() => setCurrentPage("fitnessGraph")}>Fitness Graph</li></Link>
            <Link to="/appointmentBooking"><li onClick={() => setCurrentPage("appointmentBooking")}>Book Appointment</li></Link>
            <Link to="/bedBooking"><li onClick={() => setCurrentPage("bedBooking")}>Book Hospital Bed</li></Link>
          </ul>
        </nav>
      </div>
    )
  }
  
  export default Sidebar
  
  