import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../services/api";
import ExtendBookingModal from '../components/ExtendBookingModal';
import ConfirmationModal from '../components/ConfirmationModal';

const MyBookings = () => {
  const { user, isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // State for Modals
  const [extendModal, setExtendModal] = useState({ open: false, booking: null });
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendError, setExtendError] = useState('');

  const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnStep, setReturnStep] = useState(1);
  const [otp, setOtp] = useState("");

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

  // Extend Modal Functions
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

  // Cancel Modal Functions
  const handleOpenCancelModal = (booking) => {
    setCancelModal({ open: true, booking });
    setCancelError('');
  };
  const handleCloseCancelModal = () => {
    setCancelModal({ open: false, booking: null });
    setCancelError('');
  };
  const handleCancelBookingConfirm = async () => {
    setCancelLoading(true);
    setCancelError('');
    try {
      await API.put(`/bookings/cancel/${cancelModal.booking.id}`);
      handleCloseCancelModal();
      fetchBookingsAndSummary();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking.';
      setCancelError(errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  // Return Modal Functions
  const openReturnModal = (booking) => {
    setSelectedBooking(booking);
    setReturnStep(1);
    setOtp("");
    setShowReturnModal(true);
  };
  const handleRequestOtp = async () => {
    if (!selectedBooking) return;
    try {
      const response = await API.post(`/bookings/return/request-otp/${selectedBooking.id}`);
      alert(response.data);
      setReturnStep(2);
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
      console.error("Error requesting OTP:", error);
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!selectedBooking) return;
    try {
      const response = await API.post(`/bookings/return/verify-otp/${selectedBooking.id}`, null, {
        params: { otp }
      });
      alert(response.data);
      setShowReturnModal(false);
      fetchBookingsAndSummary();
    } catch (error) {
      alert("Invalid or expired OTP. Please try again.");
      console.error("Error verifying OTP:", error);
    }
  };

  // Helper functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 text-green-800 border-green-300", text: "Active" },
      COMPLETED: { color: "bg-blue-100 text-blue-800 border-blue-300", text: "Completed" },
      UPCOMING: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", text: "Upcoming" },
      CANCELED: { color: "bg-red-100 text-red-800 border-red-300", text: "Canceled" },
    };
    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-300", text: status };
    return <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>{config.text}</span>;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
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
    return <div className="min-h-screen flex items-center justify-center bg-[#fff3f3]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F]"></div></div>;
  }
  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fff3f3]"><div className="text-center p-8"><h1 className="text-2xl font-bold mb-4">Access Denied</h1><p>Please log in to view your bookings.</p><Link to="/login" className="mt-4 inline-block bg-[#D32F2F] text-white px-6 py-2 rounded">Go to Login</Link></div></div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 bg-[#fff3f3] rounded-xl shadow-md border-2 border-[#D32F2F] text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">My Bookings 📋</h1>
          <p className="text-gray-700 text-lg font-medium">Manage and track all your rental bookings</p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row gap-5 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">Search Items</label>
              <input id="search" type="text" placeholder="Search by item name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none" />
            </div>
            <div className="w-full md:w-48">
              <label htmlFor="filter" className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
              <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none">
                <option value="all">All Bookings</option>
                <option value="ACTIVE">Active</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 flex items-center justify-between"><p>{error}</p><button onClick={fetchBookingsAndSummary} className="px-6 py-2 bg-red-600 text-white rounded-lg">Try Again</button></motion.div>}

        {/* Booking Summary */}
        {summary && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-xl shadow-md p-6 border-2 border-[#D32F2F]"> {/* ...summary content... */}</motion.div>}

        {/* Modals */}
        <ExtendBookingModal isOpen={extendModal.open} onClose={handleCloseExtendModal} onSubmit={handleExtendBookingSubmit} currentEndDate={extendModal.booking?.endDate.split('T')[0]} minDate={extendModal.booking?.endDate.split('T')[0]} loading={extendLoading} error={extendError} />
        <ConfirmationModal isOpen={cancelModal.open} title="Cancel Booking" message="Are you sure you want to cancel this booking?" onConfirm={handleCancelBookingConfirm} onCancel={handleCloseCancelModal} confirmText={cancelLoading ? 'Cancelling...' : 'Cancel Booking'} error={cancelError} />

        <AnimatePresence>
          {showReturnModal && selectedBooking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full border-2 border-orange-500">
                <h2 className="text-2xl font-extrabold uppercase text-center mb-4 text-orange-600 tracking-wide">Return Item</h2>
                {returnStep === 1 && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">To return <span className="font-bold">{selectedBooking.item?.name}</span>, an OTP will be sent to your email.</p>
                    <button onClick={handleRequestOtp} className="w-full bg-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg uppercase text-base border-2 border-orange-500 hover:bg-orange-600">Request OTP</button>
                  </div>
                )}
                {returnStep === 2 && (
                  <div>
                    <p className="text-center text-gray-600 mb-6">An OTP has been sent. Enter it below to confirm the return.</p>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength="6" className="w-full text-center tracking-[.5em] text-2xl font-bold px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                    <button onClick={handleVerifyOtp} className="w-full mt-4 bg-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg uppercase text-base border-2 border-orange-500 hover:bg-orange-600">Verify & Complete Return</button>
                  </div>
                )}
                <button onClick={() => setShowReturnModal(false)} className="w-full mt-4 bg-gray-200 text-gray-800 font-bold px-6 py-3 rounded-lg shadow-md uppercase text-base border-2 border-gray-200 hover:bg-gray-300">Cancel</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center bg-white rounded-xl shadow-md border-2 border-[#D32F2F]"><p className="text-xl font-semibold text-gray-700 mb-6">No bookings found.</p><Link to="/items" className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg">Browse Items</Link></motion.div>
          ) : (
            <AnimatePresence>
              {filteredBookings.map((booking, index) => (
                <motion.div key={booking.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Item Info */}
                      <div className="flex gap-4 items-center flex-1">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-[#fff3f3]">
                          <img src={booking.item?.imageUrl || `https://via.placeholder.com/96x96?text=${booking.item?.name || 'Item'}`} alt={booking.item?.name || "Booked Item"} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-extrabold uppercase text-[#222] mb-1 tracking-wide">{booking.item?.name || "Unknown Item"}</h3>
                          <p className="text-sm text-gray-600 mb-2 font-medium">Owner: <span className="font-semibold">{booking.owner?.name || "N/A"}</span><br />Email: <span className="font-semibold">{booking.owner?.email || "N/A"}</span></p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
                            <span className="font-medium">📅 {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                            <span className="font-medium">💰 ₹{booking.item?.pricePerDay || 0} /day</span>
                            <span className="font-bold text-[#D32F2F] text-base">💳 Total: ₹{booking.totalAmount || 0}</span>
                          </div>
                        </div>
                      </div>
                      {/* Status and Actions */}
                      <div className="flex flex-col items-center lg:items-end gap-3 mt-4 lg:mt-0">
                        {getStatusBadge(booking.status)}
                        <div className="flex gap-2 mt-2 flex-wrap justify-center lg:justify-end">
                          <Link to={`/booking/${booking.id}`} className="bg-[#D32F2F] text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all">View Details</Link>
                          {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (<button onClick={() => handleOpenCancelModal(booking)} className="bg-red-500 text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-red-500 hover:bg-white hover:text-red-500 transition-all">Cancel</button>)}
                          {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (<button onClick={() => handleOpenExtendModal(booking)} className="bg-indigo-500 text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-indigo-500 hover:bg-white hover:text-indigo-500 transition-all">Extend</button>)}
                          {(booking.status === "ACTIVE") && (<button onClick={() => openReturnModal(booking)} className="bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-orange-500 hover:bg-white hover:text-orange-500 transition-all">Return</button>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;