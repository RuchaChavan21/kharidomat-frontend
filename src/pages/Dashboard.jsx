import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaMoneyBill, FaList, FaWallet, FaHeart, FaBars } from 'react-icons/fa';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const CARD_CONFIG = [
  {
    key: 'totalBookingsMade',
    label: 'Total Bookings Made',
    icon: FaBook,
    button: 'View Bookings',
    to: '/my-bookings',
    aria: 'View all bookings',
  },
  {
    key: 'totalAmountSpent',
    label: 'Total Amount Spent',
    icon: FaMoneyBill,
    button: 'Payment History',
    to: '/payments',
    aria: 'View payment history',
    isCurrency: true,
  },
  {
    key: 'totalListingsOwned',
    label: 'Total Listings Owned',
    icon: FaList,
    button: 'My Listings',
    to: '/recent-listings',
    aria: 'View my listings',
  },
  {
    key: 'totalAmountEarned',
    label: 'Total Amount Earned',
    icon: FaWallet,
    button: 'Earnings',
    to: '/EarningsBreakdown',
    aria: 'View earnings',
    isCurrency: true,
  },
  {
    key: 'totalWishlistItems',
    label: 'Total Wishlist Items',
    icon: FaHeart,
    button: 'Go to Wishlist',
    to: '/wishlist',
    aria: 'Go to wishlist',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 80 },
  }),
};

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user?.id || !token) {
      setError('User authentication missing. Please log in again.');
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const url = `/dashboard/stats/${user.id}`;
        const headers = { Authorization: `Bearer ${token}` };
        const response = await API.get(url, { headers });
        setStats(response.data);
    } catch (err) {
        console.error('[Dashboard] API error:', err);
        setError('Failed to load dashboard stats. Please try again later.');
    } finally {
      setLoading(false);
    }
    };
    fetchStats();
  }, [user, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F]" aria-label="Loading"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Floating toggle button always visible */}
              <button
        className="fixed top-4 left-4 z-50 bg-[#fff3f3] border border-gray-200 rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <FaBars className="text-[#D32F2F] text-2xl" />
              </button>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar/Header - always visible */}
        <header className="w-full flex items-center h-16 px-4 border-b border-gray-100 bg-white shadow-sm">
          <span className="ml-4 text-lg font-bold">Dashboard</span>
        </header>
        {/* Welcome Banner */}
        <div className="w-full bg-gradient-to-r from-[#fff3f3] to-[#ffeaea] rounded-xl shadow p-4 mt-8 mb-6 mx-auto max-w-6xl flex flex-col items-start gap-1">
          <div className="text-xl font-bold text-[#D32F2F]">Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!</div>
          <div className="text-gray-500 text-base font-medium">Here’s your CampusRent summary</div>
                  </div>
        <main className="flex-1 py-6 px-4 transition-all duration-300 ease-in-out">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 font-sans text-left">Dashboard</h1>
            {!stats ? (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-6 text-center font-medium">
                No dashboard data available.
                      </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                  {CARD_CONFIG.slice(0, 3).map((card, i) => {
                    const value = stats?.[card.key] ?? 0;
                    const formattedValue = card.isCurrency ? `₹${value.toLocaleString()}` : value;
                    const Icon = card.icon;
                    const iconColor = card.key === 'totalBookingsMade' ? 'text-[#D32F2F]' :
                                      card.key === 'totalAmountEarned' ? 'text-green-600' :
                                      card.key === 'totalAmountSpent' ? 'text-blue-600' :
                                      card.key === 'totalListingsOwned' ? 'text-indigo-600' :
                                      card.key === 'totalWishlistItems' ? 'text-pink-500' : 'text-[#D32F2F]';
                    return (
                      <motion.div
                        key={card.key}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.05 }}
                        className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 flex flex-col items-center p-7 text-center group min-w-0"
                      >
                        <Icon
                          className={`text-4xl mb-4 drop-shadow ${iconColor}`}
                          aria-hidden="true"
                        />
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">{formattedValue}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">{card.label}</div>
                        <Link
                          to={card.to}
                          className="mt-auto inline-block bg-[#D32F2F] text-white font-bold rounded-lg px-5 py-2 text-sm transition-all duration-200 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 shadow"
                          aria-label={card.aria}
                        >
                          {card.button}
                        </Link>
                      </motion.div>
                    );
                  })}
                    </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
                  {CARD_CONFIG.slice(3).map((card, i) => {
                    const value = stats?.[card.key] ?? 0;
                    const formattedValue = card.isCurrency ? `₹${value.toLocaleString()}` : value;
                    const Icon = card.icon;
                    const iconColor = card.key === 'totalBookingsMade' ? 'text-[#D32F2F]' :
                                      card.key === 'totalAmountEarned' ? 'text-green-600' :
                                      card.key === 'totalAmountSpent' ? 'text-blue-600' :
                                      card.key === 'totalListingsOwned' ? 'text-indigo-600' :
                                      card.key === 'totalWishlistItems' ? 'text-pink-500' : 'text-[#D32F2F]';
                    return (
                      <motion.div
                        key={card.key}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.05 }}
                        className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 flex flex-col items-center p-7 text-center group min-w-0"
                      >
                        <Icon
                          className={`text-4xl mb-4 drop-shadow ${iconColor}`}
                          aria-hidden="true"
                        />
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">{formattedValue}</div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">{card.label}</div>
                        <Link
                          to={card.to}
                          className="mt-auto inline-block bg-[#D32F2F] text-white font-bold rounded-lg px-5 py-2 text-sm transition-all duration-200 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 shadow"
                          aria-label={card.aria}
                        >
                          {card.button}
                        </Link>
                      </motion.div>
                    );
                  })}
                  </div>
                </>
              )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;