import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const [stats, setStats] = useState({
    myBookings: 8,
    itemsPosted: 5,
    activeListings: 3
  });

  const [recentBookings] = useState([
    {
      id: 1,
      itemName: 'MacBook Pro 2023',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'ACTIVE',
      price: 200
    },
    {
      id: 2,
      itemName: 'Tennis Racket',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      status: 'COMPLETED',
      price: 50
    },
    {
      id: 3,
      itemName: 'Scientific Calculator',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
      status: 'UPCOMING',
      price: 25
    }
  ]);

  const [recentItems] = useState([
    {
      id: 1,
      title: 'DSLR Camera Kit',
      category: 'Electronics',
      price: 150,
      status: 'Available',
      postedDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Mountain Bike',
      category: 'Sports',
      price: 80,
      status: 'Rented',
      postedDate: '2024-01-18'
    },
    {
      id: 3,
      title: 'Study Table & Chair',
      category: 'Furniture',
      price: 100,
      status: 'Available',
      postedDate: '2024-01-15'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300', text: 'Active' },
      'COMPLETED': { color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300', text: 'Completed' },
      'UPCOMING': { color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300', text: 'Upcoming' },
      'CANCELED': { color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300', text: 'Canceled' },
      'Available': { color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300', text: 'Available' },
      'Rented': { color: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300', text: 'Rented' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200', text: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} transition-colors duration-300`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
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
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to access your dashboard.</p>
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


        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            {
              title: 'My Bookings',
              value: stats.myBookings,
              icon: '\ud83d\udccb',
              color: 'bg-purple-500',
              description: 'Total bookings made'
            },
            {
              title: 'Items Posted',
              value: stats.itemsPosted,
              icon: '\ud83d\udce6',
              color: 'bg-blue-500',
              description: 'Items you\'ve listed'
            },
            {
              title: 'Active Listings',
              value: stats.activeListings,
              icon: '\u2705',
              color: 'bg-green-500',
              description: 'Currently available'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-xl`}>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              title: '\ud83d\udce6 Post New Item',
              description: 'List an item for rent',
              link: '/post-item',
              color: 'bg-purple-600 hover:bg-purple-700'
            },
            {
              title: '\ud83d\udcd8 View My Bookings',
              description: 'Manage your rentals',
              link: '/my-bookings',
              color: 'bg-blue-600 hover:bg-blue-700'
            },
            {
              title: '\ud83d\uded2 Browse Items',
              description: 'Find items to rent',
              link: '/items',
              color: 'bg-green-600 hover:bg-green-700'
            }
          ].map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.link}
                className={`${action.color} text-white rounded-xl p-6 block shadow-lg transition duration-300`}
              >
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-purple-100">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
              <Link
                to="/my-bookings"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{booking.itemName}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {booking.startDate} - {booking.endDate}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">₹{booking.price}/day</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(booking.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Items Posted */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Listings</h2>
              <Link
                to="/recent-listings"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.category}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Posted: {item.postedDate}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-medium text-gray-900 dark:text-white">₹{item.price}/day</p>
                    {getStatusBadge(item.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.myBookings}</p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.itemsPosted}</p>
              <p className="text-sm text-gray-600">Items Posted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.activeListings}</p>
              <p className="text-sm text-gray-600">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">₹12,450</p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
