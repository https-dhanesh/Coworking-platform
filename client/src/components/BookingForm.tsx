import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../services/api';
import type { Space } from '../types';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { verifyPayment } from '../services/api';
import { loadRazorpayScript } from '../services/razorpay';

interface BookingFormProps {
    space: Space;
}

const BookingForm: React.FC<BookingFormProps> = ({ space }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const queryClient = useQueryClient();

    const displayRazorpay = async (order: any, bookingId: string, ownerId: string) => {
        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            toast.error('Razorpay SDK failed to load.');
            return;
        }

        const options = {
            key: 'rzp_test_9hVyKEnwkD04Gf',
            amount: order.amount,
            currency: order.currency,
            name: space.name,
            description: `Booking for ${space.name}`,
            order_id: order.id,
            handler: async (response: any) => {
                const verificationResult = await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: bookingId,
                });

                if (verificationResult.success) {
                    toast.success('Payment Successful! Booking confirmed.');
                    console.log(ownerId);
                    queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
                    queryClient.invalidateQueries({ queryKey: ['owner-bookings', ownerId] });
                } else {
                    toast.error('Payment failed verification.');
                }
            },
            prefill: {
            },
            theme: {
                color: "#3B82F6"
            }
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    const handleBooking = async () => {

        if (!startDate || !endDate || startDate >= endDate) {
            toast.error("Please select valid start and end dates.");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalPrice = diffDays * parseFloat(space.price_per_day);

        const bookingData = {
            spaceId: space._id,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            totalPrice: totalPrice,
        };

        createBookingMutation.mutate(bookingData);
    };

    const createBookingMutation = useMutation({
        mutationFn: (data: any) => createBooking(data),
        onSuccess: (newBookingResponse) => {
            displayRazorpay(newBookingResponse.order, newBookingResponse.booking._id, newBookingResponse.ownerId);
        },
        onError: (error) => {
            if (isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
                toast.error(`Error: ${error.response.data.error}`);
            } else {
                toast.error('Booking failed due to a server error.');
            }
            console.error(error);
        }
    });

    const diffTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    const diffDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    const totalPrice = diffDays * parseFloat(space.price_per_day);
    const isPending = createBookingMutation.isPending;

    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                <div>
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-700 block mb-1">End Date</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500"
                        disabled={isPending}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                <span className="text-gray-600">Total Price ({diffDays} Days)</span>
                <span className="text-xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
                onClick={handleBooking}
                disabled={isPending || diffDays === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
            >
                {isPending ? 'Processing Booking...' : 'Confirm & Pay (Simulated)'}
            </button>
        </div>
    );
};

export default BookingForm;