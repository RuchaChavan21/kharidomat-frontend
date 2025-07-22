import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaCog, FaHeart, FaBook, FaTachometerAlt, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditPicModal, setShowEditPicModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Get user info from AuthContext or localStorage
  const name = user?.fullName || user?.name || localStorage.getItem('name') || 'User';
  const email = user?.email || localStorage.getItem('email') || 'user@example.com';
  
  // FIX 1: Use local state for the profile image to allow for immediate UI updates.
  const [profileImage, setProfileImage] = useState('');

  // FIX 2: Use useEffect to initialize and sync the local profileImage state 
  // with the AuthContext or localStorage. This runs on mount and whenever the user object changes.
  useEffect(() => {
    setProfileImage(user?.profileImageUrl || localStorage.getItem('profileImageUrl') || '');
  }, [user?.profileImageUrl]);


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
      // Consider using a more integrated notification system instead of alert
      alert('Please select an image file under 5MB.');
    }
  };

  // FIX 3: Updated upload handler to set local state, triggering a re-render.
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      const userId = user?.id || localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // The browser will automatically set the 'Content-Type' for FormData
      const response = await fetch(`/api/users/${userId}/profile-picture`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // You can add more specific error handling based on response status
        throw new Error('Upload failed');
      }

      const data = await response.json();

      if (data.profileImageUrl) {
        // 1. Update localStorage for persistence on page reload
        localStorage.setItem('profileImageUrl', data.profileImageUrl);

        // 2. Update the local state to re-render the component with the new image
        setProfileImage(data.profileImageUrl);

        // 3. Update the user object in context if possible.
        // NOTE: The best practice is for your AuthContext to provide an `updateUser` function.
        // Direct mutation `user.profileImageUrl = ...` will not re-render other components.
        if (user) {
          user.profileImageUrl = data.profileImageUrl;
        }
      }

      // Reset and close the modal
      setShowEditPicModal(false);
      setSelectedFile(null);
      setPreviewUrl('');

    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Menu items
  const menu = [
    { icon: <FaTachometerAlt className="text-[#B9162C] w-4 h-4" />, label: 'My Dashboard', path: '/dashboard' },
    { icon: <FaBook className="text-[#B9162C] w-4 h-4" />, label: 'My Bookings', path: '/my-bookings' },
    { icon: <FaHeart className="text-[#B9162C] w-4 h-4" />, label: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar/Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-[#B9162C] shadow-md hover:shadow-lg transition-all focus:outline-none"
        aria-label="Open profile menu"
      >
        {/* FIX 4: Use the new `profileImage` state variable here */}
        {profileImage ? (
          <img src={profileImage} alt="avatar" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="relative w-11 h-11 flex items-center justify-center">
            <FaUserCircle className="w-11 h-11 text-[#F8B4B4] absolute" />
            <span className="z-10 text-lg font-extrabold text-[#B9162C]">
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
            className="absolute right-0 top-14 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50"
            style={{ minWidth: '18rem' }}
          >
            {/* Caret */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
            
            {/* User Info */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-[#fff3f3] rounded-t-xl">
              <div className="flex items-center gap-4 mb-2">
                {/* FIX 5: Also use the `profileImage` state here */}
                {profileImage ? (
                  <img src={profileImage} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-[#B9162C]" />
                ) : (
                  <span className="relative w-12 h-12 flex items-center justify-center">
                    <FaUserCircle className="w-12 h-12 text-[#F8B4B4] absolute" />
                    <span className="z-10 text-lg font-extrabold text-[#B9162C]">
                      {getInitials(name)}
                    </span>
                  </span>
                )}
                <div>
                  <div className="font-bold text-[#B9162C] text-base leading-tight">{name}</div>
                  <div className="text-xs text-gray-500 leading-tight">{email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false); // Close dropdown before opening modal
                  setShowEditPicModal(true);
                }}
                className="mt-2 px-3 py-1 text-xs font-bold rounded-lg bg-white border border-[#B9162C] text-[#B9162C] hover:bg-[#fff3f3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#B9162C]"
              >
                Edit Profile Picture
              </button>
            </div>

            {/* Menu */}
            <div className="py-2">
              {menu.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setOpen(false); navigate(item.path); }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-[#222] hover:bg-[#fff3f3] hover:text-[#B9162C] font-bold text-sm rounded-none transition-colors duration-150 text-left"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setOpen(false); navigate('/edit-profile'); }}
                className="w-full flex items-center gap-3 px-6 py-3 text-[#222] hover:bg-[#fff3f3] hover:text-[#B9162C] font-bold text-sm rounded-none transition-colors duration-150 text-left"
              >
                <FaEdit className="text-[#B9162C] w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-6 py-3 text-[#222] hover:bg-[#fff3f3] hover:text-[#B9162C] font-bold text-sm rounded-none transition-colors duration-150 text-left"
              >
                <FaCog className="text-[#B9162C] w-4 h-4" />
                Settings
              </button>
              {/* Logout */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-3 text-[#B9162C] hover:bg-[#ffeaea] font-bold text-sm rounded-b-xl transition-colors duration-150 text-left"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Picture Modal */}
      {showEditPicModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowEditPicModal(false)}>
          <div
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border border-gray-200 transition-colors duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-[#B9162C]">Edit Profile Picture</h2>
            <p className="text-sm text-gray-500 mb-4">Choose a new photo (PNG, JPG under 5MB).</p>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" // Hide the default input
            />
            
            {/* Custom File Input Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full text-center px-4 py-2 mb-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#B9162C] hover:text-[#B9162C] transition-colors"
            >
              {selectedFile ? selectedFile.name : 'Click to select a file'}
            </button>
            
            {previewUrl && (
              <div className='flex justify-center mb-4'>
                 <img src={previewUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#B9162C]" />
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditPicModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 rounded-lg bg-[#B9162C] text-white font-bold hover:bg-[#a01325] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#B9162C] disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
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