import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../api/index';
import { useSelector } from 'react-redux';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ReviewSection = ({ courseId, courseData }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.getCourseReviews(courseId);
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    const handleCommentChange = (e) => {
        setNewReview({ ...newReview, comment: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please log in to leave a review.',
                icon: 'warning',
                confirmButtonColor: '#3baee9'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await apiClient.createReview(courseId, newReview);
            setNewReview({ rating: 5, comment: '' });
            fetchReviews(); // Refresh reviews
            Swal.fire({
                title: 'Review Posted!',
                text: 'Thank you for your feedback.',
                icon: 'success',
                confirmButtonColor: '#3baee9'
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            Swal.fire({
                title: 'Submission Failed',
                text: error.message || 'Failed to submit review.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? (
                    <FaStar key={i} className="text-yellow-400" />
                ) : (
                    <FaRegStar key={i} className="text-gray-300" />
                )
            );
        }
        return stars;
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0) / reviews.length).toFixed(1)
        : (courseData?.rating || 0).toFixed(1);

    const totalReviewCount = reviews.length > 0 ? reviews.length : (courseData?.reviews_count || 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 bg-white  shadow-sm border border-gray-100 my-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Rating Summary */}
                <div className="lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                    <div className="flex items-center gap-6 mb-8 bg-blue-50/50 p-6 rounded-2xl">
                        <div className="text-6xl font-extrabold text-primary">
                            {averageRating}
                        </div>
                        <div>
                            <div className="flex gap-1 text-xl mb-1">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <div className="text-gray-500 font-medium">
                                {totalReviewCount} total reviews
                            </div>
                        </div>
                    </div>

                    {/* Rating Bars (Mock for UI perfection) */}
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.filter(r => Math.round(r.rating) === star).length;
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-4 group">
                                    <div className="w-12 text-sm font-bold text-gray-700">{star} stars</div>
                                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-10 text-right text-xs font-bold text-gray-400">{Math.round(percentage)}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reviews List & Form */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Review Form */}
                    {isAuthenticated && (
                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                Leave a Review
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">How would you rate this course?</label>
                                    <div className="flex gap-3 text-3xl">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => handleRatingChange(s)}
                                                className="hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                {s <= newReview.rating ? (
                                                    <FaStar className="text-yellow-400" />
                                                ) : (
                                                    <FaRegStar className="text-gray-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Write your review</label>
                                    <textarea
                                        value={newReview.comment}
                                        onChange={handleCommentChange}
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none font-medium h-32"
                                        placeholder="Describe your experience with this course..."
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-primary-dark cursor-pointer hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
                            <span>All Reviews ({totalReviewCount})</span>
                        </h3>

                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review, index) => (
                                    <div key={index} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                    {review.user?.avatar ? (
                                                        <img src={review.user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                                    ) : (
                                                        <FaUserCircle className="w-10 h-10 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{review.user?.name || 'Student'}</div>
                                                    <div className="text-xs text-gray-400 font-medium">
                                                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recent'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 text-sm">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed font-medium pl-1 gap-1">
                                            {review.comment || review.review}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
