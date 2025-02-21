import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../services/api';
import Spinner from '../Components/Spinner';
import AppointmentCard from '../Components/AppointmentCard';
import '../styles/AppointmentList.css';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.getAppointments();
        setAppointments(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load appointments. Please try again later.');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    setDeleteInProgress(true);
    try {
      await api.deleteAppointment(id);
      setAppointments(appointments.filter(apt => apt._id !== id));
    } catch (err) {
      setError('Failed to cancel appointment. Please try again.');
      console.error('Error deleting appointment:', err);
    } finally {
      setDeleteInProgress(false);
    }
  };

  if (loading) return <Spinner />;

  // Group appointments by date
  const groupedAppointments = appointments.reduce((groups, appointment) => {
    const date = format(new Date(appointment.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {});

  // Sort by date (newest first)
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="appointments-list-container">
      <h1>Your Appointments</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && appointments.length === 0 && (
        <div className="no-appointments">
          <p>You don't have any appointments scheduled.</p>
        </div>
      )}

      {sortedDates.map(date => (
        <div key={date} className="appointment-date-group">
          <h2 className="date-header">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </h2>
          <div className="appointments-grid">
            {groupedAppointments[date].map(appointment => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onDelete={() => handleDelete(appointment._id)}
                disabled={deleteInProgress}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsList;