import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"

function Header() {
    return (
      <header className="app-header">
        <h1>Patient Report Generation</h1>
        <nav className="app-header-nav">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav_button"
          >
          <Button>Login</Button>
          </motion.button>


        </nav>
      </header>
    )
  }
  
  export default Header
  
  