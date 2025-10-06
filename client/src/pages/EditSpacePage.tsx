import { useEffect, useState } from 'react'
import { getSpaceById, updateSpace, getAllAmenities, getAmenitiesForSpace, syncSpaceAmenities } from '../services/api'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import type { CreateSpaceFormData, Amenity } from '../types'
import toast from 'react-hot-toast'

const EditSpacePage = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset } = useForm<CreateSpaceFormData>();
    const navigate = useNavigate();

    const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchSpaceData = async () => {
            if (!id) return;
            try {
                const [space, spaceAmenities, masterAmenities] = await Promise.all([
                    getSpaceById(id),
                    getAmenitiesForSpace(id),
                    getAllAmenities(),
                ]);
                reset(space);
                setAllAmenities(masterAmenities);
                setSelectedAmenities(new Set(spaceAmenities.map((a: Amenity) => a.id)));
            } catch (error) {
                toast.error("Failed to load space data");
            }
        };
        fetchSpaceData();
    }, [id, reset]);

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

    const onSubmit = async (data: CreateSpaceFormData) => {
        if (!id) return;
        try {
            await Promise.all([
                updateSpace(id, data),
                syncSpaceAmenities(id, Array.from(selectedAmenities))
            ]);
            toast.success('Space update successfully');
            navigate(`/spaces/${id}`);
        } catch (err) {
            toast.error('Failed to update space.');
        }
    }

    return (
        <div className="container mx-auto max-w-2xl px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Space</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                <div><label>Name</label><input {...register('name')} className="w-full mt-1 border border-gray-300 rounded-md p-2" /></div>
                <div><label>Address</label><input {...register('address')} className="w-full mt-1 border border-gray-300 rounded-md p-2" /></div>
                <div><label>Description</label><textarea {...register('description')} className="w-full mt-1 border border-gray-300 rounded-md p-2" /></div>
                <div><label>Price per Day (₹)</label><input type="number" {...register('price_per_day')} className="w-full mt-1 border border-gray-300 rounded-md p-2" /></div>
                <div className="my-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {allAmenities.map(amenity => (
                            <label key={amenity.id} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                    checked={selectedAmenities.has(amenity.id)}
                                    onChange={() => handleAmenityChange(amenity.id)}
                                />
                                <span className="text-gray-700">{amenity.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
            </form>
        </div>
    );
};

export default EditSpacePage;