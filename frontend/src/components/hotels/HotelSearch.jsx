// src/components/hotels/HotelSearch.jsx
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const HotelSearch = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState({
    starRating: '',
    hasPool: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location, filters);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Find Hotels</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="starRating" className="block text-gray-700 dark:text-gray-300 mb-2">
            Star Rating
          </label>
          <select
            id="starRating"
            name="starRating"
            value={filters.starRating}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Any Rating</option>
            <option value="3">3 Stars & Above</option>
            <option value="4">4 Stars & Above</option>
            <option value="5">5 Stars Only</option>
          </select>
        </div>
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="hasPool"
            name="hasPool"
            checked={filters.hasPool}
            onChange={handleFilterChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasPool" className="ml-2 block text-gray-700 dark:text-gray-300">
            Pool Available
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Search Hotels
        </button>
      </form>
    </div>
  );
};

export default HotelSearch;