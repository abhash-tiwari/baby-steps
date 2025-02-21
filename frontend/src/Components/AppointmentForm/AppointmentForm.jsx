import React, { useState } from 'react';
import { createAppointment } from '../../utils/api';
import styles from './AppointmentForm.module.css';

const AppointmentForm = ({ doctorId, slot, onAppointmentCreated, onCancel, selectedDate }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentType: 'Routine Check-Up',
    duration: 30,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const appointmentTypes = [
    'Routine Check-Up',
    'Ultrasound',
    'Follow-up',
    'Consultation',
    'Prenatal Care'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper function to parse time from various formats
  const parseTimeSlot = (slot) => {
    console.log('Parsing slot:', slot);
    
    // If slot is already a proper time string in format "HH:MM"
    if (typeof slot === 'string' && /^\d{1,2}:\d{2}$/.test(slot)) {
      return slot;
    }
    
    // If slot is a string but in 12-hour format like "9:30 AM"
    if (typeof slot === 'string' && /^\d{1,2}:\d{2}\s(AM|PM)$/i.test(slot)) {
      const [timePart, period] = slot.split(' ');
      const [hours, minutes] = timePart.split(':');
      let hour = parseInt(hours, 10);
      
      // Convert to 24-hour format
      if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
      if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
      
      return `${hour.toString().padStart(2, '0')}:${minutes}`;
    }
    
    // If slot is an object with time-related properties
    if (typeof slot === 'object' && slot !== null) {
      // Check for common time properties
      if ('time' in slot && typeof slot.time === 'string') {
        return parseTimeSlot(slot.time);
      }
      if ('startTime' in slot && typeof slot.startTime === 'string') {
        return parseTimeSlot(slot.startTime);
      }
      if ('hour' in slot && 'minute' in slot) {
        const hour = parseInt(slot.hour, 10);
        const minute = parseInt(slot.minute, 10);
        if (!isNaN(hour) && !isNaN(minute)) {
          return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
      }
      
      // If it's a Date object or has timestamp
      if (slot instanceof Date) {
        return `${slot.getHours().toString().padStart(2, '0')}:${slot.getMinutes().toString().padStart(2, '0')}`;
      }
      if ('timestamp' in slot) {
        const date = new Date(slot.timestamp);
        if (!isNaN(date.getTime())) {
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
      }
    }
    
    console.error('Unable to parse time slot:', slot);
    return null;
  };

  const formatDisplayTime = (timeSlot) => {
    if (!timeSlot) return 'No time selected';
    
    try {
      if (typeof timeSlot === 'object' && timeSlot !== null) {
        if ('display' in timeSlot) return timeSlot.display;
        if ('time' in timeSlot) return formatDisplayTime(timeSlot.time);
        if ('startTime' in timeSlot) return formatDisplayTime(timeSlot.startTime);
      }
      
      if (typeof timeSlot === 'string' && /^\d{1,2}:\d{2}$/.test(timeSlot)) {
        const [hours, minutes] = timeSlot.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
      }
      
      return String(timeSlot);
    } catch (err) {
      console.error('Error formatting display time:', err);
      return String(timeSlot);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const timeSlot = parseTimeSlot(slot);
      if (!timeSlot) {
        throw new Error('Invalid time slot format');
      }
      
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = timeSlot.split(':');
      appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const appointmentData = {
        doctorId,
        date: appointmentDate.toISOString(),
        duration: parseInt(formData.duration, 10),
        appointmentType: formData.appointmentType,
        patientName: formData.patientName,
        notes: formData.notes
      };
      
      console.log('Submitting appointment with data:', appointmentData);
      await createAppointment(appointmentData);
      onAppointmentCreated();
      
    } catch (err) {
      console.error('Appointment creation error:', err);
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Appointment</h2>
      <p className={styles.slotInfo}>Selected Time: {formatDisplayTime(slot)}</p>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="patientName" className={styles.label}>Patient Name</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="appointmentType" className={styles.label}>Appointment Type</label>
          <select
            id="appointmentType"
            name="appointmentType"
            value={formData.appointmentType}
            onChange={handleChange}
            className={styles.select}
            required
          >
            {appointmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="duration" className={styles.label}>Duration (minutes)</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="notes" className={styles.label}>Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={styles.textarea}
            rows="4"
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !parseTimeSlot(slot)}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;