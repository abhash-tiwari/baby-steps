import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorsList from './pages/DoctorList';
import DoctorDetails from './pages/DoctorDetails';
import AppointmentsList from './pages/AppointmentList';
import BookAppointment from './pages/BookAppointment';
import Navbar from './Components/Navbar';
import './App.css';



function App() {
  return (
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/doctors/:id" element={
                  <DoctorDetails />
              } />
              <Route path="/appointments" element={
               
                  <AppointmentsList />
                
              } />
              <Route path="/book/:doctorId" element={
                  <BookAppointment />
                
              } />
              <Route path="*" element={<Navigate to="/doctors" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
  );
}

export default App;