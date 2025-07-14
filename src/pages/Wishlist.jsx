import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { useTheme } from '../context/ThemeContext';

const Wishlist = () => {
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockWishlistItems = [
    {
      id: 'WL001',
      title: 'MacBook Pro 2023',
      description: 'Excellent condition MacBook Pro for programming and design work',
      imageUrl: 'https://via.placeholder.com/300x200?text=MacBook',
      pricePerDay: 200,
      category: 'Electronics',
      owner: 'John Doe',
      location: 'Campus Block A',
      rating: 4.8,
      totalReviews: 12
    },
    {
      id: 'WL002',
      title: 'DSLR Camera Kit',
      description: 'Professional photography kit with multiple lenses',
      imageUrl: 'https://via.placeholder.com/300x200?text=Camera',
      pricePerDay: 150,
      category: 'Electronics',
      owner: 'Sarah Wilson',
      location: 'Campus Block B',
      rating: 4.6,
      totalReviews: 8
    },
    {
      id: 'WL003',
      title: 'Mountain Bike',
      description: 'Perfect for campus commuting and weekend adventures',
      imageUrl: 'https://via.placeholder.com/300x200?text=Bike',
      pricePerDay: 80,
      category: 'Sports',
      owner: 'Mike Johnson',
      location: 'Campus Block C',
      rating: 4.9,
      totalReviews: 15
    }
  ];

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem('token');

      // In production, use actual API call:
      // const response = await fetch('/api/wishlist', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch wishlist');
      // }
      // 
      // const data = await response.json();
      // setWishlistItems(data);

      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setWishlistItems(mockWishlistItems);
    } catch (err) {
      setError('Failed to fetch wishlist. Please try again.');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');

      // In production, use actual API call:
      // const response = await fetch(`/api/wishlist/${itemId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to remove item from wishlist');
      // }

      // For demo, update local state
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item removed from wishlist successfully!');
    } catch (error) {
      alert('Failed to remove item from wishlist. Please try again.');
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your wishlist...</p>
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
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your wishlist.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Wishlist ❤️
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Items you've saved for later
          </p>
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
              onClick={fetchWishlist}
              className="mt-4 px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-300"
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
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300"
          >
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start exploring items and add them to your wishlist for easy access later!
            </p>
            <Link
              to="/items"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
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
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Total estimated cost: ₹{wishlistItems.reduce((sum, item) => sum + item.pricePerDay, 0)}/day
                  </p>
                </div>
                <Link
                  to="/items"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 text-sm font-medium"
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
                  >
                    <div className="relative">
                      <ItemCard item={item} />
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300 shadow-lg"
                        title="Remove from wishlist"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/items"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
                >
                  Browse All Items
                </Link>
                <button
                  onClick={() => {
                    // In production, implement bulk actions
                    alert('Bulk actions coming soon!');
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-medium"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 