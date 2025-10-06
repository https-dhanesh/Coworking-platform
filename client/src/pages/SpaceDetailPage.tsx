import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpaceById, getAmenitiesForSpace } from '../services/api';
import { type Amenity, type Space } from '../types';

const SpaceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [space, setSpace] = useState<Space | null>(null);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSpace = async () => {
            if (!id) return;
            try {
                const [spaceData, amenitiesData] = await Promise.all([getSpaceById(id), getAmenitiesForSpace(id)])
                setSpace(spaceData);
                setAmenities(amenitiesData);
            } catch (error) {
                console.error('Failed to fetch space details : ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpace();
    }, [id]);

    if (isLoading) return <div className='text-center p-10'>Loading...</div>
    if (!space) return <div className='text-center p-10'>Space not Found...</div>

    return (
        <div className='container mx-auto px-6 py-8'>
            {space.image_url && (
                <div className="w-full h-96 rounded-lg shadow-lg overflow-hidden mb-8 bg-gray-200">
                    <img src={space.image_url} alt={space.name} className="w-full h-full object-cover" />
                </div>
            )}
            <h1 className="pl-2 text-4xl font-bold text-gray-800 mb-4">{space.name}</h1>
            <p className="pl-2 text-lg text-gray-600 mb-6">{space.address}</p>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-700 mb-4">{space.description}</p>
                <div className="my-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map(amenity => (
                            <span key={amenity.id} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                {amenity.name}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{space.price_per_day} / day</p>
            </div>
        </div>
    )
}
export default SpaceDetailPage;