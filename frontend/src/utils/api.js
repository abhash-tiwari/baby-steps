const API_BASE_URL = 'https://baby-steps-4t1b.onrender.com/api';

// Fetch all doctors
export const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Fetch available slots for a doctor on a specific date
export const fetchDoctorSlots = async (doctorId, date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/slots?date=${date}`);
    if (!response.ok) throw new Error('Failed to fetch available slots');
    return await response.json();
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

// Fetch all appointments
export const fetchAppointments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create appointment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Update an existing appointment
export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update appointment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete appointment');
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};