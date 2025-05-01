// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api';

// const api = axios.create({
//   baseURL: API_URL,
// });

// // Add token to request if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Authentication services
// export const authService = {
//   register: (userData) => api.post('/auth/register/', userData),
//   login: (credentials) => api.post('/auth/login/', credentials),
//   refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
//   getUserProfile: () => api.get('/auth/profile/'),
// };

// // Hotel services
// export const hotelService = {
//   searchHotels: (params) => api.get('/search/hotels/', { params }),
//   getHotelDetails: (id) => api.get(`/hotels/${id}/`),
// };

// // Bookmark services
// export const bookmarkService = {
//   getBookmarks: () => api.get('/bookmarks/'),
//   toggleBookmark: (hotelId) => api.post('/bookmarks/toggle/', { hotel_id: hotelId }),
//   removeBookmark: (id) => api.delete(`/bookmarks/${id}/`),
// };

// export default api;

// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Adjust to your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;