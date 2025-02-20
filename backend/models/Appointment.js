const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  duration: {
    type: Number,
    required: true,
    enum: [30, 60],
    message: 'Duration must be either 30 or 60 minutes'
  },
  appointmentType: {
    type: String,
    required: true,
    enum: ['Routine Check-Up', 'Ultrasound', 'Follow-up'],
    message: 'Invalid appointment type'
  },
  patientName: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Patient name must be at least 2 characters long']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);