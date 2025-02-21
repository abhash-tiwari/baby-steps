import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DoctorCard from '../Components/DoctorCard';
import Spinner from '../Components/Spinner';
import '../styles/DoctorList.css';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.getDoctors();
        setDoctors(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="doctors-list-container">
      <div className="doctors-header">
        <h1>Our Medical Specialists</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!loading && filteredDoctors.length === 0 && (
        <div className="no-results">
          <p>No doctors found matching your search criteria.</p>
        </div>
      )}

      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <Link to={`/doctors/${doctor._id}`} key={doctor._id}>
            <DoctorCard doctor={doctor} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;