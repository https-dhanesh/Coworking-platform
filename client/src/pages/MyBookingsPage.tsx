import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import type { Booking } from '../types';
import Spinner from '../components/Spinner';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

const MyBookingsPage = () => {

    const authContext = useContext(AuthContext);
    const userId = authContext?.user?.id;
    
    const { data: bookings = [], isLoading, isError } = useQuery({
        queryKey: ['user-bookings', userId],
        queryFn: getUserBookings,
        staleTime: 1000 * 60 * 5,
        enabled: !!userId
    });

    if (isLoading) return <Spinner />;
    if (isError) return <div className="text-center p-10 text-red-500">Failed to load bookings.</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
            
            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">You have no active bookings.</h2>
                    <p className="text-gray-500 mt-2">Start by exploring our spaces!</p>
                    <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                        &larr; Back to Spaces
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking: Booking) => (
                        <div key={booking._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                                    {booking.space_id.image_url && (
                                        <img src={booking.space_id.image_url} alt={booking.space_id.name} className="w-full h-full object-cover rounded-lg" />
                                    )}
                                </div>
                                <div>
                                    <Link to={`/spaces/${booking.space_id._id}`} className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                        {booking.space_id.name}
                                    </Link>
                                    <p className="text-sm text-gray-500">{booking.space_id.address}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">
                                    {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                </p>
                                <p className="text-2xl font-bold text-green-600 mt-1">₹{booking.total_price}</p>
                                <span className={`inline-block mt-1 px-3 py-1 text-xs rounded-full font-semibold ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {booking.status.toUpperCase()}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;