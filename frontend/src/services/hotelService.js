// src/services/hotelService.js
import api from './api';

export const searchHotels = async (location, filters = {}) => {
  try {
    const response = await api.get('/api/hotels/search/', {
      params: {
        location,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
};

export const getBookmarkedHotels = async () => {
  try {
    const response = await api.get('/api/hotels/bookmarks/');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarked hotels:', error);
    throw error;
  }
};

export const bookmarkHotel = async (hotelId) => {
  try {
    const response = await api.post('/api/hotels/bookmarks/', { hotel_id: hotelId });
    return response.data;
  } catch (error) {
    console.error('Error bookmarking hotel:', error);
    throw error;
  }
};

export const removeBookmark = async (hotelId) => {
  try {
    const response = await api.delete(`/api/hotels/bookmarks/${hotelId}/`);
    return response.data;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};