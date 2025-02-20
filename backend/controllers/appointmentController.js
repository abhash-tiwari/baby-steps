const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { parseISO, addMinutes, isWithinInterval } = require('date-fns');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('doctorId');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointment', error: err.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointmentDate = parseISO(date);
    const appointmentEnd = addMinutes(appointmentDate, duration);

    const [startHour, startMinute] = doctor.workingHours.start.split(':');
    const [endHour, endMinute] = doctor.workingHours.end.split(':');
    
    const workStart = new Date(appointmentDate.setHours(parseInt(startHour), parseInt(startMinute)));
    const workEnd = new Date(appointmentDate.setHours(parseInt(endHour), parseInt(endMinute)));

    if (!isWithinInterval(appointmentDate, { start: workStart, end: workEnd }) ||
        !isWithinInterval(appointmentEnd, { start: workStart, end: workEnd })) {
      return res.status(400).json({ message: 'Appointment time is outside doctor\'s working hours' });
    }

    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      $and: [
        { date: { $lt: appointmentEnd } },
        {
          $expr: {
            $gt: [
              { $add: ['$date', { $multiply: ['$duration', 60000] }] },
              appointmentDate
            ]
          }
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      doctorId,
      date: appointmentDate,
      duration,
      appointmentType,
      patientName,
      notes
    });

    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating appointment', error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    Object.assign(appointment, req.body);
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: 'Error updating appointment', error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting appointment', error: err.message });
  }
};