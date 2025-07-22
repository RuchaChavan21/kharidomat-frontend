import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaInfoCircle, FaShoppingCart, FaInbox } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const dummyAlerts = [
  { id: 1, type: 'system', title: 'Booking Confirmed', message: 'Your booking for the study room is confirmed.', timestamp: '2024-06-10 09:30 AM', read: false },
  { id: 2, type: 'rentals', title: 'Item Returned', message: 'You have successfully returned the projector.', timestamp: '2024-06-09 05:12 PM', read: true },
  { id: 3, type: 'listings', title: 'New Listing Approved', message: 'Your listing for "Canon DSLR" is now live.', timestamp: '2024-06-08 11:45 AM', read: false },
  { id: 4, type: 'system', title: 'Profile Update Required', message: 'Please update your student ID verification soon.', timestamp: '2024-06-07 02:00 PM', read: false },
  { id: 5, type: 'rentals', title: 'Rental Due Soon', message: 'Your "MacBook Pro" rental is due for return on June 15th.', timestamp: '2024-06-06 10:00 AM', read: true },
];

const tabs = [
  { key: 'all', label: 'All', icon: <FaInbox className="inline mr-1" /> },
  { key: 'system', label: 'System', icon: <FaInfoCircle className="inline mr-1" /> },
  { key: 'rentals', label: 'Rentals', icon: <FaShoppingCart className="inline mr-1" /> },
  { key: 'listings', label: 'Listings', icon: <FaBell className="inline mr-1" /> },
];

const typeIcon = {
  system: <FaInfoCircle className="text-[#D32F2F] w-7 h-7" />,
  rentals: <FaShoppingCart className="text-[#70C9B0] w-7 h-7" />,
  listings: <FaBell className="text-orange-500 w-7 h-7" />,
};

const Notifications = () => {
  const { theme } = useTheme(); // Theme placeholder
  const [selectedTab, setSelectedTab] = useState('all');
  const [alerts, setAlerts] = useState(dummyAlerts);

  const filteredAlerts = selectedTab === 'all' ? alerts : alerts.filter(a => a.type === selectedTab);

  const handleMarkRead = (id) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: !a.read } : a)));
  };

  return (
    <div className="min-h-screen bg-[#fff3f3] font-sans pt-20 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
        <div className="flex flex-col items-center justify-center mt-2 mb-10">
          <div className="flex items-center gap-3">
            <FaBell className="text-[#D32F2F] text-4xl" />
            <span className="text-3xl font-extrabold uppercase text-[#D32F2F] tracking-wide">
              Notifications
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
      >
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-full font-bold transition-colors duration-200 text-sm focus:outline-none border-2
                ${selectedTab === tab.key
                  ? 'bg-[#D32F2F] text-white border-[#D32F2F] shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#fff3f3] hover:text-[#D32F2F]'}
              `}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-5">
          <AnimatePresence>
            {filteredAlerts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-center justify-center py-16 bg-[#fff3f3] rounded-xl border-2 border-[#D32F2F] shadow-md"
              >
                <FaInbox className="text-5xl text-[#D32F2F] mb-4" />
                <div className="text-lg text-gray-700 font-bold mb-2">No notifications found</div>
                <div className="text-sm text-gray-600">You're all caught up!</div>
              </motion.div>
            ) : (
              filteredAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl shadow-lg border-2 transition-colors duration-200
                    bg-white hover:shadow-xl ${!alert.read ? 'border-[#D32F2F]' : 'border-gray-200'}`}
                >
                  <div className="mt-1 flex-shrink-0 flex items-center justify-center">
                    {typeIcon[alert.type] || <FaBell className="text-gray-500 w-7 h-7" />}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <span className={`font-semibold text-lg ${!alert.read ? 'text-[#D32F2F]' : 'text-[#222]'}`}>
                        {alert.title}
                      </span>
                      {!alert.read && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#ffeaea] text-xs text-[#D32F2F] font-bold">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm mb-1 w-full">{alert.message}</div>
                    <div className="text-xs text-gray-600 w-full">{alert.timestamp}</div>
                  </div>

                  <div className="flex items-center justify-end w-full sm:w-auto">
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border-2 shadow-sm transition-colors duration-200 whitespace-nowrap
                        ${alert.read
                          ? 'bg-gray-200 text-gray-800 border-gray-200 hover:bg-gray-300'
                          : 'bg-[#D32F2F] text-white border-[#D32F2F] hover:bg-white hover:text-[#D32F2F]'}
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
