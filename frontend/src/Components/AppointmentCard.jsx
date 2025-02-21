import React from 'react';
import { format } from 'date-fns';
import '../styles/AppointmentCard.css';

const AppointmentCard = ({ appointment, onDelete, disabled }) => {
  const formattedDate = format(new Date(appointment.date), 'h:mm a');
  const endTime = format(
    new Date(new Date(appointment.date).getTime() + appointment.duration * 60000),
    'h:mm a'
  );

  return (
    <div className="appointment-card">
      <div className="appointment-header">
        <div className="appointment-time">
          <span className="time">{formattedDate} - {endTime}</span>
          <span className="duration">({appointment.duration} min)</span>
        </div>
        <div className={`appointment-type ${appointment.appointmentType.toLowerCase().replace(/\s+/g, '-')}`}>
          {appointment.appointmentType}
        </div>
      </div>

      <div className="appointment-content">
        <h3 className="doctor-name">Dr. {appointment.doctorId.name}</h3>
        <p className="doctor-specialization">{appointment.doctorId.specialization || 'General Physician'}</p>
        <div className="patient-info">
          <span className="label">Patient:</span> {appointment.patientName}
        </div>
        {appointment.notes && (
          <div className="appointment-notes">
            <div className="notes-label">Notes:</div>
            <p className="notes-content">{appointment.notes}</p>
          </div>
        )}
      </div>

      <div className="appointment-actions">
        <button
          className="btn-cancel"
          onClick={onDelete}
          disabled={disabled}
        >
          Cancel Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;