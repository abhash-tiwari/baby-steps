const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  workingHours: {
    start: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format!`
      }
    },
    end: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format!`
      }
    }
  },
  specialization: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
