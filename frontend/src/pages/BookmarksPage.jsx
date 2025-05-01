// src/pages/BookmarksPage.jsx
import { useState, useEffect } from 'react';
import HotelList from '../components/hotels/HotelList';
import { getBookmarkedHotels } from '../services/hotelService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookmarksPage = () => {
  const [bookmarkedHotels, setBookmarkedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarkedHotels();
  }, []);

  const fetchBookmarkedHotels = async () => {
    setLoading(true);
    try {
      const data = await getBookmarkedHotels();
      setBookmarkedHotels(data);
    } catch (error) {
      console.error('Error fetching bookmarked hotels:', error);
      setError('Failed to fetch your bookmarked hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = (hotelId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarkedHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Bookmarked Hotels</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : bookmarkedHotels.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">You haven't bookmarked any hotels yet.</span>
        </div>
      ) : (
        <HotelList
          hotels={bookmarkedHotels}
          bookmarkedHotels={bookmarkedHotels.map(hotel => hotel.id)}
          onBookmarkChange={handleBookmarkChange}
        />
      )}
    </div>
  );
};

export default BookmarksPage;