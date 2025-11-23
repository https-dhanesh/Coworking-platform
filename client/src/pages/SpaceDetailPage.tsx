import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpaceById, getAmenitiesForSpace, getReviewsBySpace, submitReview } from '../services/api'; // Import new API functions
import type { Space, Amenity, Review } from '../types';
import Spinner from '../components/Spinner';
import BookingForm from '../components/BookingForm';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


interface ReviewFormData {
  rating: number;
  comment: string;
}

const SpaceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const authContext = useContext(AuthContext);
  const queryClient = useQueryClient();
  const userId = authContext?.user?.id; 

  const { register, handleSubmit, reset } = useForm<ReviewFormData>();

  const { data: space, isLoading: loadingSpace, isError: spaceError } = useQuery({
    queryKey: ['space', id],
    queryFn: () => getSpaceById(id as string),
    enabled: !!id,
  });

  const { data: amenitiesList = [] } = useQuery({
    queryKey: ['space-amenities', id],
    queryFn: () => getAmenitiesForSpace(id as string),
    enabled: !!id,
  });

  const { data: reviews = [], isLoading: loadingReviews, isError: reviewsError } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReviewsBySpace(id as string),
    enabled: !!id,
  });

  const reviewMutation = useMutation({
    mutationFn: (data: ReviewFormData) => submitReview({ ...data, spaceId: id }),
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      reset(); 
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
    onError: (error) => {
      if ((error as any).response?.status === 409) {
          return toast.error("You have already reviewed this space.");
      }
      toast.error('Failed to submit review.');
    },
  });

  const onSubmit = (data: ReviewFormData) => {
      if (!userId) {
          toast.error("Please log in to submit a review.");
          return;
      }
      reviewMutation.mutate(data);
  };

  const isLoading = loadingSpace || loadingReviews;
  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (spaceError || !space) return <div className="text-center p-10 text-red-500">Space not found.</div>;

  const hasReviewed = reviews.some((review: Review) => review.user_id._id === userId);
  const averageRating = reviews.length > 0 
      ? (reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

  return (
    <div className="container mx-auto px-6 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Spaces</Link>

      <div className="w-full h-96 rounded-xl shadow-lg overflow-hidden mb-8 bg-gray-200 relative">
        {space.image_url ? (
          <img src={space.image_url} alt={space.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">No Image Available</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{space.name}</h1>
          <p className="text-lg text-gray-600 mb-6 flex items-center">
              {space.address}
          </p>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">About this space</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {space.description || "No description provided."}
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
            {amenitiesList.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {amenitiesList.map((amenity: { _id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                  <span 
                    key={amenity._id} 
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific amenities listed.</p>
            )}
          </div>
        <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">User Reviews ({reviews.length})</h2>
                <div className="mb-6 flex items-center space-x-3">
                    <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className={star <= Math.round(parseFloat(averageRating as string)) ? 'text-yellow-400' : 'text-gray-300'} />
                        ))}
                    </div>
                    <span className="text-xl font-semibold text-gray-800">{averageRating}</span>
                    <span className="text-gray-500 text-sm">Average of {reviews.length} ratings</span>
                </div>
                {userId && !hasReviewed && (
                    <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Share your experience</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="rating" className="text-sm font-medium text-gray-700">Rating (1-5)</label>
                                <select 
                                    id="rating" 
                                    {...register('rating', { valueAsNumber: true, required: true, min: 1, max: 5 })}
                                    className="w-full mt-1 border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">Select a rating</option>
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comment (Optional)</label>
                                <textarea id="comment" rows={3} {...register('comment')} className="w-full mt-1 border border-gray-300 rounded-md p-2"/>
                            </div>

                            <button type="submit" disabled={reviewMutation.isPending} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50">
                                {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                )}
                
                {reviews.length > 0 && (
                    <div className="space-y-6">
                        {reviews.map((review: Review) => (
                            <div key={review._id} className="border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-800">{review.user_id.username}</p>
                                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex text-yellow-400 my-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <p className="text-gray-700 text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{space.price_per_day}</span>
              <span className="text-gray-500 mb-1">/ day</span>
            </div>
            
            <BookingForm space={space} />
            
            <p className="text-xs text-center text-gray-400 mt-4">
              You won't be charged yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetailPage;