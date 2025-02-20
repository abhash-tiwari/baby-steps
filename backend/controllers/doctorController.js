const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { startOfDay, endOfDay, parseISO, format, addMinutes } = require('date-fns');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctor', error: err.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    const savedDoctor = await doctor.save();
    res.status(201).json(savedDoctor);
  } catch (err) {
    res.status(400).json({ message: 'Error creating doctor', error: err.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const requestedDate = parseISO(date);
    const dayStart = startOfDay(requestedDate);
    const dayEnd = endOfDay(requestedDate);

    const appointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: dayStart,
        $lte: dayEnd
      }
    }).sort({ date: 1 });

    const [startHour, startMinute] = doctor.workingHours.start.split(':');
    const [endHour, endMinute] = doctor.workingHours.end.split(':');
    
    const workStart = new Date(requestedDate.setHours(parseInt(startHour), parseInt(startMinute)));
    const workEnd = new Date(requestedDate.setHours(parseInt(endHour), parseInt(endMinute)));

    const slots = [];
    let currentSlot = workStart;

    while (currentSlot < workEnd) {
      const slotEnd = addMinutes(currentSlot, 30);
      
      const isAvailable = !appointments.some(apt => {
        const aptEnd = addMinutes(apt.date, apt.duration);
        return (currentSlot < aptEnd && slotEnd > apt.date);
      });

      if (isAvailable) {
        slots.push({
          time: format(currentSlot, 'HH:mm'),
          available: true,
          dateTime: currentSlot
        });
      }

      currentSlot = slotEnd;
    }

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching slots', error: err.message });
  }
};