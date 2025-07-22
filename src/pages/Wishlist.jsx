import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard'; // Assuming ItemCard will be styled consistently
import { useTheme } from '../context/ThemeContext';
import API from '../services/api'; // Ensure this is correctly configured

const Wishlist = () => {
  const { user, isLoggedIn, token } = useAuth(); // Access user and token
  const { theme } = useTheme();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize fetch function for useCallback dependency
  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn || !user?.email) { // Ensure logged in and user email is available
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Actual API call to get wishlist items for the logged-in user
      const response = await API.get(`/users/wishlist/${user.email}`);

      // Assuming API.get returns data directly (e.g., axios response.data)
      setWishlistItems(response.data);
    } catch (err) {
      setError('Failed to fetch wishlist. Please try again.');
      console.error('Error fetching wishlist:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user?.email]); // Dependencies for useCallback

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]); // Re-fetch when fetchWishlist changes (due to its dependencies)

  const handleRemoveFromWishlist = async (itemId) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this item from your wishlist?");
    if (!confirmRemove) return;

    if (!isLoggedIn || !user?.email) {
      alert("You must be logged in to remove items from your wishlist.");
      return;
    }

    try {
      // Actual API call to remove item from wishlist
      // Assuming your API.post sends a DELETE request if specified, or you'd use API.delete
      await API.post(`/users/wishlist/remove/${user.email}/${itemId}`);
      
      // Optimistically update the UI before re-fetching
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item removed from wishlist successfully!');

      // Optionally re-fetch to ensure data consistency, though optimistic update is often preferred
      // fetchWishlist();

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from wishlist. Please try again.';
      alert(`Error: ${errorMessage}`);
      console.error('Error removing from wishlist:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 border-2 border-[#D32F2F]">
          <h1 className="text-2xl font-extrabold uppercase text-[#D32F2F] mb-4 tracking-wide">Access Denied</h1>
          <p className="text-gray-700 mb-6 font-medium text-lg">Please log in to view your wishlist.</p>
          <Link
            to="/login"
            className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-[#fff3f3] rounded-xl shadow-md border-2 border-[#D32F2F] text-center"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">
            My Wishlist ❤️
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Items you've saved for later
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="font-medium text-center sm:text-left">{error}</p>
            <button
              onClick={fetchWishlist}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 uppercase text-sm font-bold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-[#D32F2F]"
          >
            <div className="text-6xl mb-4 text-[#D32F2F]">❤️</div>
            <h3 className="text-xl font-extrabold uppercase text-[#222] mb-2 tracking-wide">
              Your wishlist is empty
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Start exploring items and add them to your wishlist for easy access later!
            </p>
            <Link
              to="/items"
              className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
            >
              Browse Items
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Wishlist Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D32F2F]"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-extrabold uppercase text-[#222]">
                    {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                  </h3>
                  <p className="text-gray-700 text-sm font-medium">
                    Total estimated cost: <span className="font-bold text-[#D32F2F]">₹{wishlistItems.reduce((sum, item) => sum + (item.pricePerDay || 0), 0)}/day</span>
                  </p>
                </div>
                <Link
                  to="/items"
                  className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow-md text-sm uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 whitespace-nowrap"
                >
                  Browse More Items
                </Link>
              </div>
            </motion.div>

            {/* Wishlist Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="relative bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] hover:shadow-xl transition-all duration-300"
                  >
                    <ItemCard item={item} /> {/* ItemCard needs to be styled according to theme internally */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                      title="Remove from wishlist"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D32F2F]"
            >
              <h3 className="text-lg font-extrabold uppercase text-[#222] mb-4 tracking-wide">Quick Actions</h3>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <Link
                  to="/items"
                  className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow-md text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 whitespace-nowrap"
                >
                  Browse All Items
                </Link>
                {/* Implement Clear All via API if needed:
                <button
                  onClick={() => {
                    // Logic to call API to clear all wishlist items
                    // e.g., API.post(`/users/wishlist/clear/${user.email}`);
                    alert('Clear All functionality coming soon!');
                  }}
                  className="bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-lg shadow-md text-base uppercase border-2 border-gray-200 hover:bg-gray-300 transition-all duration-200 whitespace-nowrap"
                >
                  Clear All
                </button>
                */}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;