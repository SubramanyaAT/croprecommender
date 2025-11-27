import axios from 'axios';

// Use env variable in production, localhost in development
// Fallback to Render backend if env var not set in Vercel
const API_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'https://croprecommender-3.onrender.com/api' 
    : 'http://localhost:5000/api');

console.log('API Configuration:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
  envVarSet: !!import.meta.env.VITE_API_URL,
  API_URL: API_URL
});

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export const cropAPI = {
  getRecommendations: (season, soilType, temperature, rainfall, humidity) =>
    apiClient.post('/crops/recommend', {
      season,
      soilType,
      temperature,
      rainfall,
      humidity,
    }),
  getHistory: () => apiClient.get('/crops/history'),
  getOptions: () => apiClient.get('/crops/info/options'),
};

export const waterAPI = {
  getWaterStatus: (city, latitude, longitude, recommendationId) =>
    apiClient.post('/water/water-status', {
      city,
      latitude,
      longitude,
      recommendationId,
    }),
  updateWaterApplied: (waterTrackingId, waterQuantity) =>
    apiClient.post('/water/water-applied', {
      waterTrackingId,
      waterQuantity,
    }),
  getWaterHistory: () => apiClient.get('/water/water-history'),
  getCurrentStatus: (waterTrackingId) =>
    apiClient.get(`/water/current-status/${waterTrackingId}`),
};

export default apiClient;
