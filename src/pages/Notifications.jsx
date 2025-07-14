import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaInfoCircle, FaShoppingCart, FaInbox, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const dummyAlerts = [
  {
    id: 1,
    type: 'system',
    title: 'Booking Confirmed',
    message: 'Your booking for the study room is confirmed.',
    timestamp: '2024-06-10 09:30 AM',
    read: false,
  },
  {
    id: 2,
    type: 'rentals',
    title: 'Item Returned',
    message: 'You have successfully returned the projector.',
    timestamp: '2024-06-09 05:12 PM',
    read: true,
  },
  {
    id: 3,
    type: 'listings',
    title: 'New Listing Approved',
    message: 'Your listing for "Canon DSLR" is now live.',
    timestamp: '2024-06-08 11:45 AM',
    read: false,
  },
];

const tabs = [
  { key: 'all', label: 'All', icon: <FaInbox className="inline mr-1" /> },
  { key: 'system', label: 'System', icon: <FaInfoCircle className="inline mr-1" /> },
  { key: 'rentals', label: 'Rentals', icon: <FaShoppingCart className="inline mr-1" /> },
  { key: 'listings', label: 'Listings', icon: <FaBell className="inline mr-1" /> },
];

const typeIcon = {
  system: <FaInfoCircle className="text-blue-500 dark:text-blue-300 w-7 h-7" />,
  rentals: <FaShoppingCart className="text-purple-500 dark:text-purple-300 w-7 h-7" />,
  listings: <FaBell className="text-yellow-500 dark:text-yellow-300 w-7 h-7" />,
};

const Notifications = () => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('all');
  const [alerts, setAlerts] = useState(dummyAlerts);

  const filteredAlerts =
    selectedTab === 'all' ? alerts : alerts.filter((a) => a.type === selectedTab);

  const handleMarkRead = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
      >
        <div className="flex flex-col items-center justify-center mt-2 mb-10">
          <div className="flex items-center gap-3">
            <FaBell className="text-purple-500 dark:text-purple-300 text-3xl" />
            <span className="text-3xl font-bold text-purple-700 dark:text-purple-300">Notifications</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-10 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors duration-200 text-sm focus:outline-none border
                ${selectedTab === tab.key
                  ? 'bg-purple-600 dark:bg-purple-700 text-white border-purple-600 dark:border-purple-700 shadow-glow'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700'}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        {/* Notification Cards */}
        <div className="grid gap-5 sm:grid-cols-1">
          <AnimatePresence>
            {filteredAlerts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <FaInbox className="text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                <div className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-2">No notifications found</div>
                <div className="text-sm text-gray-400 dark:text-gray-500">You're all caught up!</div>
              </motion.div>
            ) : (
              filteredAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl shadow-lg border transition-colors duration-200
                    bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800
                    ${!alert.read ? 'ring-2 ring-purple-200 dark:ring-purple-400' : ''}`}
                >
                  <div className="mt-1 flex-shrink-0 flex items-center justify-center">{typeIcon[alert.type] || <FaBell className="text-gray-400 w-7 h-7" />}</div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <span className={`font-semibold text-lg ${!alert.read ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-gray-200'}`}>{alert.title}</span>
                      {!alert.read && <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-xs text-purple-700 dark:text-purple-300">New</span>}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm mb-1 w-full">{alert.message}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 w-full">{alert.timestamp}</div>
                  </div>
                  <div className="flex items-center justify-end w-full sm:w-auto">
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-200
                        ${alert.read
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700'
                          : 'bg-purple-600 dark:bg-purple-700 text-white border-purple-600 dark:border-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800'}
                      `}
                    >
                      {alert.read ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications; 