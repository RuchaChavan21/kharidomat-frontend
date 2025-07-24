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

    // --- MODIFIED: State simplified. Removed stats, top-level loading, and error states. ---
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );
  const [activeSection, setActiveSection] = useState('Dashboard');


    // --- REMOVED: The fetchDashboardData function is no longer needed. ---
    // The main dashboard no longer fetches summary data.
    // Each section (MyOrders, MyListings, etc.) is responsible for its own data fetching.

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


    // --- My Orders Section (No Changes) ---
  function MyOrdersSection() {
        const { user, isLoggedIn } = useAuth();
    const [bookings, setBookings] = useState([]);
        const [summary, setSummary] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [filter, setFilter] = useState("all");
        const [searchTerm, setSearchTerm] = useState("");
        const [extendModal, setExtendModal] = useState({ open: false, booking: null });
        const [extendLoading, setExtendLoading] = useState(false);
        const [extendError, setExtendError] = useState('');

        const fetchBookingsAndSummary = useCallback(async () => {
            if (!isLoggedIn) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const bookingsResponse = await API.get("/bookings/my");
                const summaryResponse = await API.get("/bookings/status-grouped");
                setBookings(bookingsResponse.data);
                setSummary(summaryResponse.data);
            } catch (err) {
                setError("Failed to fetch your data. Please try again.");
                console.error("Error fetching data:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }, [isLoggedIn]);

        useEffect(() => {
            fetchBookingsAndSummary();
        }, [fetchBookingsAndSummary]);

        const handleCancelBooking = async (bookingId) => {
            const confirmed = window.confirm(
                "Are you sure you want to cancel this booking? This action cannot be undone."
            );
            if (!confirmed) return;
            try {
                await API.put(`/bookings/cancel/${bookingId}`);
                alert("Booking cancelled successfully!");
                fetchBookingsAndSummary();
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || "Failed to cancel booking. Please try again.";
                alert(`Error: ${errorMessage}`);
                console.error("Error canceling booking:", error.response?.data || error.message);
            }
        };

        const handleReturnItem = async (bookingId) => {
            if (!window.confirm("Are you sure you want to mark this item as returned?")) {
                return;
            }
            try {
                const response = await API.get(`/bookings/return/${bookingId}`);
                alert(response.data);
                fetchBookingsAndSummary();
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to return item.";
                alert(`Error: ${errorMessage}`);
                console.error("Error returning item:", error);
            }
        };

        const handleExtendBooking = async (bookingId) => {
            const newEndDate = window.prompt("Please enter the new end date (YYYY-MM-DD):");
            if (!newEndDate || !/^\d{4}-\d{2}-\d{2}$/.test(newEndDate)) {
                alert("Invalid date format. Please use YYYY-MM-DD.");
                return;
            }
            try {
                await API.put(`/bookings/extend/${bookingId}`, null, {
                    params: { newEndDate }
                });
                alert("Booking extended successfully!");
                fetchBookingsAndSummary();
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to extend booking.";
                alert(`Error: ${errorMessage}`);
                console.error("Error extending booking:", error);
            }
        };

        const handleOpenExtendModal = (booking) => {
            setExtendModal({ open: true, booking });
            setExtendError('');
        };
        const handleCloseExtendModal = () => {
            setExtendModal({ open: false, booking: null });
            setExtendError('');
        };
        const handleExtendBookingSubmit = async (newEndDate) => {
            setExtendLoading(true);
            setExtendError('');
            try {
                await API.put(`/bookings/extend/${extendModal.booking.id}`, null, {
                    params: { newEndDate }
                });
                handleCloseExtendModal();
                fetchBookingsAndSummary();
        } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to extend booking.';
                setExtendError(errorMessage);
        } finally {
                setExtendLoading(false);
            }
        };

        const getStatusBadge = (status) => {
            const statusConfig = {
                ACTIVE: {
                    color: "bg-green-100 text-green-800 border-green-300",
                    text: "Active",
                },
                COMPLETED: {
                    color: "bg-blue-100 text-blue-800 border-blue-300",
                    text: "Completed",
                },
                UPCOMING: {
                    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    text: "Upcoming",
                },
                CANCELED: {
                    color: "bg-red-100 text-red-800 border-red-300",
                    text: "Canceled",
                },
            };
            const config = statusConfig[status] || {
                color: "bg-gray-100 text-gray-800 border-gray-300",
                text: status,
            };
            return (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color} transition-colors duration-300`}
                >
                    {config.text}
                </span>
            );
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        };

        const filteredBookings = bookings
            .filter((booking) => {
                const matchesFilter = filter === "all" || booking.status === filter;
                const itemName = booking.item?.name || "";
                const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesFilter && matchesSearch;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (loading) {
            return (
                <div className="flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4 min-h-[200px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
                        <p className="text-gray-700 text-lg">Loading your bookings...</p>
                    </div>
                </div>
            );
        }

        if (!isLoggedIn) {
            return (
                <div className="flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4 min-h-[200px]">
                    <div className="text-center bg-white rounded-xl shadow-lg p-8 border-2 border-[#D32F2F]">
                        <h1 className="text-2xl font-extrabold uppercase text-[#D32F2F] mb-4 tracking-wide">
                            Access Denied
                        </h1>
                        <p className="text-gray-700 mb-6 font-medium text-lg">
                            Please log in to view your bookings.
                        </p>
                        <Link
                            to="/login"
                            className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            );
        }

    return (
            <div className="w-full">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">My Orders</h2>
                    {/* Filters and Search */}
                    <div className="bg-white rounded-xl shadow p-6 mb-4">
                        <div className="flex flex-col md:flex-row gap-3 items-end">
                            {/* Search */}
                            <div className="flex-1 w-full">
                                <label htmlFor="search" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Search Items
                                </label>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search by item name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none bg-white text-gray-900 text-sm transition-colors duration-300"
                                />
                            </div>
                            {/* Filter */}
                            <div className="w-full md:w-40">
                                <label htmlFor="filter" className="block text-xs font-semibold text-gray-700 mb-1">
                                    Filter by Status
                                </label>
                                <select
                                    id="filter"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none bg-white text-gray-900 text-sm transition-colors duration-300"
                                >
                                    <option value="all">All Bookings</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="UPCOMING">Upcoming</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELED">Canceled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Bookings List */}
                    <div className="space-y-4">
                        {filteredBookings.length === 0 ? (
                            <div className="p-6 text-center bg-white rounded-xl shadow border-2 border-[#D32F2F]">
                                <p className="text-base font-semibold text-gray-700 mb-4">
                                    No bookings found for the selected criteria.
                                </p>
                                <Link
                                    to="/items"
                                    className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
                                >
                                    Browse Items to Book
                                </Link>
                            </div>
                        ) : (
                            <>
                                {filteredBookings.map((booking, index) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white rounded-xl shadow border-2 border-[#D32F2F] overflow-hidden transition-all duration-300 hover:shadow-md p-4"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Item Info */}
                                            <div className="flex gap-3 items-center flex-1">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-[#fff3f3]">
                                                    <img
                                                        src={
                                                            booking.item?.imageUrl ||
                                                            `https://via.placeholder.com/96x96?text=${booking.item?.name || 'Item'}`
                                                        }
                                                        alt={booking.item?.name || "Booked Item"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-extrabold uppercase text-[#222] mb-1 tracking-wide">
                                                        {booking.item?.name || "Unknown Item"}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 mb-1 font-medium">
                                                        Owner: <span className="font-semibold">{booking.owner?.name || "N/A"}</span>
                                                        Email: <span className="font-semibold">{booking.owner?.email || "N/A"}</span>
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-700">
                                                        <span className="font-medium">
                                                            📅 {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                                        </span>
                                                        <span className="font-medium">
                                                            💰 ₹{booking.item?.pricePerDay || 0} /day
                                                        </span>
                                                        <span className="font-bold text-[#D32F2F] text-base">
                                                            💳 Total: ₹{booking.totalAmount || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Status and Actions */}
                                            <div className="flex flex-col items-center lg:items-end gap-2 mt-2 lg:mt-0">
                                                {getStatusBadge(booking.status)}
                                                <div className="flex gap-2 mt-2 flex-wrap justify-center lg:justify-end">
                                                    <Link
                                                        to={`/booking/${booking.id}`}
                                                        className="bg-[#D32F2F] text-white font-bold px-4 py-2 rounded-lg shadow-md text-xs uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 whitespace-nowrap"
                                                    >
                                                        View Details
                                                    </Link>
                                                    {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-md text-xs uppercase border-2 border-red-500 hover:bg-white hover:text-red-500 transition-all duration-200 whitespace-nowrap"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (
                                                        <button
                                                            onClick={() => handleOpenExtendModal(booking)}
                                                            className="bg-white text-[#D32F2F] font-bold px-4 py-2 rounded-lg shadow-md text-xs uppercase border-2 border-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition-all duration-200 whitespace-nowrap"
                                                        >
                                                            Extend
                                                        </button>
                                                    )}
                                                    {(booking.status === "ACTIVE") && (
                                                        <button
                                                            onClick={() => handleReturnItem(booking.id)}
                                                            className="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg shadow-md text-xs uppercase border-2 border-orange-500 hover:bg-white hover:text-orange-500 transition-all duration-200 whitespace-nowrap"
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
      </div>
    );
  }

    // --- My Listings Section (No Changes) ---
  function MyListingsSection() {
        const { isLoggedIn, token, user } = useAuth();
        const navigate = useNavigate();
        const [listings, setListings] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        // Fetch listings from the actual API
        const fetchListings = useCallback(async () => {
            if (!isLoggedIn || !token || !user?.email) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // Ensure the correct endpoint is used
                const response = await API.get('/items/my');
                setListings(response.data);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch your listings. Please try again.';
                setError(errorMessage);
                console.error('Error fetching listings:', err.response?.data || err.message);
        } finally {
                setLoading(false);
            }
        }, [isLoggedIn, token, user?.email]);

        useEffect(() => {
            fetchListings();
        }, [fetchListings]);

        // Handler for deleting an item
        const handleDeleteItem = useCallback(async (itemIdToDelete) => {
            if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                return;
            }
            try {
                const response = await API.delete(`/items/${itemIdToDelete}`);
                if (response.status === 200 || response.status === 204) {
                    alert('Item deleted successfully!');
                    fetchListings();
                } else {
                    throw new Error(response.data?.message || 'Failed to delete item');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete item. Please try again.');
                console.error('Error deleting item:', err.response?.data || err.message);
            }
        }, [fetchListings]);

        if (loading) {
            return (
                <div className="flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4 min-h-[200px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
                        <p className="text-gray-700 text-lg">Loading your listings...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6 text-center bg-white rounded-xl shadow border-2 border-[#D32F2F]">
                    <p className="text-base font-semibold text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={fetchListings}
                        className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

    return (
            <div className="w-full">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Items Posted</h2>
                    {listings.length === 0 ? (
                        <div className="p-6 text-center bg-white rounded-xl shadow border-2 border-[#D32F2F]">
                            <p className="text-base font-semibold text-gray-700 mb-4">You haven't posted any items yet.</p>
                            <button
                                onClick={() => navigate('/post-item')}
                                className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
                            >
                                Post an Item
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {listings.map((item) => (
                                <div key={item.id} className="relative group rounded-xl shadow ring-1 ring-gray-200 bg-white hover:shadow-md transition-all duration-200 flex flex-col min-h-[320px]">
                                    <div className="p-0 flex-1 flex flex-col">
                                        {/* You can use your ItemCard here if you want a consistent look */}
                                        <div className="w-full h-40 rounded-t-xl overflow-hidden bg-gray-100 flex-shrink-0 border-b border-gray-200">
                                            <img
                                                src={item.imageUrl || `https://via.placeholder.com/96x96?text=${item.name || 'Item'}`}
                                                alt={item.name || 'Listed Item'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{item.name || 'Unknown Item'}</h3>
                                            <div className="text-xs text-gray-500 mb-2">{item.category || 'Category'}</div>
              <div className="font-bold text-[#B9162C] mb-2">₹{item.pricePerDay}/day</div>
                                            <div className="flex-1" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 px-4 pb-4 pt-0">
                                        <button
                                            onClick={() => navigate(`/edit-item/${item.id}`)}
                                            className="flex-1 px-3 py-2 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="flex-1 px-3 py-2 rounded bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        >
                                            Delete
                                        </button>
              </div>
            </div>
                            ))}
                        </div>
          )}
        </div>
      </div>
    );
  }

    // --- My Payments Section (No Changes) ---
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
  
    // --- My Wishlist Section (No Changes) ---
  function MyWishlistSection() {
        const { user, isLoggedIn } = useAuth();
        const [wishlistItems, setWishlistItems] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        // Fetch wishlist items
    const fetchWishlist = useCallback(async () => {
            if (!isLoggedIn || !user?.email) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await API.get(`/users/wishlist/${user.email}`);
                setWishlistItems(response.data);
            } catch (err) {
                setError('Failed to fetch wishlist. Please try again.');
                console.error('Error fetching wishlist:', err.response?.data || err.message);
        } finally {
                setLoading(false);
        }
        }, [isLoggedIn, user?.email]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

        const handleRemoveFromWishlist = async (itemId) => {
            const confirmRemove = window.confirm("Are you sure you want to remove this item from your wishlist?");
            if (!confirmRemove) return;
            if (!isLoggedIn || !user?.email) {
                alert("You must be logged in to remove items from your wishlist.");
                return;
            }
            try {
                await API.post(`/users/wishlist/remove/${user.email}/${itemId}`);
                setWishlistItems(prev => prev.filter(item => item.id !== itemId));
                alert('Item removed from wishlist successfully!');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to remove item from wishlist. Please try again.';
                alert(`Error: ${errorMessage}`);
                console.error('Error removing from wishlist:', error.response?.data || error.message);
            }
        };

        if (loading) {
            return (
                <div className="flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4 min-h-[200px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
                        <p className="text-gray-700 text-lg">Loading your wishlist...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6 text-center bg-white rounded-xl shadow border-2 border-[#D32F2F]">
                    <p className="text-base font-semibold text-gray-700 mb-4">{error}</p>
                    <button
                        onClick={fetchWishlist}
                        className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
    
    return (
            <div className="w-full">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">My Wishlist</h2>
                    {wishlistItems.length === 0 ? (
                        <div className="p-6 text-center bg-white rounded-xl shadow border-2 border-[#D32F2F]">
                            <div className="text-4xl mb-2 text-[#D32F2F]">❤️</div>
                            <p className="text-base font-semibold text-gray-700 mb-4">Your wishlist is empty</p>
                            <button
                                onClick={() => window.location.href='/items'}
                                className="bg-[#D32F2F] text-white font-bold px-6 py-3 rounded-lg shadow text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
                            >
                                Browse Items
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="relative bg-white rounded-xl shadow border-2 border-[#D32F2F] hover:shadow-md transition-all duration-200 flex flex-col min-h-[320px]">
                                    <div className="w-full h-40 rounded-t-xl overflow-hidden bg-gray-100 flex-shrink-0 border-b border-gray-200">
                                        <img
                                            src={item.imageUrl || `https://via.placeholder.com/96x96?text=${item.name || 'Item'}`}
                                            alt={item.name || 'Wishlist Item'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-4 flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{item.name || 'Unknown Item'}</h3>
                                        <div className="text-xs text-gray-500 mb-2">{item.category || 'Category'}</div>
                                        <div className="font-bold text-[#B9162C] mb-2">₹{item.pricePerDay}/day</div>
                                        <div className="flex-1" />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.id)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
                                        title="Remove from wishlist"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
  }

    // --- Account Information Section (No Changes) ---
function AccountInfoSection() {
  const { user } = useAuth();
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

        // Fetch latest profile details from /profile
        const fetchProfile = useCallback(async () => {
            try {
                const response = await API.get('/profile');
                const profile = response.data;
                setForm({
                    fullName: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    college: profile.college || 'MIT AOE',
                    prn: profile.prn || '',
                    academicYear: profile.academicYear || ''
                });
            } catch (err) {
                // Optionally handle error
            }
        }, []);

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
                await API.put('/users/edit-profile', form);
      setSuccess('Profile updated successfully! ✅');
                await fetchProfile(); // Fetch latest profile after update
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

        useEffect(() => {
            fetchProfile();
        }, [fetchProfile]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto mb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
      {success && <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-4 text-center">{success}</div>}
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
      <form className="space-y-6" onSubmit={handleSubmit}>
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

    // --- Change Password Section (No Changes) ---
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

    // --- REMOVED: Top-level loading and error UI are no longer needed here ---
    // Each section component handles its own loading/error states.

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
                  {/* Quick Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Orders */}
                    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                                            <FaBox className="text-[#B9162C] text-2xl mb-2" />
                      <div className="text-gray-700 font-semibold mb-2">My Orders</div>
                                            <button onClick={() => setActiveSection('My Orders')} className="mt-auto bg-[#B9162C] text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-[#a01325] transition-all duration-200 w-full">View Orders</button>
                    </div>
                    {/* Listings */}
                    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                                            <FaList className="text-blue-600 text-2xl mb-2" />
                      <div className="text-gray-700 font-semibold mb-2">Items Posted</div>
                                            <button onClick={() => setActiveSection('My Listings')} className="mt-auto bg-blue-600 text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-blue-700 transition-all duration-200 w-full">Manage</button>
                    </div>
                    {/* Payments */}
                    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                                            <FaCreditCard className="text-green-600 text-2xl mb-2" />
                                            <div className="text-gray-700 font-semibold mb-2">My Payments</div>
                                            <button onClick={() => setActiveSection('My Payments')} className="mt-auto bg-green-600 text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-green-700 transition-all duration-200 w-full">View Payments</button>
                    </div>
                    {/* Wishlist */}
                    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start">
                                            <FaHeart className="text-pink-500 text-2xl mb-2" />
                                            <div className="text-gray-700 font-semibold mb-2">My Wishlist</div>
                                            <button onClick={() => setActiveSection('My Wishlist')} className="mt-auto bg-pink-500 text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-pink-600 transition-all duration-200 w-full">View Wishlist</button>
                    </div>
                  </div>
                </>
              )}
                            {/* --- MODIFIED: Added MyWishlistSection to the conditional rendering --- */}
              {activeSection === 'My Orders' && <MyOrdersSection />}
              {activeSection === 'My Listings' && <MyListingsSection />}
              {activeSection === 'My Payments' && <MyPaymentsSection />}
                            {activeSection === 'My Wishlist' && <MyWishlistSection />}
              {activeSection === 'Account Information' && <div className="mb-16"><AccountInfoSection /></div>}
              {activeSection === 'Change Password' && <ChangePasswordSection />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;