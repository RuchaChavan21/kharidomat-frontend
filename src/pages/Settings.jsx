import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMoon, FaCog, FaUser, FaBell, FaLock } from 'react-icons/fa';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaCog className="text-purple-600 dark:text-purple-400" /> Settings
          </h1>

          {/* Dark Mode Toggle */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <FaMoon className="text-yellow-500 w-5 h-5" />
              <span className="text-lg font-medium text-gray-800 dark:text-gray-200 flex-1">Dark Mode</span>
              <span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  className="absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer left-0 top-0 transition-all"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                />
                <span className="block overflow-hidden h-7 rounded-full bg-gray-300 dark:bg-gray-700 transition-all"></span>
                <span
                  className={`absolute left-0 top-0 w-7 h-7 rounded-full transition-transform duration-200 ease-in transform ${theme === 'dark' ? 'translate-x-5 bg-purple-600' : 'translate-x-0 bg-white'}`}
                ></span>
              </span>
            </label>
          </div>

          {/* Settings Options */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 flex items-center gap-4"
            >
              <FaUser className="text-blue-500 w-6 h-6" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Account Info</div>
                <div className="text-gray-500 dark:text-gray-300 text-sm">Update your name, email, and profile picture</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Link to="/notifications" className="flex items-center gap-4 w-full">
                <FaBell className="text-yellow-500 w-6 h-6" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Notifications</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">Manage notification preferences</div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Link to="/change-password" className="flex items-center gap-4 w-full">
                <FaLock className="text-red-500 w-6 h-6" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Change Password</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">Update your account password</div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 