import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaCog, FaHeart, FaBook, FaTachometerAlt, FaMoon, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ConfirmationModal from './ConfirmationModal';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditPicModal, setShowEditPicModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Get user info from AuthContext or localStorage
  const name = user?.fullName || user?.name || localStorage.getItem('name') || 'User';
  const email = user?.email || localStorage.getItem('email') || 'user@example.com';
  const profileImageUrl = user?.profileImageUrl || localStorage.getItem('profileImageUrl') || '';

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Handle logout
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    logout && logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
      alert('Please select an image file under 5MB.');
    }
  };

  // Handle profile picture upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      const userId = user?.id || localStorage.getItem('userId');
      const response = await fetch(`/api/users/${userId}/profile-picture`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      // Update avatar everywhere
      if (data.profileImageUrl) {
        localStorage.setItem('profileImageUrl', data.profileImageUrl);
        // Optionally update user context if available
        if (user) user.profileImageUrl = data.profileImageUrl;
      }
      setShowEditPicModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (err) {
      alert('Failed to upload profile picture.');
    } finally {
      setUploading(false);
    }
  };

  // Handle edit avatar (for now, just alert)
  const handleEditAvatar = () => {
    alert('Profile picture upload coming soon!');
  };

  // Menu items
  const menu = [
    {
      icon: <FaTachometerAlt className="text-purple-600 w-4 h-4" />, label: 'My Dashboard', path: '/dashboard'
    },
    {
      icon: <FaBook className="text-blue-600 w-4 h-4" />, label: 'My Bookings', path: '/my-bookings'
    },
    {
      icon: <FaHeart className="text-red-500 w-4 h-4" />, label: 'Wishlist', path: '/wishlist'
    },
    {
      icon: <FaCog className="text-gray-500 w-4 h-4" />, label: 'Settings', path: '/settings', optional: true
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar/Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-all border-2 border-white shadow-md focus:outline-none"
        aria-label="Open profile menu"
      >
        {profileImageUrl ? (
          <img src={profileImageUrl} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="relative w-10 h-10 flex items-center justify-center">
            <FaUserCircle className="w-10 h-10 text-purple-200 absolute" />
            <span className="z-10 text-base font-bold text-purple-700">
              {getInitials(name)}
            </span>
          </span>
        )}
      </button>
      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-50"
            style={{ minWidth: '16rem' }}
          >
            {/* Caret */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-gray-100 dark:border-gray-800 rotate-45 z-10"></div>
            {/* User Info */}
            <div className="px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
              <div className="flex items-center gap-3 mb-1">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="relative w-10 h-10 flex items-center justify-center">
                    <FaUserCircle className="w-10 h-10 text-purple-200 absolute" />
                    <span className="z-10 text-base font-bold text-purple-700">
                      {getInitials(name)}
                    </span>
                  </span>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-base leading-tight">{name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 leading-tight">{email}</div>
                </div>
              </div>
              {/* Edit Profile Picture Button */}
              <button
                onClick={() => setShowEditPicModal(true)}
                className="mt-2 px-3 py-1 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Edit Profile Picture
              </button>
            </div>
            {/* Menu */}
            <div className="py-2">
              {menu.filter(item => !item.optional).map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() => { setOpen(false); navigate(item.path); }}
                  className="w-full flex items-center gap-3 px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              {/* Edit Profile Option */}
              <button
                onClick={() => { setOpen(false); navigate('/edit-profile'); }}
                className="w-full flex items-center gap-3 px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <FaEdit className="text-purple-500 w-4 h-4" />
                Edit Profile
              </button>
              {/* Optional Settings */}
              <button
                onClick={() => { setOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-5 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <FaCog className="text-gray-500 w-4 h-4" />
                Settings
              </button>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium border-t border-gray-100 dark:border-gray-800 mt-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Edit Profile Picture Modal */}
      {showEditPicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowEditPicModal(false)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Profile Picture</h2>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="mb-4 w-full text-sm text-gray-700 dark:text-gray-200"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-purple-400" />
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditPicModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to log in again to access your account."
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default ProfileDropdown; 