import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import { FaUser, FaBox, FaList, FaCreditCard, FaHeart, FaInfoCircle, FaKey, FaSignOutAlt, FaHome } from 'react-icons/fa';
import Footer from '../components/Footer';

// --- No changes to navItems ---
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

  // --- MODIFIED: State simplified. Recent items/bookings removed as sections fetch their own data. ---
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [activeSection, setActiveSection] = useState('Dashboard');

  // --- MODIFIED: This function now only fetches the main dashboard summary. ---
  const fetchDashboardData = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const summaryRes = await API.get("/users/dashboard");
      setStats(summaryRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard summary:", err);
      setError("Could not load your dashboard summary. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (successMessage) {
      const msgTimer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(msgTimer);
    }
  }, [successMessage]);

  // --- Helper functions (formatDate, getStatusBadge) remain the same ---
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300", text: "Active" },
      COMPLETED: { color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300", text: "Completed" },
      UPCOMING: { color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300", text: "Upcoming" },
      CANCELED: { color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300", text: "Canceled" },
      AVAILABLE: { color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300", text: "Available" },
      RENTED: { color: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300", text: "Rented" },
    };
    const config = statusConfig[status] || { color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200", text: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };
  
  const SectionLoader = () => (
    <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const SectionError = ({ message, onRetry }) => (
    <div className="text-center p-10 bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold">{message}</p>
        <button onClick={onRetry} className="mt-4 bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-red-600 transition">Retry</button>
    </div>
  );


  // --- MODIFIED: My Orders Section now fetches its own complete data ---
  function MyOrdersSection() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setFetchError('');
        try {
            const res = await API.get('/bookings/my');
            setBookings(res.data);
        } catch (error) {
            setFetchError('Failed to load your orders.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    if (isLoading) return <SectionLoader />;
    if (fetchError) return <SectionError message={fetchError} onRetry={fetchOrders} />;

    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>
        <table className="w-full text-left border-separate border-spacing-y-2">
          {/* ... table headers ... */}
          <tbody>
            {bookings.length > 0 ? bookings.map((booking) => (
              <tr key={booking.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg">
                <td className="py-2 flex items-center gap-3">
                  <img src={booking.item?.imageUrl || '/images/placeholder.jpg'} alt={booking.item?.name} className="w-12 h-12 rounded-lg object-cover border" />
                  <span className="font-semibold text-gray-900">{booking.item?.name || 'Item Name'}</span>
                </td>
                <td className="py-2 text-gray-700 text-sm">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</td>
                <td className="py-2">{getStatusBadge(booking.status)}</td>
                <td className="py-2 flex gap-2">
                  <button className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-blue-700 transition">View</button>
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

  // --- MODIFIED: My Listings Section now fetches its own complete data ---
  function MyListingsSection() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setFetchError('');
        try {
            const res = await API.get('/items/my');
            setItems(res.data);
        } catch (error) {
            setFetchError('Failed to load your listings.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);
    
    if (isLoading) return <SectionLoader />;
    if (fetchError) return <SectionError message={fetchError} onRetry={fetchItems} />;

    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
              <img src={item.imageUrl || '/images/placeholder.jpg'} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <div className="font-bold text-lg text-gray-900 mb-1">{item.name}</div>
              <div className="text-xs text-gray-500 mb-1">{item.category?.name || 'Category'}</div>
              <div className="font-bold text-[#B9162C] mb-2">₹{item.pricePerDay}/day</div>
              <div className="mb-2">{getStatusBadge(item.status)}</div>
              <div className="flex gap-2 mt-auto">
                <button className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-blue-700 transition">View</button>
                <button className="bg-green-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-green-700 transition">Edit</button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-gray-500 py-8">You haven't listed any items yet.</div>
          )}
        </div>
      </div>
    );
  }

  // --- MODIFIED: My Payments Section now fetches its own complete data ---
  function MyPaymentsSection() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setFetchError('');
        try {
            const res = await API.get('/payments/my');
            setPayments(res.data);
        } catch (error) {
            setFetchError('Failed to load your payment history.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    if (isLoading) return <SectionLoader />;
    if (fetchError) return <SectionError message={fetchError} onRetry={fetchPayments} />;

    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Payments</h2>
        <table className="w-full text-left border-separate border-spacing-y-2">
           {/* ... table headers ... */}
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
  
  // +++ NEW: My Wishlist Section uses the /wishlist/{email} endpoint +++
  function MyWishlistSection() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const { user } = useAuth(); // Get user to access email

    const fetchWishlist = useCallback(async () => {
        if (!user?.email) return; // Don't fetch if email is not available
        setIsLoading(true);
        setFetchError('');
        try {
            const res = await API.get(`users/wishlist/${user.email}`);
            setItems(res.data);
        } catch (error) {
            setFetchError('Failed to load your wishlist.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    if (isLoading) return <SectionLoader />;
    if (fetchError) return <SectionError message={fetchError} onRetry={fetchWishlist} />;
    
    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Wishlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length > 0 ? items.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                        <img src={item.imageUrl || '/images/placeholder.jpg'} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                        <div className="font-bold text-lg text-gray-900 mb-1">{item.name}</div>
                        <div className="text-xs text-gray-500 mb-1">{item.category?.name || 'Category'}</div>
                        <div className="font-bold text-[#B9162C] mb-2">₹{item.pricePerDay}/day</div>
                        <div className="mb-2">{getStatusBadge(item.status)}</div>
                        <div className="flex gap-2 mt-auto">
                           <button className="bg-pink-500 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-pink-600 transition">Remove</button>
                           <button className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-blue-700 transition">View Item</button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center text-gray-500 py-8">Your wishlist is empty.</div>
                )}
            </div>
        </div>
    );
  }

// --- Account Information Section ---
function AccountInfoSection() {
  const { user } = useAuth();

  // MODIFIED: The 'name' key is now 'fullName' to match the backend.
  const [form, setForm] = useState({
    fullName: user?.name || '', 
    email: user?.email || '',
    phone: user?.phone || '',
    college: user?.college || 'MIT AOE',
    prn: user?.prn || '',
    academicYear: user?.academicYear || ''
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
    
    try {
      // This now sends the 'form' object with the correct 'fullName' key.
      const response = await API.put('/users/edit-profile', form);
      setSuccess('Profile updated successfully! ✅');
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto mb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
      {success && <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-4 text-center">{success}</div>}
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* --- MODIFIED: The input now uses 'fullName' for its name and value --- */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-1">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="fullName" 
            value={form.fullName} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" 
            required 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-1">Email</label>
          <input type="email" id="email" name="email" value={form.email} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 text-base cursor-not-allowed" required disabled />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-1">Phone</label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" />
        </div>
        <div>
          <label htmlFor="college" className="block text-sm font-bold text-gray-900 mb-1">College Name</label>
          <input type="text" id="college" name="college" value={form.college} className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 text-base cursor-not-allowed" disabled />
        </div>
        <div>
          <label htmlFor="prn" className="block text-sm font-bold text-gray-900 mb-1">PRN</label>
          <input type="text" id="prn" name="prn" value={form.prn} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300" placeholder="e.g., 22210123" />
        </div>
        <div>
            <label htmlFor="academicYear" className="block text-sm font-bold text-gray-900 mb-1">Current Academic Year</label>
            <select
                id="academicYear"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300"
                required
            >
                <option value="" disabled>Select Year...</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
            </select>
        </div>
        <button type="submit" className="bg-[#B9162C] text-white font-bold rounded-lg px-6 py-3 shadow hover:bg-[#a01325] transition-all duration-300 w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
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
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <div className="flex flex-1">
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
        <main className="flex-1 md:ml-64 w-full overflow-y-auto pb-32">
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
              {activeSection === 'Account Information' && <div className="mb-16"><AccountInfoSection /></div>}
              {activeSection === 'Change Password' && <ChangePasswordSection />}
              {/* Add similar logic for other sections in future steps */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
