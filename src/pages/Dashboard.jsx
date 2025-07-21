import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api"; // +++ ADDED: API service for making requests
import { FaUser, FaBox, FaList, FaCreditCard, FaHeart, FaInfoCircle, FaKey, FaSignOutAlt, FaHome } from 'react-icons/fa';

const navItems = [
  { label: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
  { label: 'My Orders', icon: <FaBox />, path: '/my-bookings' },
  { label: 'My Listings', icon: <FaList />, path: '/my-listings' },
  { label: 'My Payments', icon: <FaCreditCard />, path: '/my-payments' },
  { label: 'My Wishlist', icon: <FaHeart />, path: '/wishlist' },
  { label: 'Account Information', icon: <FaInfoCircle />, path: '/account' },
  { label: 'Change Password', icon: <FaKey />, path: '/change-password' },
  { label: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
];

const Dashboard = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- MODIFIED: States now start empty and will be filled by API data ---
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  // --- NEW: Active section state for sidebar navigation ---
  const [activeSection, setActiveSection] = useState('Dashboard');

  // +++ ADDED: Function to fetch all dashboard data from the backend +++
  const fetchDashboardData = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");

      // Fetch all data concurrently for better performance
      const [summaryRes, bookingsRes, itemsRes] = await Promise.all([
        API.get("/users/dashboard"),
        API.get("/bookings/my?limit=3&sortBy=createdAt:desc"),
        API.get("/items/my?limit=3&sortBy=createdAt:desc"),
      ]);

      setStats(summaryRes.data);
      setRecentBookings(bookingsRes.data);
      setRecentItems(itemsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load your dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // --- MODIFIED: This useEffect now triggers the data fetch ---
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // This useEffect for handling the success message remains
  useEffect(() => {
    if (successMessage) {
      const msgTimer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(msgTimer);
    }
  }, [successMessage]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    // This helper function remains the same
    const statusConfig = {
      ACTIVE: {
        color:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
        text: "Active",
      },
      COMPLETED: {
        color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
        text: "Completed",
      },
      UPCOMING: {
        color:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
        text: "Upcoming",
      },
      CANCELED: {
        color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
        text: "Canceled",
      },
      AVAILABLE: {
        color:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
        text: "Available",
      },
      RENTED: {
        color:
          "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300",
        text: "Rented",
      },
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
      text: status,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  // --- NEW: My Orders Table Section ---
  function MyOrdersSection() {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="py-2">Item</th>
              <th className="py-2">Rental Duration</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length > 0 ? recentBookings.map((booking) => (
              <tr key={booking.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg">
                <td className="py-2 flex items-center gap-3">
                  <img src={booking.item?.imageUrl || '/images/placeholder.jpg'} alt={booking.item?.name} className="w-12 h-12 rounded-lg object-cover border" />
                  <span className="font-semibold text-gray-900">{booking.item?.name || 'Item Name'}</span>
                </td>
                <td className="py-2 text-gray-700 text-sm">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</td>
                <td className="py-2">{getStatusBadge(booking.status)}</td>
                <td className="py-2 flex gap-2">
                  <button className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-blue-700 transition">View</button>
                  <button className="bg-green-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-green-700 transition">Extend</button>
                  <button className="bg-red-500 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-red-600 transition">Cancel</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="text-center text-gray-500 py-8">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // --- My Listings Section ---
  function MyListingsSection() {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentItems.length > 0 ? recentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
              <img src={item.imageUrl || '/images/placeholder.jpg'} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <div className="font-bold text-lg text-gray-900 mb-1">{item.name}</div>
              <div className="text-xs text-gray-500 mb-1">{item.category?.name || 'Category'}</div>
              <div className="font-bold text-[#B9162C] mb-2">₹{item.pricePerDay}/day</div>
              <div className="mb-2">{getStatusBadge(item.status)}</div>
              <div className="flex gap-2 mt-auto">
                <button className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-blue-700 transition">View</button>
                <button className="bg-green-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-green-700 transition">Edit</button>
                <button className="bg-red-500 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-red-600 transition">Delete</button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-gray-500 py-8">You haven't listed any items yet.</div>
          )}
        </div>
      </div>
    );
  }

  // --- My Payments Section ---
  function MyPaymentsSection() {
    // Demo data (replace with real API data if available)
    const payments = stats?.payments || [];
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Payments</h2>
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="py-2">Transaction ID</th>
              <th className="py-2">Item</th>
              <th className="py-2">Amount Paid</th>
              <th className="py-2">Date</th>
              <th className="py-2">Mode</th>
              <th className="py-2">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? payments.map((p) => (
              <tr key={p.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg">
                <td className="py-2 font-mono text-xs text-gray-700">{p.transactionId}</td>
                <td className="py-2 text-gray-900 font-semibold">{p.itemName}</td>
                <td className="py-2 text-[#B9162C] font-bold">₹{p.amount}</td>
                <td className="py-2 text-gray-700 text-sm">{formatDate(p.date)}</td>
                <td className="py-2 text-gray-700 text-sm">{p.mode}</td>
                <td className="py-2">
                  <button className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-blue-700 transition">Download</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="text-center text-gray-500 py-8">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // --- Account Information Section ---
  function AccountInfoSection() {
    const [form, setForm] = useState({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      college: user?.college || '',
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setSuccess('');
      setError('');
      // TODO: Replace with real API call
      setTimeout(() => {
        setSaving(false);
        setSuccess('Profile updated successfully!');
      }, 1000);
    };
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
        {success && <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-4 text-center">{success}</div>}
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-1">Full Name</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-1">Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" required disabled />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-1">Phone</label>
            <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" />
          </div>
          <div>
            <label htmlFor="college" className="block text-sm font-bold text-gray-900 mb-1">College Name</label>
            <input type="text" id="college" name="college" value={form.college} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" />
          </div>
          <button type="submit" className="bg-[#B9162C] text-white font-bold rounded-lg px-6 py-3 shadow hover:bg-[#a01325] transition-all duration-300 w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    );
  }

  // --- Change Password Section ---
  function ChangePasswordSection() {
    const [form, setForm] = useState({
      current: '',
      new: '',
      confirm: '',
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setSuccess('');
      setError('');
      if (form.new !== form.confirm) {
        setError('New passwords do not match.');
        setSaving(false);
        return;
      }
      // TODO: Replace with real API call
      setTimeout(() => {
        setSaving(false);
        setSuccess('Password changed successfully!');
      }, 1000);
    };
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
        {success && <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-4 text-center">{success}</div>}
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="current" className="block text-sm font-bold text-gray-900 mb-1">Current Password</label>
            <input type="password" id="current" name="current" value={form.current} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" required />
          </div>
          <div>
            <label htmlFor="new" className="block text-sm font-bold text-gray-900 mb-1">New Password</label>
            <input type="password" id="new" name="new" value={form.new} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" required />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-bold text-gray-900 mb-1">Confirm New Password</label>
            <input type="password" id="confirm" name="confirm" value={form.confirm} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" required />
          </div>
          <button type="submit" className="bg-[#B9162C] text-white font-bold rounded-lg px-6 py-3 shadow hover:bg-[#a01325] transition-all duration-300 w-full" disabled={saving}>{saving ? 'Saving...' : 'Submit'}</button>
        </form>
      </div>
    );
  }

  if (loading) {
    // Loading UI remains the same
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    // +++ ADDED: Error display UI +++
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Login prompt UI remains the same
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        {/* ... */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 shadow-lg fixed left-0 top-0 z-30">
        <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-[#B9162C] mb-2">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="font-bold text-lg text-gray-900">{user?.name || 'User'}</div>
          <div className="text-xs text-gray-500">{user?.email || ''}</div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 mt-6 px-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === 'Logout') {
                  logout();
                  navigate('/');
                } else {
                  setActiveSection(item.label);
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 w-full ${activeSection === item.label ? 'bg-gray-100 font-bold' : ''} ${item.label === 'Logout' ? 'hover:bg-red-50 hover:text-red-600' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 md:pl-64 w-full">
        <div className="min-h-screen bg-[#fafbfc] pt-20 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome and Overview Cards only on Dashboard */}
            {activeSection === 'Dashboard' && (
              <>
                {/* Welcome Message */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hi {user?.name?.split(' ')[0] || 'User'}! Welcome back <span className="inline-block">👋</span></h2>
                  <p className="text-gray-600 text-lg">Here’s a quick overview of your activity and shortcuts to manage your rentals.</p>
                </div>
                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {/* Orders */}
                  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBox className="text-[#B9162C] text-2xl" />
                      <span className="text-lg font-bold text-gray-900">{stats?.totalBookings || 0}</span>
                    </div>
                    <div className="text-gray-700 font-semibold mb-2">My Orders</div>
                    <button onClick={() => window.location.href='/my-bookings'} className="mt-auto bg-[#B9162C] text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-[#a01325] transition-all duration-200 w-full">View Orders</button>
                  </div>
                  {/* Listings */}
                  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-2">
                      <FaList className="text-blue-600 text-2xl" />
                      <span className="text-lg font-bold text-gray-900">{stats?.itemsPosted || 0}</span>
                    </div>
                    <div className="text-gray-700 font-semibold mb-2">Items Posted</div>
                    <button onClick={() => window.location.href='/my-listings'} className="mt-auto bg-blue-600 text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-blue-700 transition-all duration-200 w-full">Manage</button>
                  </div>
                  {/* Payments */}
                  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCreditCard className="text-green-600 text-2xl" />
                      <span className="text-lg font-bold text-gray-900">₹{stats?.totalEarnings || 0}</span>
                    </div>
                    <div className="text-gray-700 font-semibold mb-2">Payments</div>
                    <button onClick={() => window.location.href='/my-payments'} className="mt-auto bg-green-600 text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-green-700 transition-all duration-200 w-full">View Payments</button>
                  </div>
                  {/* Wishlist */}
                  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-2">
                      <FaHeart className="text-pink-500 text-2xl" />
                      <span className="text-lg font-bold text-gray-900">{stats?.wishlistCount || 0}</span>
                    </div>
                    <div className="text-gray-700 font-semibold mb-2">Wishlist Items</div>
                    <button onClick={() => window.location.href='/wishlist'} className="mt-auto bg-pink-500 text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-pink-600 transition-all duration-200 w-full">View Wishlist</button>
                  </div>
                </div>
              </>
            )}
            {activeSection === 'My Orders' && <MyOrdersSection />}
            {activeSection === 'My Listings' && <MyListingsSection />}
            {activeSection === 'My Payments' && <MyPaymentsSection />}
            {activeSection === 'Account Information' && <AccountInfoSection />}
            {activeSection === 'Change Password' && <ChangePasswordSection />}
            {/* Add similar logic for other sections in future steps */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
