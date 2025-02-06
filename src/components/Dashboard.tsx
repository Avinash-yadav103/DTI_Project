function Dashboard() {
    return (
      <div className="dashboard">
        <h1>Welcome to Your Health Dashboard</h1>
        <div className="dashboard-widgets">
          <div className="dashboard-widget">
            <h2>Quick Health Update</h2>
            <form className="dashboard-form">
              <label>
                Blood Pressure:
                <input type="text" name="bloodPressure" />
              </label>
              <label>
                Weight (kg):
                <input type="number" name="weight" />
              </label>
              <label>
                Mood:
                <select name="mood">
                  <option value="great">Great</option>
                  <option value="good">Good</option>
                  <option value="okay">Okay</option>
                  <option value="poor">Poor</option>
                </select>
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
          <div className="dashboard-widget">
            <h2>Upcoming Appointments</h2>
            {/* Add a list of upcoming appointments here */}
          </div>
          <div className="dashboard-widget">
            <h2>Medication Reminder</h2>
            {/* Add a list of medications due today */}
          </div>
        </div>
      </div>
    )
  }
  
  export default Dashboard
  
  