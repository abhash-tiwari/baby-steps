import React, { useState } from 'react';
import { updateAppointment, deleteAppointment } from '../../utils/api';
import styles from './AppointmentList.module.css';

const AppointmentList = ({ appointments, isLoading, onAppointmentUpdated }) => {
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
  
    return {
      formattedDate: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      formattedTime: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        // timeZone: 'UTC'
      })
    };
  };



  const handleEdit = (appointment) => {
    setEditMode(appointment._id);
    setEditData({
      patientName: appointment.patientName,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditData({});
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (appointmentId) => {
    try {
      setActionLoading(true);
      setError(null);
      
      await updateAppointment(appointmentId, editData);
      setEditMode(null);
      onAppointmentUpdated();
      
    } catch (err) {
      setError(err.message || 'Failed to update appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      setError(null);
      
      await deleteAppointment(appointmentId);
      onAppointmentUpdated();
      
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading appointments...</div>;
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Appointments</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {appointments.length === 0 ? (
        <p className={styles.emptyMessage}>No appointments scheduled.</p>
      ) : (
        <div className={styles.appointmentList}>
          {appointments.map(appointment => (
            <div key={appointment._id} className={styles.appointmentCard}>
              {editMode === appointment._id ? (
                <div className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Patient Name</label>
                    <input
                      type="text"
                      name="patientName"
                      value={editData.patientName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Appointment Type</label>
                    <select
                      name="appointmentType"
                      value={editData.appointmentType}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="Routine Check-Up">Routine Check-Up</option>
                      <option value="Ultrasound">Ultrasound</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Prenatal Care">Prenatal Care</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Notes</label>
                    <textarea
                      name="notes"
                      value={editData.notes}
                      onChange={handleChange}
                      className={styles.textarea}
                      rows="3"
                    />
                  </div>
                  
                  <div className={styles.editActions}>
                    <button
                      className={styles.cancelButton}
                      onClick={handleCancelEdit}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      onClick={() => handleSaveEdit(appointment._id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <>
                  <div className={styles.appointmentHeader}>
                    <h3 className={styles.patientName}>{appointment.patientName}</h3>
                    <div className={styles.appointmentType}>{appointment.appointmentType}</div>
                  </div>

                  <div className={styles.doctorName}>
                    <strong>Doctor:</strong> {appointment.doctorId.name} 
                  </div>
                  
                  <div className={styles.appointmentDetails}>
                  <div className={styles.dateTime}>
      <strong>When:</strong> {formatAppointmentDate(appointment.date).formattedDate}
    </div>
                    <div className={styles.duration}>
                      <strong>Duration:</strong> {appointment.duration} minutes
                    </div>
                    {appointment.notes && (
                      <div className={styles.notes}>
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(appointment)}
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(appointment._id)}
                      disabled={actionLoading}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;