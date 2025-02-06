interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

function Sidebar({ setCurrentPage }: SidebarProps) {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => setCurrentPage("dashboard")}>Dashboard</li>
            <li onClick={() => setCurrentPage("healthTracking")}>Health Tracking</li>
            <li onClick={() => setCurrentPage("medicationTracker")}>Medication Tracker</li>
            <li onClick={() => setCurrentPage("fitnessGraph")}>Fitness Graph</li>
            <li onClick={() => setCurrentPage("appointmentBooking")}>Book Appointment</li>
            <li onClick={() => setCurrentPage("bedBooking")}>Book Hospital Bed</li>
          </ul>
        </nav>
      </div>
    )
  }
  
  export default Sidebar
  
  