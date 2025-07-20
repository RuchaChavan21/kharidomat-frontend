import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaComments, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const BookOrRentItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, token } = useAuth();
  const { theme } = useTheme();

  // State for item details
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for booking form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Rental summary
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Determine if this is a 'rent' or 'book' route for UI text
  const isRentRoute = location.pathname.startsWith('/rent-now');

  // Fetch item details
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try real API first, fallback to mock if fails
        let data;
        try {
          const res = await fetch(`http://localhost:8080/api/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch item');
          data = await res.json();
        } catch {
          // fallback mock
          data = {
            id: itemId,
            title: 'MacBook Pro 2023',
            name: 'MacBook Pro 2023',
            description: 'Excellent condition MacBook Pro for programming and design work. Perfect for students and professionals.',
            imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
            pricePerDay: 200,
            category: 'Electronics',
            status: 'Available',
            owner: { name: 'John Doe', id: 'owner123' },
            location: 'MIT AOE Campus',
          };
        }
        setItem(data);
      } catch (err) {
        setError('Could not load item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, isLoggedIn, token, navigate]);

  // Calculate total days and price when dates change
  useEffect(() => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);
      setTotalPrice(diffDays * (item.pricePerDay || 0));
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, item]);

  // Validate dates
  const validateDates = () => {
    if (!startDate || !endDate) {
      return 'Please select both start and end dates.';
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      return 'Start date cannot be in the past.';
    }
    if (end < start) {
      return 'End date must be after start date.';
    }
    return null;
  };

  // Handle booking submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    const validationError = validateDates();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setShowPayment(true); // Show payment modal before booking
  };

  // Handle payment (mock)
  const handlePayment = async () => {
    setIsSubmitting(true);
    setPaymentSuccess(false);
    // Simulate payment delay
    setTimeout(async () => {
      setPaymentSuccess(true);
      setShowPayment(false);
      // Proceed with booking after payment
      try {
        // Try real API first, fallback to mock
        let ok = false;
        try {
          const res = await fetch('http://localhost:8080/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemId,
              startDate,
              endDate,
            }),
          });
          ok = res.ok;
        } catch {
          ok = true; // fallback for demo
        }
        if (!ok) throw new Error('Booking failed');
        setSuccess('Booking successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err) {
        setFormError('Booking failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  // Handle chat with owner (mock)
  const handleChat = async () => {
    if (!item?.owner?.id) {
      alert('Owner information not available for chat.');
      return;
    }
    // Optionally, call backend to start chat, then navigate
    // For now, just navigate to chat page
    navigate('/chat');
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading item...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 px-6 py-4 rounded shadow text-center">{error}</div>
      </div>
    );
  }
  if (!item) return null;

  // Use title or name for item
  const itemTitle = item.title || item.name;
  const ownerName = item.owner?.name || item.owner;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white py-12 px-4 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto card p-8 space-y-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={itemTitle} className="w-40 h-40 object-cover rounded-xl shadow" />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">{itemTitle}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Category: {item.category}</p>
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">₹{item.pricePerDay} <span className="text-sm font-normal text-gray-700 dark:text-gray-300">per day</span></p>
            {ownerName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Owner: {ownerName}</p>
            )}
            {item.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Location: {item.location}</p>
            )}
            {item.status && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status: {item.status}</p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleChat}
                className="btn-secondary flex items-center gap-2"
              >
                <FaComments className="text-purple-600 dark:text-purple-300" /> Chat with Owner
              </button>
            </div>
          </div>
        </div>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">{isRentRoute ? 'Rent this Item' : 'Book this Item'}</h3>
          {success && <div className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded text-center flex items-center justify-center gap-2"><FaCheckCircle className="text-green-500" />{success}</div>}
          {formError && <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2 rounded text-center">{formError}</div>}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="input-field"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="input-field"
                required
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          {(startDate && endDate) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-purple-50 dark:bg-gray-900 border border-purple-200 dark:border-purple-700 rounded-xl"
            >
              <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-4">Rental Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Rental Days:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Price per day:</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{item.pricePerDay}</span>
                </div>
                <div className="border-t border-purple-200 dark:border-purple-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-purple-900 dark:text-purple-200">Total Price:</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <FaCreditCard /> {isSubmitting ? (isRentRoute ? 'Renting...' : 'Booking...') : (isRentRoute ? 'Rent Now & Pay' : 'Book Now & Pay')}
          </button>
        </form>
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/items')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Items
          </button>
        </div>
      </div>
      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-100 dark:border-gray-700 text-center"
            >
              <FaCreditCard className="text-4xl text-purple-600 dark:text-purple-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Payment</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">Pay <span className="font-bold text-purple-600 dark:text-purple-300">₹{totalPrice}</span> for your booking.</p>
              <button
                className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                <FaCreditCard /> Pay Now
              </button>
              <button
                className="btn-secondary w-full"
                onClick={() => setShowPayment(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookOrRentItem;
