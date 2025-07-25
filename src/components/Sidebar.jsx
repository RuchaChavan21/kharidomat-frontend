import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaList,
  FaMoneyBill,
  FaWallet,
  FaHeart,
  FaUser,
  FaKey,
  FaSignOutAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from './ConfirmationModal';

const navLinks = [
  { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { label: "My Bookings", icon: <FaBook />, path: "/my-bookings" },
  { label: "Payments", icon: <FaMoneyBill />, path: "/payments" },
  { label: "My Listings", icon: <FaList />, path: "/recent-listings" },
  { label: "Earnings", icon: <FaWallet />, path: "/EarningsBreakdown" },
  { label: "Wishlist", icon: <FaHeart />, path: "/wishlist" },
  { label: "Profile", icon: <FaUser />, path: "/edit-profile" },
  { label: "Change Password", icon: <FaKey />, path: "/change-password" }
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  // Sidebar content
  const sidebarContent = (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* User Info */}
        <div className="mb-8">
          <div className="text-gray-800 text-lg font-bold">Hi, {user?.fullName?.split(" ")[0] || "User"} 👋</div>
          <div className="text-xs text-gray-500">Verified User</div>
        </div>
        {/* Navigation */}
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-5 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/10 gap-3 ` +
                (isActive ? "bg-white text-[#D32F2F] font-bold shadow" : "text-white/80")
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-4 text-2xl text-[#D32F2F] drop-shadow">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
          {/* Logout as a button for function call */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm hover:bg-[#fce1e1] text-gray-700 w-full mt-2`}
          >
            <span className="mr-3 text-lg text-[#D32F2F]"><FaSignOutAlt /></span>
            Logout
          </button>
        </nav>
      </div>
      {/* Footer */}
      <div className="text-xs text-gray-400 text-center mt-6">
        © {new Date().getFullYear()} CampusRent
      </div>
    </div>
  );

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    logout && logout();
    setIsOpen(false);
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Sidebar (always togglable, but styled for desktop) */}
      <div
        className={`fixed top-0 left-0 h-full z-40 bg-gradient-to-b from-[#fff3f3] via-[#fca5a5] to-[#D32F2F] rounded-r-2xl shadow-lg py-10 px-4 gap-6 transition-transform duration-300 ease-in-out w-64 min-h-screen justify-between overflow-y-auto scrollbar-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Sidebar Toggle Button (styled, logic unchanged) */}
        <button
          className="mb-6 ml-auto flex items-center justify-center w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow transition-all duration-200 text-[#D32F2F] text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        {/* Sidebar content */}
        {sidebarContent}
      </div>
      {/* Overlay for all screens when sidebar is open (unchanged) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to log in again to access your account."
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </>
  );
};

export default Sidebar; 