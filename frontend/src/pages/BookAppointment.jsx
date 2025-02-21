import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import Spinner from '../Components/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/BookAppointment.css';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialDoctor = location.state?.doctor;
  const initialDate = location.state?.selectedDate || new Date();
  
  const [doctor, setDoctor] = useState(initialDoctor);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(!initialDoctor);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    doctorId,
    date: null,
    duration: 30,
    appointmentType: 'Routine Check-Up',
    patientName: '',
    notes: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      if (initialDoctor) return;
      
      try {
        const response = await api.getDoctor(doctorId);
        setDoctor(response.data);
      } catch (err) {
        setError('Failed to load doctor information.');
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, initialDoctor]);

  useEffect(() => {
    if (!doctor) return;
    
    const fetchSlots = async () => {
      try {
        const formattedDate = format(initialDate, 'yyyy-MM-dd');
        const response = await api.getAvailableSlots(doctor._id, formattedDate);
        setAvailableSlots(response.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };

    fetchSlots();
  }, [doctor, initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlotSelect = (slot) => {
    setFormData(prev => ({ ...prev, date: slot.dateTime }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      setError('Please select an appointment time');
      return;
    }

    setSubmitting(true);
    try {
      await api.createAppointment(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!doctor) return <div className="error-message">Doctor not found</div>;

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>Appointment Booked Successfully!</h2>
          <p>Your appointment with Dr. {doctor.name} has been confirmed.</p>
          <p>Redirecting to your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment-container">
      <div className="booking-card">
        <h1>Book an Appointment</h1>
        <div className="doctor-info">
          <h2>Dr. {doctor.name}</h2>
          <p>{doctor.specialization}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Appointment Date</label>
            <DatePicker
              selected={initialDate}
              onChange={() => {}}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
              disabled
              className="date-picker"
            />
            <p className="helper-text">
              Date selected: {format(initialDate, 'MMMM d, yyyy')}
            </p>
          </div>

          <div className="form-group">
            <label>Available Time Slots</label>
            <div className="slots-container">
              {availableSlots.length === 0 ? (
                <p>No available slots for this date</p>
              ) : (
                availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`slot ${formData.date === slot.dateTime ? 'selected' : ''}`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    {slot.time}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appointmentType">Appointment Type</label>
            <select
              id="appointmentType"
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange}
              required
            >
              <option value="Routine Check-Up">Routine Check-Up</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="patientName">Patient Name</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(`/doctors/${doctor._id}`)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting || !formData.date}
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;