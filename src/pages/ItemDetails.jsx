import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ReviewSection from '../components/ReviewSection';
import API from '../services/api';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await API.get(`/items/${itemId}`);
        
        const itemData = response.data;
        setItem(itemData);
      } catch (err) {
        console.error('Error fetching item:', err);
        const errorMessage = err.response?.data?.message || 'Failed to fetch item details. Please try again.';
        setError(errorMessage);
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  // Wishlist check logic (like ItemCard)
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isLoggedIn || !item?.id || !user?.email) {
        setIsInWishlist(false);
        return;
      }
      try {
        const response = await API.get(`/users/wishlist/${user.email}`);
        const wishlistItems = response.data;
        const itemFound = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);
        setIsInWishlist(itemFound);
      } catch (error) {
        setIsInWishlist(false);
      }
    };
    checkWishlistStatus();
  }, [isLoggedIn, item?.id, user?.email]);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your wishlist!');
      navigate('/login');
      return;
    }
    if (!item?.id || !user?.email) {
      alert('Cannot update wishlist: Invalid item or user data.');
      return;
    }
    setWishlistLoading(true);
    try {
      let response;
      if (isInWishlist) {
        response = await API.post(`/users/wishlist/remove/${user.email}/${item.id}`);
      } else {
        response = await API.post(`/users/wishlist/add/${user.email}/${item.id}`);
      }
      if (response.status === 200 || response.status === 201) {
        const newState = !isInWishlist;
        setIsInWishlist(newState);
        setToastMessage(newState ? `${item.title} added to wishlist` : `${item.title} removed from wishlist`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to update wishlist');
      }
    } catch (error) {
      setToastMessage('Failed to update wishlist. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRentNow = () => {
    if (!isLoggedIn) {
      alert('Please log in to rent items!');
      navigate('/login');
    } else {
      navigate(`/rent-now/${itemId}`);
    }
  };

  const handleStartChat = async () => {
    if (!isLoggedIn) {
        alert('Please log in to start a chat!');
        navigate('/login');
        return;
    }
    // Check if the current user is trying to chat with themselves
    if (user && item && (user.email === item.ownerEmail || user.id === item.ownerId)) {
        alert("You cannot chat with yourself about your own item.");
        return;
    }
    if (!item?.ownerId) { // Ensure item and ownerId exist
        alert('Owner information not available for chat.');
        return;
    }

    try {
      const res = await API.post(`/chats/start/${item.ownerId}`);
      
      alert('Chat started!');
      navigate('/chat');
    } catch (error) {
      console.error('Failed to start chat:', error);
      const chatErrorMessage = error.response?.data?.message || 'Failed to start chat. Please try again.';
      alert(chatErrorMessage);
    }
  };

  // Function for adding to wishlist
  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your wishlist!');
      navigate('/login');
      return;
    }
    // TODO: Implement actual API call to add item to wishlist
    // For now, it's just an alert:
    alert(`Item "${item.title}" added to wishlist! (API integration for wishlist pending)`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Books': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Electronics': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Furniture': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Stationery': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Music': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'Sports': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      'Other': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
      'default': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[category] || colors.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Rented': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
      'Maintenance': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'default': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[status] || colors.default;
  };

  // Determine if the logged-in user is the owner of the item
  const isOwner = user && item && (user.email === item.ownerEmail || user.id === item.ownerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading item details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              Item Not Found
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/items')}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    // This case should ideally be caught by the error block above, but as a fallback
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-gray-600 dark:text-gray-300">No item data available.</p>
                <button
                    onClick={() => navigate('/items')}
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 mt-4"
                >
                    Back to Items
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Item Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center">
              {item.imageName ? (
                <img
                  src={`http://localhost:8080/api/items/image/${item.imageName}`}
                  alt={item.title}
                  className="w-full max-w-md h-64 sm:h-80 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full max-w-md h-64 sm:h-80 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg text-5xl text-gray-400 dark:text-gray-600">
                  <span role="img" aria-label="No Image">🖼️</span>
                </div>
              )}
            </div>
            {/* Removed image1, image2, ... gallery */}
          </motion.div>

          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="card p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{item.title}</h1>
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className="ml-2 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-60"
                      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {wishlistLoading ? (
                        <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : isInWishlist ? (
                        <FaHeart className="w-5 h-5 text-pink-500" />
                      ) : (
                        <FaRegHeart className="w-5 h-5 text-gray-400 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>{item.category}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">₹{item.pricePerDay}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">per day</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags && item.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Features */}
              {item.features && item.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {item.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Condition */}
              {item.condition && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Condition</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.condition}</p>
                </div>
              )}

              {/* Owner Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-8">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Posted by</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.owner || 'Unknown'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.ownerEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Posted on</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.postedDate ? item.postedDate : 'N/A'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end items-center">
                <button
                  onClick={handleRentNow}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto"
                >
                  Rent Now
                </button>
                <button
                  onClick={handleStartChat}
                  className="inline-flex items-center justify-center px-7 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto gap-2 text-base font-semibold"
                >
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07a1 1 0 01-1.22-1.22l1.07-4.28A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' /></svg>
                  Chat with Owner
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Review Section at the bottom */}
        {item && <ReviewSection itemId={item.id} />}
      </div>
      {/* Toast Notification for wishlist */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={showToast ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 max-w-sm text-gray-900 dark:text-gray-100 ${showToast ? '' : 'pointer-events-none'}`}
        style={{ display: showToast ? 'block' : 'none' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <p className="text-sm">{toastMessage}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ItemDetails;