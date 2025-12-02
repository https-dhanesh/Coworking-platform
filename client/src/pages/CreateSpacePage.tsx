import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createSpace, getAllAmenities } from "../services/api";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Amenity, CreateSpaceFormData } from "../types";
import { useState } from "react";

const CreateSpacePage = () => {
    const { register, handleSubmit , formState: { isSubmitting } } = useForm<CreateSpaceFormData>();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

     const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
    const { data: allAmenities = [] } = useQuery({
        queryKey: ['amenities'],
        queryFn: getAllAmenities,
    });

    const createSpaceMutation = useMutation({
        mutationFn: (data: FormData) => createSpace(data),
        onSuccess: (newSpace) => {
            queryClient.invalidateQueries({ queryKey: ['spaces'] });
            queryClient.invalidateQueries({ queryKey: ['my-spaces'] });
            
            toast.success("Space created successfully");
            navigate(`/spaces/${newSpace._id}`);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to Create Space.");
        },
    });

    const handleAmenityChange = (amenityId: string) => {
        setSelectedAmenities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(amenityId)) newSet.delete(amenityId);
            else newSet.add(amenityId);
            return newSet;
        });
    };

    const onSubmit = async (data: any) => {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('address', data.address);
            formData.append('price_per_day', data.price_per_day.toString());
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            }
            selectedAmenities.forEach(id => {
                formData.append('amenities', id);
            });
            createSpaceMutation.mutate(formData);
    }

    return (
        <div className="container mx-auto max-w-2xl px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Space</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" {...register('name')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input id="address" type="text" {...register('address')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" {...register('description')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="price_per_day">Price per Day (₹)</label>
                    <input id="price_per_day" type="number" {...register('price_per_day')} className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="image">Image</label>
                    <input
                        id="image"
                        type="file"
                        {...register('image')}
                        className="w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-3">Amenities</label>
                    <div className="grid grid-cols-2 gap-3">
                        {allAmenities.map((amenity: Amenity) => (
                            <label key={amenity._id} className="flex items-center space-x-3 cursor-pointer">
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
                </div>
                <button 
                    type="submit" 
                    disabled={isSubmitting || createSpaceMutation.isPending} 
                    className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {createSpaceMutation.isPending ? 'Creating...' : 'Create Space'}
                </button>
            </form>
        </div>
    )
}

export default CreateSpacePage;