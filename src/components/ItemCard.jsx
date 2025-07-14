import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ItemCard = ({ item }) => {
  const { isLoggedIn, token: contextToken, user: contextUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Helper to get token/user from context or localStorage
  const getAuth = () => {
    let token = contextToken;
    let user = contextUser;
    if (!token) {
      token = localStorage.getItem('token');
    }
    if (!user) {
      try {
        user = JSON.parse(localStorage.getItem('user'));
      } catch {
        user = null;
      }
    }
    return { token, user };
  };

  // Check if item is in wishlist on component mount
  useEffect(() => {
    if (isLoggedIn && item.id) {
      checkWishlistStatus();
    }
    // eslint-disable-next-line
  }, [item.id, isLoggedIn]);

  const checkWishlistStatus = async () => {
    try {
      const { token } = getAuth();
      if (!token || !item.id) return;
      const response = await fetch(`/api/wishlist/check/${item.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.isInWishlist);
      } else {
        setIsInWishlist(false);
      }
    } catch (error) {
      setIsInWishlist(false);
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    const { token } = getAuth();
    if (!token) {
      alert('Please log in to add items to your wishlist!');
      navigate('/login');
      return;
    }
    try {
      setIsWishlistLoading(true);
      if (!item.id) {
        alert('Invalid item.');
        return;
      }
      // Call backend toggle endpoint
      const response = await fetch(`/api/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: item.id }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setToastMessage('Session expired. Please log in again.');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          navigate('/login');
          return;
        }
        throw new Error('Failed to update wishlist');
      }
      const data = await response.json();
      setIsInWishlist(data.isInWishlist); // backend should return new state
      setToastMessage(data.message || (data.isInWishlist ? `${item.title} added to wishlist` : `${item.title} removed from wishlist`));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage('Failed to update wishlist. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error('Error updating wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleRent = () => {
    if (!isLoggedIn) {
      alert('Please log in to rent items!');
      navigate('/login');
    } else {
      navigate(`/rent-now/${item.id}`);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'bg-accent-100 text-accent-700',
      'Stationery': 'bg-mint-100 text-mint-700',
      'Music': 'bg-purple-100 text-purple-700',
      'Sports': 'bg-orange-100 text-orange-700',
      'Books': 'bg-purple-100 text-purple-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.default;
  };

  return (
    <>
      <motion.div
        className="card group overflow-hidden relative bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 transition-colors duration-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Wishlist Heart Icon */}
        <motion.button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {isWishlistLoading ? (
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          ) : isInWishlist ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200" />
          )}
        </motion.button>

        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Category Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)} bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 transition-colors duration-300`}>
            {item.category}
          </div>

          {/* Price Badge - Moved to avoid overlap with heart icon */}
          <div className="absolute top-3 right-12 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-purple-600 dark:text-purple-300 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            ₹{item.pricePerDay}/day
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button
              onClick={handleRent}
              className="bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-purple-600 dark:hover:bg-purple-700 hover:text-white transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
            >
              Rent Now
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
            {item.title}
          </h3>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.category}</p>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{item.pricePerDay}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per day</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                if (!item.id && item.id !== 0) {
                  console.warn('Invalid item id for View Details:', item);
                  return;
                }
                navigate(`/item/${String(item.id)}`);
              }}
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
                shadow
                bg-white text-purple-600 border-purple-500 hover:bg-purple-600 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-500
                dark:bg-purple-600 dark:text-white dark:border-transparent dark:shadow-md dark:hover:bg-purple-700 dark:focus-visible:ring-2 dark:focus-visible:ring-purple-400
              `}
            >
              View Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={handleRent}
              className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-glow hover:shadow-glow-lg border border-purple-700 dark:border-purple-800"
            >
              Rent Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 z-50 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-700">{toastMessage}</p>
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ItemCard;