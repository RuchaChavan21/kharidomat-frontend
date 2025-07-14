import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { theme } = useTheme();
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // TODO: Replace with actual API call
        // const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const bookingData = await response.json();
        
        // Mock booking data for demonstration
        const mockBooking = {
          id: bookingId,
          item: {
            id: 'ITM001',
            title: 'MacBook Pro 2023 - 14-inch',
            imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
            category: 'Electronics',
            pricePerDay: 200
          },
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          status: 'ACTIVE',
          totalAmount: 6200,
          totalDays: 31,
          createdAt: '2024-01-10',
          owner: 'John Doe',
          ownerEmail: 'john.doe@mitaoe.ac.in',
          location: 'MIT AOE Campus',
          notes: 'Please handle with care. Return in the same condition.'
        };
        
        setBooking(mockBooking);
      } catch (err) {
        setError('Failed to fetch booking details. Please try again.');
        console.error('Error fetching booking:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, token]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setIsCancelling(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to cancel booking');
      // }

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setBooking(prev => ({ ...prev, status: 'CANCELLED' }));
      alert('Booking cancelled successfully!');
      
    } catch (err) {
      alert('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleExtendBooking = () => {
    // Navigate to extend booking page or show modal
    alert('Extend booking functionality coming soon!');
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700',
      'COMPLETED': 'bg-blue-100 text-blue-700',
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.default;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'ACTIVE': '✅',
      'CANCELLED': '❌',
      'COMPLETED': '✅',
      'PENDING': '⏳',
      'default': '❓'
    };
    return icons[status] || icons.default;
  };

  const isActiveAndNotExpired = () => {
    if (booking.status !== 'ACTIVE') return false;
    const today = new Date();
    const endDate = new Date(booking.endDate);
    return today <= endDate;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading booking details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              Booking Not Found
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  Booking Details
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>{getStatusIcon(booking.status)} {booking.status}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">Booking ID: {booking.id}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">Booked on: {formatDate(booking.createdAt)}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{booking.totalAmount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">Total ({booking.totalDays} days)</div>
              </div>
            </div>

            {/* Item Info */}
            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={booking.item.imageUrl}
                  alt={booking.item.title}
                  className="w-full h-48 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{booking.item.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{booking.item.category}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">Location: {booking.location}</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">Owner: {booking.owner} ({booking.ownerEmail})</div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">Price per day: <span className="font-semibold text-purple-600 dark:text-purple-400">₹{booking.item.pricePerDay}</span></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">Start: {formatDate(booking.startDate)}</span>
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">End: {formatDate(booking.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                <p className="text-gray-700 dark:text-gray-300">{booking.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4 justify-end">
              {booking.status === 'ACTIVE' && isActiveAndNotExpired() && (
                <button
                  onClick={handleExtendBooking}
                  disabled={isExtending}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 font-medium disabled:opacity-50"
                >
                  {isExtending ? 'Extending...' : 'Extend Booking'}
                </button>
              )}
              {booking.status === 'ACTIVE' && (
                <button
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-300 font-medium disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
              <button
                onClick={() => navigate('/my-bookings')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 font-medium"
              >
                Back to My Bookings
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDetails; 