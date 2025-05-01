// src/pages/HomePage.jsx
import { useState, useEffect, useContext } from 'react';
import HotelSearch from '../components/hotels/HotelSearch';
import HotelList from '../components/hotels/HotelList';
import { searchHotels, getBookmarkedHotels } from '../services/hotelService';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [bookmarkedHotels, setBookmarkedHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchBookmarkedHotels();
    }
  }, [user]);

  const fetchBookmarkedHotels = async () => {
    try {
      const data = await getBookmarkedHotels();
      setBookmarkedHotels(data.map(hotel => hotel.id));
    } catch (error) {
      console.error('Error fetching bookmarked hotels:', error);
    }
  };

  const handleSearch = async (location, filters) => {
    setLoading(true);
    setError('');
    setSearchPerformed(true);
    
    try {
      const data = await searchHotels(location, filters);
      setHotels(data);
    } catch (error) {
      console.error('Error searching hotels:', error);
      setError('Failed to fetch hotels. Please try again.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = (hotelId, isBookmarked) => {
    if (isBookmarked) {
      setBookmarkedHotels(prev => [...prev, hotelId]);
    } else {
      setBookmarkedHotels(prev => prev.filter(id => id !== hotelId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <HotelSearch onSearch={handleSearch} />
        </div>
        
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            {searchPerformed ? 'Search Results' : 'Welcome to Simple Hotel Lister'}
          </h1>
          
          {!searchPerformed && !loading && (
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md">
              <p className="text-blue-800 dark:text-blue-200">
                Search for hotels by entering a location and applying filters.
              </p>
            </div>
          )}
          
          {searchPerformed && (
            <HotelList
              hotels={hotels}
              bookmarkedHotels={bookmarkedHotels}
              onBookmarkChange={handleBookmarkChange}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;