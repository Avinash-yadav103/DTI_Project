const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/appointments', appointmentRoutes);
app.use('/data', dataRoutes);

// Database connection
mongoose.connect('mongodb://localhost:27017/CareFolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});