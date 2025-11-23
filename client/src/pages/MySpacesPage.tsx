import React from 'react';
import { Link } from 'react-router-dom';
import { getMySpaces, deleteSpace } from '../services/api';
import type { Space } from '../types';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MySpacesPage = () => {

  const queryClient = useQueryClient();
  const { 
    data: spaces = [], 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['my-spaces'], 
    queryFn: getMySpaces,
    staleTime: 1000 * 60 * 2,
  });

  const handleDelete = async (spaceId: string) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await deleteSpace(spaceId);
        toast.success('Space deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['my-spaces'] });
        queryClient.invalidateQueries({ queryKey: ['spaces'] });
      } catch (error) {
        toast.error('Failed to delete space.');
      }
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load your spaces.</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Spaces</h1>
        <Link to="/create-space" className="px-4 py-2 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300">
          + Add New Space
        </Link>
      </div>

      {spaces.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700">You haven't created any spaces yet.</h2>
          <p className="text-gray-500 mt-2">Click the button above to add your first space!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space: Space) => (
            <div 
              key={space._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300"
            >
               <div className="w-full h-48 bg-gray-200 relative">
                  {space.image_url ? (
                    <img src={space.image_url} alt={space.name} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>

              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{space.name}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{space.address}</p>
              </div>
              
              <div className="px-6 pb-4 flex justify-between items-center border-t border-gray-100 pt-4">
                <p className="text-lg font-bold text-gray-800">₹{space.price_per_day}</p>
                <div className="flex space-x-2">
                  <Link 
                    to={`/spaces/${space._id}/edit`} 
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-300"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(space._id)} 
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySpacesPage;