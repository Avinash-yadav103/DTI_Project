const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

// Initialize Firebase Admin SDK (import after env variables are loaded)
const { initializeFirebase } = require('./config/firebaseConfig');
const db = initializeFirebase();

// Import routes after Firebase is initialized
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const accessRouutes = require('./routes/accessControlRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:6420'], // Add all your frontend origins
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', otpRoutes); // Keeping original route paths
app.use('/', userRoutes); // Keeping original route paths
app.use('/doctors', doctorRoutes);
app.use('/access',accessRouutes);

// Example endpoint to test Firestore connection
app.get("/test-connection", async (req, res) => {
  try {
    const { db } = require('./config/firebaseConfig');
    const snapshot = await db.collection("patients").limit(1).get();
    if (snapshot.empty) {
      res.json({ message: "Connection successful but no documents found" });
    } else {
      res.json({
        message: "Connection successful",
        documentCount: snapshot.size,
      });
    }
  } catch (error) {
    console.error("Firebase connection error:", error);
    res.status(500).json({ error: "Failed to connect to Firebase" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

module.exports = app;