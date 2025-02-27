import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import './App.css';

// Lazy load components
const DoctorsList = lazy(() => import('./pages/DoctorList'));
const DoctorDetails = lazy(() => import('./pages/DoctorDetails'));
const AppointmentsList = lazy(() => import('./pages/AppointmentList'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-container">
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="content">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/doctors" element={<DoctorsList />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/book/:doctorId" element={<BookAppointment />} />
              <Route path="*" element={<Navigate to="/doctors" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;