import React, { useState, useEffect } from 'react';
import { fetchDoctorSlots } from '../../utils/api';
import styles from './AppointmentCalendar.module.css';

const AppointmentCalendar = ({ doctorId, selectedDate, onDateSelect, onSlotSelect }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const today = new Date();
    const nextWeek = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextWeek.push(formatDate(date));
    }
    
    setDateRange(nextWeek);
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const debugSlots = (slots) => {
    console.log('Received slots data:', slots);
    return slots;
  };

  const formatTime = (timeInput) => {
    console.log('Formatting time input:', timeInput);
    
    if (timeInput instanceof Date) {
      const hours = timeInput.getHours();
      const minutes = timeInput.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    }
    
    if (typeof timeInput === 'number') {
      const date = new Date(timeInput);
      if (!isNaN(date.getTime())) {
        return formatTime(date);
      }
    }
    
    if (typeof timeInput === 'string' && timeInput.includes('T')) {
      try {
        const date = new Date(timeInput);
        if (!isNaN(date.getTime())) {
          return formatTime(date);
        }
      } catch (err) {
        console.error('Error parsing ISO string:', err);
      }
    }
    
    if (typeof timeInput === 'string' && timeInput.includes(':')) {
      try {
        const parts = timeInput.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parts[1].substring(0, 2);
        
        if (!isNaN(hours) && minutes) {
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHour = hours % 12 || 12;
          return `${displayHour}:${minutes} ${period}`;
        }
      } catch (err) {
        console.error('Error parsing time string:', err);
      }
    }
    
    if (timeInput && typeof timeInput === 'object' && 'hour' in timeInput && 'minute' in timeInput) {
      const { hour, minute } = timeInput;
      const hours = parseInt(hour, 10);
      const minutes = parseInt(minute, 10).toString().padStart(2, '0');
      
      if (!isNaN(hours) && !isNaN(minutes)) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
      }
    }
    
    console.warn('Unrecognized time format:', timeInput);
    return 'Time format error';
  };

  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        const slots = await fetchDoctorSlots(doctorId, selectedDate);
        console.log('Raw slots from API:', slots);
        
        const processedSlots = Array.isArray(slots) ? slots : [];
        setAvailableSlots(processedSlots);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError('Failed to load available slots');
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlots();
  }, [doctorId, selectedDate]);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'Select a date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const processSlot = (slot) => {
    if (slot === null || slot === undefined) {
      return { display: 'Unavailable', value: null };
    }
    
    if (typeof slot === 'object' && !Array.isArray(slot)) {
      if ('time' in slot) return { display: formatTime(slot.time), value: slot };
      if ('timestamp' in slot) return { display: formatTime(slot.timestamp), value: slot };
      if ('value' in slot) return { display: formatTime(slot.value), value: slot };
      if ('startTime' in slot) return { display: formatTime(slot.startTime), value: slot };
      
      console.warn('Unexpected slot object format:', slot);
      return { display: 'Object format error', value: slot };
    }
    
    return { display: formatTime(slot), value: slot };
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select a Date & Time</h2>
      
      {/* Date picker */}
      <div className={styles.dateSelector}>
        {dateRange.map(date => (
          <button 
            key={date}
            className={`${styles.dateButton} ${selectedDate === date ? styles.selected : ''}`}
            onClick={() => onDateSelect(date)}
          >
            {formatDateDisplay(date)}
          </button>
        ))}
      </div>
      
      {/* Time slots */}
      <div className={styles.timeSlotsContainer}>
        <h3 className={styles.selectedDate}>
          Available Times for {selectedDate ? formatDateDisplay(selectedDate) : 'No Date Selected'}
        </h3>
        
        {loading && <div className={styles.loading}>Loading available slots...</div>}
        
        {error && <div className={styles.error}>{error}</div>}
        
        {!loading && !error && (
          !selectedDate ? (
            <div className={styles.noSlots}>Please select a date</div>
          ) : availableSlots.length === 0 ? (
            <div className={styles.noSlots}>No available slots for this date</div>
          ) : (
            <div className={styles.timeGrid}>
              {availableSlots.map((slot, index) => {
                const { display, value } = processSlot(slot);
                return (
                  <button 
                    key={index}
                    className={styles.timeSlot}
                    onClick={() => onSlotSelect(value)}
                    disabled={!value}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;