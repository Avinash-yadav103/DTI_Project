import express from 'express';
import { connectToDatabase } from './database';
import appointmentRoutes from './routes/appointmentRoutes';
import dataRoutes from './routes/dataRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
connectToDatabase();

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/data', dataRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});