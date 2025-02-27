require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());


// Protected Routes (Require Authentication)
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// Global Error Handler
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/appointment-booking')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
