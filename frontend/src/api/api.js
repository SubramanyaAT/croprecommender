import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
