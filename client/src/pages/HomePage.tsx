import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllSpaces, getAllAmenities } from '../services/api';
import type { Space, Amenity } from '../types';
import Spinner from '../components/Spinner';
import debounce from 'lodash.debounce';

const HomePage = () => {

  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const {
    data: allAmenities = [],
    isLoading: loadingAmenities
  } = useQuery({
    queryKey: ['amenities'],
    queryFn: getAllAmenities,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data,
    isLoading: loadingSpaces,
    isError,
    isPlaceholderData
  } = useQuery({
    queryKey: ['spaces', Array.from(selectedAmenities).join(','), page, searchTerm],
    queryFn: () => getAllSpaces(Array.from(selectedAmenities).join(','), page, searchTerm),
    staleTime: 1000 * 60 * 1,
  });

  const spaces = data?.spaces || [];
  const totalPages = data?.totalPages || 1;

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(amenityId)) {
        newSet.delete(amenityId);
      } else {
        newSet.add(amenityId);
      }
      return newSet;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const debouncedSearchHandler = useMemo(
    () => debounce(handleSearchChange, 500),
    []
  );

  useEffect(() => {
    setPage(1);
  }, [selectedAmenities]);

  return (
    <div className="container mx-auto px-6 py-8 lg:flex">
      <div className="lg:flex flex-col">
        <div className="mb-6 lg:pr-8">
          <input
            type="text"
            placeholder="Search space name..."
            onChange={(e) => debouncedSearchHandler(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 outline-none"
          />
        </div>

        <aside className="w-full lg:pr-8 mb-8 lg:mb-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Filter by Amenities</h2>

            {loadingAmenities ? (
              <div className="text-gray-500 text-sm">Loading filters...</div>
            ) : (
              <div className="space-y-3">
                {allAmenities.map((amenity: Amenity) => (
                  <label key={amenity._id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={selectedAmenities.has(amenity._id)}
                      onChange={() => handleAmenityChange(amenity._id)}
                    />
                    <span className="text-gray-700">{amenity.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
      <main className="w-full lg:w-3/4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Spaces</h1>

        {isError ? (
          <div className="text-red-500 text-center p-10">Something went wrong fetching spaces.</div>
        ) : loadingSpaces ? (
          <Spinner />
        ) : spaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No spaces found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedAmenities(new Set());
                queryClient.invalidateQueries({ queryKey: ['spaces'] });
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space: Space) => (
                <Link
                  to={`/spaces/${space._id}`}
                  key={space._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="w-full h-48 bg-gray-200 flex-shrink-0 relative">
                    {space.image_url ? (
                      <img src={space.image_url} alt={space.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{space.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{space.address}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <p className="text-lg font-bold text-blue-600">₹{space.price_per_day}<span className="text-sm text-gray-500 font-normal">/day</span></p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {spaces.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setPage(old => Math.max(old - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => {
                    if (!isPlaceholderData && page < totalPages) {
                      setPage(old => old + 1);
                    }
                  }}
                  disabled={isPlaceholderData || page >= totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;