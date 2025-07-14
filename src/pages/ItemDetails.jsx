import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ReviewSection from '../components/ReviewSection';

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, token } = useAuth();
  
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // TODO: Replace with actual API call
        // const response = await fetch(`http://localhost:8080/api/items/${itemId}`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const itemData = await response.json();
        
        // Mock item data for demonstration
        const mockItem = {
          id: itemId,
          title: 'MacBook Pro 2023 - 14-inch',
          description: 'Excellent condition MacBook Pro with M2 Pro chip, 16GB RAM, and 512GB SSD. Perfect for programming, design work, and academic projects. Includes original charger and protective case. No scratches or dents, maintained in pristine condition.',
          imageUrl: 'https://via.placeholder.com/600x400?text=MacBook+Pro',
          pricePerDay: 200,
          category: 'Electronics',
          status: 'Available',
          owner: 'John Doe',
          ownerEmail: 'john.doe@mitaoe.ac.in',
          location: 'MIT AOE Campus',
          postedDate: '2024-01-15',
          stock: 1,
          features: [
            'M2 Pro Chip',
            '16GB Unified Memory',
            '512GB SSD Storage',
            '14-inch Liquid Retina XDR Display',
            'Original Charger Included',
            'Protective Case'
          ],
          condition: 'Excellent',
          tags: ['Laptop', 'Programming', 'Design', 'Student-Friendly']
        };
        
        setItem(mockItem);
      } catch (err) {
        setError('Failed to fetch item details. Please try again.');
        console.error('Error fetching item:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleRentNow = () => {
    if (!isLoggedIn) {
      alert('Please log in to rent items!');
      navigate('/login');
    } else {
      navigate(`/rent-now/${itemId}`);
    }
  };

  const handleStartChat = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/chats/start/${item.ownerId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('Chat started!');
        navigate('/chat');
      } else {
        alert('Failed to start chat.');
      }
    } catch (error) {
      console.error('Failed to start chat', error);
      alert('Failed to start chat.');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'bg-blue-100 text-blue-700',
      'Stationery': 'bg-green-100 text-green-700',
      'Music': 'bg-purple-100 text-purple-700',
      'Sports': 'bg-orange-100 text-orange-700',
      'Books': 'bg-purple-100 text-purple-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-700',
      'Rented': 'bg-red-100 text-red-700',
      'Maintenance': 'bg-yellow-100 text-yellow-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.default;
  };

  const isOwner = user && (user.email === item.ownerEmail || user.name === item.owner);

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
              className="btn-primary"
            >
              Back to Items
            </button>
          </div>
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
            <div className="card p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-96 object-cover rounded-xl shadow-md"
              />
            </div>
            {/* Image Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <span className="text-gray-400 dark:text-gray-500 text-sm">Image {index}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="card p-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>
                      {item.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹{item.pricePerDay}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">per day</div>
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
              {item.features && (
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Posted by</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.owner}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.ownerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">Posted on</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.postedDate}</p>
                </div>
              </div>

              {/* Rent Now Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end items-center">
                <button
                  onClick={handleRentNow}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Rent Now
                </button>
                {/* Chat with Owner Button (if not owner) */}
                {isLoggedIn && item.ownerId !== user?.id && (
                  <button
                    onClick={handleStartChat}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                  >
                    💬 Chat with Owner
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Review Section at the bottom */}
        {item && <ReviewSection itemId={item.id} />}
      </div>
    </div>
  );
};

export default ItemDetails; 