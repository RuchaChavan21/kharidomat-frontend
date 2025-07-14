import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const RecentListings = () => {
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchListings();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with your actual API endpoint
      const response = await fetch('/api/listings/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError('Failed to fetch your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Access control
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const statusBadge = (status) => {
    if (status === 'Available') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Available</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Rented</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">My Recent Listings</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">All items you've posted for rent</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center mb-8 transition-colors duration-300">
            <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
            <button 
              onClick={fetchListings}
              className="mt-4 px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your listings...</p>
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No listings found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You haven't posted any items yet.</p>
            <button
              onClick={() => navigate('/post-item')}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Post an Item
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            <AnimatePresence>
              {listings.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.postDate).toLocaleDateString()}</span>
                    {statusBadge(item.status)}
                  </div>
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium">{item.category}</span>
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex items-end justify-between mt-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">₹{item.pricePerDay}/day</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecentListings; 