import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { user, isLoggedIn, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockBookings = [
    {
      id: 'BK001',
      itemName: 'MacBook Pro 2023',
      itemImage: 'https://via.placeholder.com/300x200?text=MacBook',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'ACTIVE',
      price: 200,
      owner: 'John Doe',
      totalAmount: 1000,
      createdAt: '2024-01-10'
    },
    {
      id: 'BK002',
      itemName: 'Tennis Racket',
      itemImage: 'https://via.placeholder.com/300x200?text=Tennis',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      status: 'COMPLETED',
      price: 50,
      owner: 'Jane Smith',
      totalAmount: 100,
      createdAt: '2024-01-08'
    },
    {
      id: 'BK003',
      itemName: 'Scientific Calculator',
      itemImage: 'https://via.placeholder.com/300x200?text=Calculator',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
      status: 'UPCOMING',
      price: 25,
      owner: 'Mike Johnson',
      totalAmount: 125,
      createdAt: '2024-01-20'
    },
    {
      id: 'BK004',
      itemName: 'DSLR Camera Kit',
      itemImage: 'https://via.placeholder.com/300x200?text=Camera',
      startDate: '2024-01-05',
      endDate: '2024-01-07',
      status: 'CANCELED',
      price: 150,
      owner: 'Sarah Wilson',
      totalAmount: 300,
      createdAt: '2024-01-03'
    },
    {
      id: 'BK005',
      itemName: 'Mountain Bike',
      itemImage: 'https://via.placeholder.com/300x200?text=Bike',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      status: 'ACTIVE',
      price: 80,
      owner: 'Alex Brown',
      totalAmount: 400,
      createdAt: '2024-01-28'
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // In production, use actual API call:
      // const response = await fetch('/api/bookings/my', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch bookings');
      // }
      // 
      // const data = await response.json();
      // setBookings(data);

      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setBookings(mockBookings);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmed) return;

    try {
      // In production, use actual API call:
      // const response = await fetch(`/api/bookings/cancel/${bookingId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to cancel booking');
      // }

      // For demo, update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'CANCELED' }
            : booking
        )
      );

      alert('Booking cancelled successfully!');
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
      console.error('Error canceling booking:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300', text: 'Active' },
      'COMPLETED': { color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300', text: 'Completed' },
      'UPCOMING': { color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300', text: 'Upcoming' },
      'CANCELED': { color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300', text: 'Canceled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200', text: status };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} transition-colors duration-300`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBookings = bookings
    .filter(booking => {
      const matchesFilter = filter === 'all' || booking.status === filter;
      const matchesSearch = booking.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your bookings.</p>
            <Link 
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookings 📋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage and track all your rental bookings
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg p-6 mb-8 transition-colors duration-300"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Items
              </label>
              <input
                type="text"
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              />
            </div>

            {/* Filter */}
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              >
                <option value="all">All Bookings</option>
                <option value="ACTIVE">Active</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center mb-8 transition-colors duration-300"
          >
            <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-4 px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-300"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {searchTerm || filter !== 'all' ? 'No matching bookings found' : 'No bookings yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start exploring items to make your first booking!'
                }
              </p>
              <Link
                to="/items"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Browse Items
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Item Info */}
                      <div className="flex gap-4 flex-1">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <img
                            src={booking.itemImage}
                            alt={booking.itemName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80?text=Item';
                            }}
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {booking.itemName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Owner: {booking.owner}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>📅 {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                            <span>💰 ₹{booking.price}/day</span>
                            <span>💳 Total: ₹{booking.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        {getStatusBadge(booking.status)}
                        <div className="flex gap-2">
                          <Link
                            to={`/booking/${booking.id}`}
                            className="px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition duration-300 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          {/* Chat with Owner button (if not owner) */}
                          {booking.owner && user && user.name !== booking.owner && (
                            <Link
                              to={`/chat?user=${encodeURIComponent(booking.owner)}`}
                              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 text-sm font-medium"
                            >
                              💬 Chat with Owner
                            </Link>
                          )}
                          {booking.status === 'ACTIVE' || booking.status === 'UPCOMING' ? (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-300 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Summary */}
        {filteredBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-600">{filteredBookings.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredBookings.filter(b => b.status === 'ACTIVE').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredBookings.filter(b => b.status === 'COMPLETED').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {filteredBookings.filter(b => b.status === 'CANCELED').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Canceled</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
