import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCog, FaUser, FaBell, FaLock } from 'react-icons/fa';

const Settings = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <div className="w-full max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.10)] border border-gray-100 p-8"
        >
          <h1 className="text-3xl font-bold text-[#B9162C] mb-8 flex items-center gap-3">
            <FaCog className="text-[#B9162C] w-8 h-8" /> Settings
          </h1>

          {/* Settings Options */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#fff3f3] rounded-lg p-5 flex items-center gap-4"
            >
              <FaUser className="text-[#B9162C] w-6 h-6" />
              <div>
                <div className="font-semibold text-[#222]">Account Info</div>
                <div className="text-gray-500 text-sm">Update your name, email, and profile picture</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#fff3f3] rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:bg-[#ffeaea] transition-colors"
            >
              <Link to="/notifications" className="flex items-center gap-4 w-full">
                <FaBell className="text-[#B9162C] w-6 h-6" />
                <div>
                  <div className="font-semibold text-[#222]">Notifications</div>
                  <div className="text-gray-500 text-sm">Manage notification preferences</div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[#fff3f3] rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:bg-[#ffeaea] transition-colors"
            >
              <Link to="/change-password" className="flex items-center gap-4 w-full">
                <FaLock className="text-[#B9162C] w-6 h-6" />
                <div>
                  <div className="font-semibold text-[#222]">Change Password</div>
                  <div className="text-gray-500 text-sm">Update your account password</div>
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