// src/components/hotels/HotelList.jsx
import HotelCard from './HotelCard';

const HotelList = ({ hotels, bookmarkedHotels = [], onBookmarkChange, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">No hotels found. Try a different search.</span>
      </div>
    );
  }

// src/components/hotels/HotelList.jsx (continued)
return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map(hotel => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          isBookmarked={bookmarkedHotels.includes(hotel.id)}
          onBookmarkChange={onBookmarkChange}
        />
      ))}
    </div>
  );
};

export default HotelList;