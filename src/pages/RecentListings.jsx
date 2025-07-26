import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api';

const RecentListings = () => {
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const fetchListings = useCallback(async () => {
    if (!isLoggedIn || !token || !user?.email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/items/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch your listings. Please try again.';
      setError(errorMessage);
      console.error('Error fetching listings:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token, user?.email]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchListings();
    }
  }, [isLoggedIn, navigate, fetchListings]);

  const handleDeleteItem = useCallback(async (itemIdToDelete) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await API.delete(`/items/${itemIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 || response.status === 204) {
        alert('Item deleted successfully!');
        fetchListings();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
      console.error('Error deleting item:', err.response?.data || err.message);
    }
  }, [token, fetchListings]);

  // Card status badge
  const getStatusBadge = (status) => {
    const config = {
      AVAILABLE: 'bg-green-100 text-green-800 border-green-300',
      BOOKED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      UNAVAILABLE: 'bg-red-100 text-red-800 border-red-300',
    };
    const c = config[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${c}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F]"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="bg-red-100 border border-red-300 text-red-700 p-6 rounded-xl shadow-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4"> 
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-white rounded-xl">
        {/* Header Bar with Title and Back Button */}
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">My Listings</h1>
            <p className="text-gray-700 text-lg font-medium">Manage your posted rental items here</p>
          </motion.div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-red-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
        {/* Listings Grid or Empty State */}
        {listings.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 border-2 border-[#D32F2F] rounded-xl shadow-md p-12 text-center flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🗂️</div>
            <h2 className="text-xl font-bold mb-2">No listings found</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Looks like you haven't posted any items yet.</p>
            <button
              onClick={() => navigate('/post-item')}
              className="px-8 py-4 bg-[#D32F2F] text-white font-bold rounded-lg text-lg hover:bg-white hover:text-[#D32F2F] border-2 border-[#D32F2F] transition-all duration-200"
            >
              + Post an Item
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <AnimatePresence>
              {listings.map((item, idx) => {
                const itemImageUrl = item.imageName
                  ? `http://localhost:8080/api/items/image/${item.imageName}`
                  : "https://via.placeholder.com/128x128?text=No+Image";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white border-2 border-[#D32F2F] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border mb-4">
                        <img
                          src={itemImageUrl}
                          alt={item.title || 'Listing'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-center truncate w-full">{item.title}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">{item.category || 'Uncategorized'}</div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-semibold text-[#D32F2F]">₹{item.pricePerDay} /day</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-full bg-red-500 text-white text-sm px-4 py-3 rounded-lg font-bold hover:bg-red-600 hover:shadow-lg border-2 border-red-500 hover:border-red-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        🗑️ Delete Item
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecentListings;