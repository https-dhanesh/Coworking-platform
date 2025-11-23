import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // 1. Import Hooks
import { getSpaceById, updateSpace, getAllAmenities, getAmenitiesForSpace } from '../services/api';
import type { CreateSpaceFormData, Amenity } from '../types';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const EditSpacePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateSpaceFormData>();
  
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  const { data: space, isLoading: loadingSpace } = useQuery({
    queryKey: ['space', id],
    queryFn: () => getSpaceById(id as string),
    enabled: !!id,
  });
  
  const { data: allAmenities = [], isLoading: loadingAllAmenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: getAllAmenities,
  });

  const { data: spaceAmenities = [], isLoading: loadingSpaceAmenities } = useQuery({
    queryKey: ['space-amenities', id],
    queryFn: () => getAmenitiesForSpace(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (space && spaceAmenities) {
      reset({
        name: space.name,
        description: space.description,
        address: space.address,
        price_per_day: space.price_per_day,
      });
      setSelectedAmenities(new Set(spaceAmenities.map((a: any) => a._id)));
    }
  }, [space, spaceAmenities, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateSpace(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space', id] });
      queryClient.invalidateQueries({ queryKey: ['space-amenities', id] });
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      queryClient.invalidateQueries({ queryKey: ['my-spaces'] });
      
      toast.success('Space updated successfully!');
      navigate(`/spaces/${id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update space.');
    }
  });

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(amenityId)) newSet.delete(amenityId);
      else newSet.add(amenityId);
      return newSet;
    });
  };

  const onSubmit = (data: any) => {
    if (!id) return;
    
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('price_per_day', data.price_per_day.toString());

    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]); 
    }

    selectedAmenities.forEach(amenityId => {
        formData.append('amenities', amenityId);
    });

    updateMutation.mutate(formData);
  };

  const isLoading = loadingSpace || loadingAllAmenities || loadingSpaceAmenities;

  if (isLoading) return <Spinner />;
  if (!space) return <div className="text-center p-10 text-red-500">Space not found.</div>;

  return (
    <div className="container mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Space</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">

        <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
            <input id="name" type="text" {...register('name')} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="address">Address</label>
            <input id="address" type="text" {...register('address')} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
        <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">Description</label>
            <textarea id="description" rows={4} {...register('description')} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
        <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="price_per_day">Price per Day (₹)</label>
            <input id="price_per_day" type="number" {...register('price_per_day')} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
        <div>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Change Image (Optional)</label>
          <input 
            id="image"
            type="file" 
            accept="image/*"
            {...register('image')} 
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <div className="my-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {allAmenities.map((amenity: Amenity) => (
                <label key={amenity._id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                        checked={selectedAmenities.has(amenity._id)}
                        onChange={() => handleAmenityChange(amenity._id)}
                    />
                    <span className="text-gray-700">{amenity.name}</span>
                </label>
            ))}
          </div>
        </div>

        <button 
            type="submit" 
            disabled={isSubmitting || updateMutation.isPending}
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50"
        >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditSpacePage;