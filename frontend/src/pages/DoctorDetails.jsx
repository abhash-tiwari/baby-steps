import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import Spinner from '../Components/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/DoctorDetails.css';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.getDoctor(id);
        setDoctor(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load doctor information. Please try again later.');
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!doctor) return;
    
    const fetchAvailableSlots = async () => {
      setSlotsLoading(true);
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const response = await api.getAvailableSlots(doctor._id, formattedDate);
        setAvailableSlots(response.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [doctor, selectedDate]);

  const handleBookAppointment = () => {
    navigate(`/book/${doctor._id}`, { state: { doctor, selectedDate } });
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!doctor) return <div className="error-message">Doctor not found</div>;

  return (
    <div className="doctor-details-container">
      <div className="doctor-profile-card">
        <div className="doctor-header">
          <h1>{doctor.name}</h1>
          <div className="doctor-specialty">{doctor.specialization}</div>
        </div>
        
        <div className="doctor-info">
          <div className="info-section">
            <h3>Working Hours</h3>
            <p>{doctor.workingHours.start} - {doctor.workingHours.end}</p>
          </div>
        </div>
        
        <div className="appointment-section">
          <h2>Schedule an Appointment</h2>
          <div className="date-picker-container">
            <label>Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              minDate={new Date()}
              className="date-picker"
              dateFormat="MMMM d, yyyy"
            />
          </div>
          
          <div className="available-slots">
            <h3>Available Time Slots</h3>
            {slotsLoading ? (
              <div className="slots-loading">Loading available slots...</div>
            ) : availableSlots.length === 0 ? (
              <div className="no-slots">No available slots on this date</div>
            ) : (
              <div className="slots-grid">
                {availableSlots.map((slot, index) => (
                  <div key={index} className="time-slot">
                    <span>{slot.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="btn-primary btn-book" 
            onClick={handleBookAppointment}
            disabled={availableSlots.length === 0}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;