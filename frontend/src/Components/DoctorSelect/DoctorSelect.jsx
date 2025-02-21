import React, { useState, useEffect } from 'react';
import { fetchDoctors } from '../../utils/api';
import styles from './DoctorSelect.module.css';

const DoctorSelect = ({ onDoctorSelect }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  if (loading) return <div className={styles.loading}>Loading doctors...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select a Doctor</h2>
      
      {doctors.length === 0 ? (
        <p className={styles.emptyMessage}>No doctors available.</p>
      ) : (
        <div className={styles.doctorList}>
          {doctors.map(doctor => (
            <div 
              key={doctor._id} 
              className={styles.doctorCard}
              onClick={() => onDoctorSelect(doctor)}
            >
              <h3 className={styles.doctorName}>{doctor.name}</h3>
              {doctor.specialization && (
                <p className={styles.specialization}>{doctor.specialization}</p>
              )}
              <div className={styles.workHours}>
                Working Hours: {doctor.workingHours.start} - {doctor.workingHours.end}
              </div>
              <button className={styles.selectButton}>Select</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSelect;