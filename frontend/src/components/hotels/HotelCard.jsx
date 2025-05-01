// src/components/hotels/HotelCard.jsx
import { useState, useContext } from 'react';
import { FaStar, FaBookmark as BookmarkSolid, FaRegBookmark } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { bookmarkHotel, removeBookmark } from '../../services/hotelService';

const HotelCard = ({ hotel, isBookmarked = false, onBookmarkChange }) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-yellow-400" />
    ));
  };

  const handleBookmarkToggle = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(hotel.id);
      } else {
        await bookmarkHotel(hotel.id);
      }
      
      setBookmarked(!bookmarked);
      if (onBookmarkChange) {
        onBookmarkChange(hotel.id, !bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative">
        {hotel.image_url ? (
          <img 
            src={hotel.image_url} 
            alt={hotel.name} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No image available</span>
          </div>
        )}
        
        {user && (
          <button
            onClick={handleBookmarkToggle}
            disabled={loading}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            {bookmarked ? (
              <BookmarkSolid className="text-blue-500 h-5 w-5" />
            ) : (
              <FaRegBookmark className="text-gray-500 dark:text-gray-400 h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{hotel.name}</h3>
          <div className="flex">
            {renderStars(hotel.star_rating)}
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {hotel.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            ${hotel.price}/night
          </span>
          
          <a
            href={hotel.booking_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;