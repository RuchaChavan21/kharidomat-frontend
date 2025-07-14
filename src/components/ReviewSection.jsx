import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ReviewSection = ({ itemId, userId }) => {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canAddReview, setCanAddReview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/reviews/item/${itemId}`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError('Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [itemId]);

  useEffect(() => {
    // Check if user can add review (has completed booking for this item and hasn't reviewed yet)
    const checkCanAddReview = async () => {
      if (!userId) return setCanAddReview(false);
      try {
        const res = await fetch(`http://localhost:8080/api/bookings/user/${userId}`);
        const bookings = await res.json();
        const today = new Date();
        const completed = bookings.some(
          b => b.itemId === itemId && b.status === 'COMPLETED' && new Date(b.endDate) < today
        );
        const alreadyReviewed = reviews.some(r => r.userId === userId);
        setCanAddReview(completed && !alreadyReviewed);
      } catch (err) {
        setCanAddReview(false);
      }
    };
    checkCanAddReview();
  }, [itemId, userId, reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (rating < 1 || rating > 5) {
      setFormError('Please select a rating.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please enter a comment.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          userId,
          rating,
          comment,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setRating(0);
      setComment('');
      setShowForm(false);
      // Refresh reviews
      const updated = await res.json();
      setReviews(prev => [...prev, updated]);
    } catch (err) {
      setFormError('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Reviews</h2>
      {loading ? (
        <div className="text-gray-500 dark:text-gray-400">Loading reviews...</div>
      ) : error ? (
        <div className="text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</div>
          ) : (
            reviews.map((review, idx) => (
              <motion.div
                key={review.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  {[1,2,3,4,5].map(star => (
                    <FaStar
                      key={star}
                      className={
                        star <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">{review.userName || 'User'}</span>
                </div>
                <div className="text-gray-800 dark:text-gray-100 mb-1">{review.comment}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
              </motion.div>
            ))
          )}
        </div>
      )}
      {/* Add Review Button and Form */}
      {canAddReview && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded transition"
        >
          + Add Review
        </button>
      )}
      {canAddReview && showForm && (
        <form onSubmit={handleSubmit} className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <FaStar className={star <= rating ? 'text-yellow-400 w-6 h-6' : 'text-gray-300 dark:text-gray-600 w-6 h-6'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Your Review</label>
            <textarea
              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 min-h-[80px] focus:outline-purple-500 transition-colors duration-300"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={500}
              required
            />
          </div>
          {formError && <div className="text-red-600 dark:text-red-400 text-sm">{formError}</div>}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded transition disabled:opacity-60"
            disabled={submitting || !rating || !comment.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </section>
  );
};

export default ReviewSection; 