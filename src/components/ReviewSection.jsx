// src/components/ReviewSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import API from "../services/api"; // Use the configured Axios instance
import { useAuth } from "../context/AuthContext"; // To get the logged-in user

const ReviewSection = ({ itemId }) => {
  const { user, isLoggedIn } = useAuth(); // Get user from AuthContext
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This state will be determined by our new backend endpoint
  const [canAddReview, setCanAddReview] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // --- Form State ---
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Function to fetch all data for this section
  const fetchAllReviewData = async () => {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch reviews and eligibility status at the same time
      const reviewsPromise = API.get(`/reviews/${itemId}`);
      const canReviewPromise = isLoggedIn ? API.get(`/reviews/can-review/${itemId}`) : Promise.resolve({ data: { canReview: false } });

      const [reviewsResponse, canReviewResponse] = await Promise.all([reviewsPromise, canReviewPromise]);
      
      setReviews(reviewsResponse.data);
      setCanAddReview(canReviewResponse.data.canReview);

    } catch (err) {
      console.error("Failed to load review data:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviewData();
  }, [itemId, isLoggedIn]); // Refetch if the item or user changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (rating < 1) {
      setFormError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      // Use the correct POST endpoint and body
      await API.post(`/reviews/${itemId}`, { rating, comment });
      
      setRating(0);
      setComment("");
      setShowForm(false);
      
      // Refresh all review data to show the new review and update eligibility
      await fetchAllReviewData();

    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <section className="mt-12 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Reviews</h2>
      {loading ? (
        <div>Loading reviews...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-gray-500">No reviews yet.</div>
          ) : (
            reviews.map((review, idx) => (
              <motion.div
                key={review.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg p-4 border"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="font-bold text-gray-800">{review.user?.fullName || "User"}</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-800 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-400">{formatDate(review.localDateTime)}</p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* --- Add Review Button and Form (Conditionally Rendered) --- */}
      {canAddReview && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          + Add Your Review
        </button>
      )}

      {canAddReview && showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-gray-50 rounded-lg shadow p-6 border space-y-4"
        >
          <h3 className="text-xl font-bold">Write a review</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    className="focus:outline-none text-3xl"
                  >
                    <FaStar className={ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"} />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment</label>
            <textarea
              className="w-full rounded border border-gray-300 px-3 py-2 min-h-[80px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          {formError && <div className="text-red-600 text-sm">{formError}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </section>
  );
};

export default ReviewSection;