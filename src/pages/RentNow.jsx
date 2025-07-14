import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const RentNow = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // TODO: Replace with actual API call
        // const response = await fetch(`http://localhost:8080/api/items/${itemId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const itemData = await response.json();
        
        // Mock item data for demonstration
        const mockItem = {
          id: itemId,
          title: 'MacBook Pro 2023',
          description: 'Excellent condition MacBook Pro for programming and design work. Perfect for students and professionals.',
          imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
          pricePerDay: 200,
          category: 'Electronics',
          status: 'Available',
          owner: 'John Doe',
          location: 'MIT AOE Campus'
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
  }, [itemId, token]);

  // Calculate total days and price when dates change
  useEffect(() => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
      
      setTotalDays(diffDays);
      setTotalPrice(diffDays * item.pricePerDay);
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
    
    if (end <= start) {
      return 'End date must be after start date.';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      const bookingData = {
        userId: user.id,
        itemId: itemId,
        startDate: startDate,
        endDate: endDate,
        status: "ACTIVE"
      };

      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:8080/api/bookings', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(bookingData),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create booking');
      // }

      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Booking confirmed successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Error creating booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Item Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{item.category}</p>
            </div>
            
            <div className="mb-6">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Price per day:</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400"> 4b9{item.pricePerDay}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Owner:</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.owner}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Location:</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.location}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium transition-colors duration-300">
                  {item.status}
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors duration-300">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                Book This Item
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Select your rental dates</p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <p className="text-green-700 font-medium">{success}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-red-700 font-medium">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                  required
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Rental Summary */}
              {(startDate && endDate) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-purple-50 border border-purple-200 rounded-xl"
                >
                  <h3 className="font-semibold text-purple-900 mb-4">Rental Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Days:</span>
                      <span className="font-medium text-gray-900">{totalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per day:</span>
                      <span className="font-medium text-gray-900">₹{item.pricePerDay}</span>
                    </div>
                    <div className="border-t border-purple-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-purple-900">Total Price:</span>
                        <span className="text-2xl font-bold text-purple-600">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !startDate || !endDate}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Confirming Booking...
                  </div>
                ) : (
                  'Confirm Booking'
                )}
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RentNow; 