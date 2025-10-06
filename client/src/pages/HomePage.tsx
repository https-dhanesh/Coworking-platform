import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSpaces, getAllAmenities } from '../services/api';
import type { Space, Amenity } from '../types';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const amenitiesData = await getAllAmenities();
        setAllAmenities(amenitiesData);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
      }
    };
    fetchAmenities();
  }, []);

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const amenityIds = Array.from(selectedAmenities).join(',');
        const data = await getAllSpaces(amenityIds);
        setSpaces(data);
      } catch (error) {
        console.error("Failed to fetch spaces:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpaces();
  }, [selectedAmenities]);

  const handleAmenityChange = (amenityId: number) => {
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

  return (
    <div>
      <div className="relative bg-gray-600 text-white text-center py-20 px-6">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold mb-4">Find Your Niche, Find Your Focus.</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover unique coworking spaces tailored to your profession, from quiet writer's nooks to bustling tech hubs.
          </p>
          <a
            href="#spaces"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Explore Spaces
          </a>
        </div>
      </div>

      <div id="spaces" className="container mx-auto px-6 py-8 lg:flex">
        <aside className="w-full lg:w-1/4 lg:pr-8 mb-8 lg:mb-0 ">
          <div className="bg-slate-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Filter by Amenities</h2>
            <div className="space-y-3">
              {allAmenities.map(amenity => (
                <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    checked={selectedAmenities.has(amenity.id)}
                    onChange={() => handleAmenityChange(amenity.id)}
                  />
                  <span className="text-gray-700">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        <main className="w-full lg:w-3/4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Spaces</h1>
          {isLoading ? (
            <Spinner />
          ) : spaces.length === 0 ? (
            <p>No spaces found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <Link
                  to={`/spaces/${space.id}`}
                  key={space.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="w-full h-48 bg-gray-200 flex-shrink-0">
                    {space.image_url ? (
                      <img src={space.image_url} alt={space.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-300"></div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{space.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{space.address}</p>
                    <p className="text-lg font-semibold text-gray-900 mt-auto">₹{space.price_per_day} / day</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;