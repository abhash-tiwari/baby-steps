import React from 'react';
import '../styles/DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  // Generate placeholder initials for doctor avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="doctor-card">
      <div className="doctor-avatar">
        <div className="avatar-initials">{getInitials(doctor.name)}</div>
      </div>
      <div className="doctor-info">
        <h2 className="doctor-name">{doctor.name}</h2>
        <p className="doctor-specialization">{doctor.specialization || 'General Physician'}</p>
        <div className="doctor-hours">
          <span className="hours-label">Hours:</span>
          <span className="hours-value">{doctor.workingHours.start} - {doctor.workingHours.end}</span>
        </div>
      </div>
      <div className="card-action">
        <span className="view-profile">View Profile</span>
      </div>
    </div>
  );
};

export default DoctorCard;