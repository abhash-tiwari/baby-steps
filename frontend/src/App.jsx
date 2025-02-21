import React, { useState, useEffect } from 'react';
// import DoctorSelect from './components/DoctorSelect';
// import AppointmentCalendar from './components/AppointmentCalendar';
// import AppointmentForm from './components/AppointmentForm';
// import AppointmentList from './components/AppointmentList';
import { fetchAppointments } from './utils/api';
import './App.css';
import DoctorSelect from './Components/DoctorSelect/DoctorSelect';
import AppointmentCalendar from './Components/AppointmentCalendar/AppointmentCalendar';
import AppointmentForm from './Components/AppointmentForm/AppointmentForm';
import AppointmentList from './Components/AppointmentList/AppointmentList';

function App() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to load appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [refreshTrigger]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    sessionStorage.setItem('selectedAppointmentDate', date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };

  const handleAppointmentCreated = () => {
    setShowForm(false);
    setSelectedSlot(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAppointmentUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // const handleDateSelect = (date) => {
  //   setSelectedDate(date);
  //   // Store it in session storage for persistence
    
  // };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>BabySteps Appointment Booking</h1>
      </header>
      
      <main className="app-main">
        <div className="left-panel">
          <DoctorSelect onDoctorSelect={handleDoctorSelect} />
          
          {selectedDoctor && (
            <AppointmentCalendar 
              doctorId={selectedDoctor._id}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onSlotSelect={handleSlotSelect}
            />
          )}
        </div>
        
        <div className="right-panel">
          {showForm && selectedDoctor && selectedSlot ? (
            <AppointmentForm 
              doctorId={selectedDoctor._id}
              slot={selectedSlot}
              selectedDate={selectedDate}
              onAppointmentCreated={handleAppointmentCreated}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <AppointmentList 
              appointments={appointments}
              isLoading={isLoading}
              onAppointmentUpdated={handleAppointmentUpdated}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;