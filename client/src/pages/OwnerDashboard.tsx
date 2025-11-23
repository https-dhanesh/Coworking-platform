import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOwnerBookings } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Spinner from '../components/Spinner';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

const OwnerDashboard = () => {

    const authContext = useContext(AuthContext);
    if (!authContext || authContext.user?.role !== 'owner') {
        return <div className="text-center p-10 text-red-500">Access Denied. Owner role required.</div>;
    }
    const userId = authContext.user?.id;
    const { data: bookings = [], isLoading, isError } = useQuery({
        queryKey: ['owner-bookings', userId],
        queryFn: getOwnerBookings,
        staleTime: 1000 * 60 * 5,
        enabled: !!userId
    });

    if (isLoading) return <Spinner />;
    if (isError) return <div className="text-center p-10 text-red-500">Failed to load booking history.</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Owner Dashboard</h1>
            <p className="text-gray-600 mb-8">Tracking bookings for your {bookings.length} reservations across all your spaces.</p>
            
            {bookings.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">No bookings received yet.</h2>
                 </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking: any) => (
                        <div key={booking._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{booking.space_id.name}</h3>
                                <p className="text-sm text-gray-500">Booked by: <span className="font-medium text-gray-700">{booking.user_id.username} ({booking.user_id.email})</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-md font-medium text-gray-700">
                                    {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                </p>
                                <p className="text-xl font-bold text-green-600">₹{booking.total_price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;