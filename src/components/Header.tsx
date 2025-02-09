import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
// import SignIn from "./SignIn";

function Header() {
  return (
    <header className="app-header">
      <h1>Patient Report Generation</h1>
      <nav className="app-header-nav">
        <ul>
          <li>
            <Link to="#home">Home</Link>
          </li>
          <li>
            <Link to="#about">About</Link>
          </li>
          <li>
            <Link to="#contact">Contact</Link>
          </li>
          <li><Link to="/signin">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="nav_button"
            >
              <Button>Login</Button>
            </motion.button>
            </Link>
          </li>
        </ul>



      </nav>
    </header>
  )
}

export default Header

