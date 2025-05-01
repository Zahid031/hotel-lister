import React from 'react';
import { useAuth } from '../context/AuthContext';
import { bookmarkService } from '../services/api';

const HotelCard = ({ hotel, onBookmarkToggle }) => {
  const { isAuthenticated } = useAuth();
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index}
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark hotels');
      return;
    }
    
    try {
      await bookmarkService.toggleBookmark(hotel.id);
      if (onBookmarkToggle) {
        onBookmarkToggle(hotel.id);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };
  
  return (
    <div className="card transition-shadow hover:shadow-lg">
      {/* Hotel Image */}
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={hotel.image_url || 'https://via.placeholder.com/300x200?text=Hotel+Image'} 
          alt={hotel.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Hotel Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{hotel.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{hotel.location}</p>
          </div>
          <button
            onClick={handleBookmarkToggle}
            className="text-gray-400 hover:text-primary-600 focus:outline-none transition-colors"
            aria-label={hotel.is_bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            {hotel.is_bookmarked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-primary-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Rating & Features */}
        <div className="mt-2 flex items-center text-sm">
          <div className="flex">
            {renderStars(hotel.star_rating)}
          </div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">{hotel.star_rating}-star</span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {hotel.has_pool ? 'Pool available' : 'No pool'}
        </div>
        
        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {hotel.description}
        </p>
        
        {/* Price & View Details */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              ${hotel.indicative_price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400"> /night</span>
          </div>
          
          <a 
            href="#" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;