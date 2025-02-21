import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://baby-steps-4t1b.onrender.com';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const api = {
  setAuthToken: (token) => {
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }
  },
  
  // Auth endpoints
  post: (url, data) => instance.post(url, data),
  
  // Doctors endpoints
  getDoctors: () => instance.get('/api/doctors'),
  getDoctor: (id) => instance.get(`/api/doctors/${id}`),
  createDoctor: (data) => instance.post('/api/doctors', data),
  getAvailableSlots: (doctorId, date) => 
    instance.get(`/api/doctors/${doctorId}/slots?date=${date}`),
  
  // Appointments endpoints
  getAppointments: () => instance.get('/api/appointments'),
  getAppointment: (id) => instance.get(`/api/appointments/${id}`),
  createAppointment: (data) => instance.post('/api/appointments', data),
  updateAppointment: (id, data) => instance.put(`/api/appointments/${id}`, data),
  deleteAppointment: (id) => instance.delete(`/api/appointments/${id}`),
};

export default api;


