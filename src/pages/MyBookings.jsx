import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../services/api"; // Assuming API is correctly configured to include the token
import ExtendBookingModal from '../components/ExtendBookingModal';

const MyBookings = () => {
  const { user, isLoggedIn, token } = useAuth();
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

      // Fetch bookings for the current user (renter)
      const bookingsResponse = await API.get("/bookings/my");
      // Fetch summary of bookings grouped by status
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
      fetchBookingsAndSummary(); // Re-fetch data to update the UI
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

      alert(response.data); // Show the success message from the backend
      fetchBookingsAndSummary(); // Refresh the list
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to return item.";
      alert(`Error: ${errorMessage}`);
      console.error("Error returning item:", error);
    }
  };

  const handleExtendBooking = async (bookingId) => {
    // Prompt the user for the new end date
    const newEndDate = window.prompt("Please enter the new end date (YYYY-MM-DD):");

    // Validate the input
    if (!newEndDate || !/^\d{4}-\d{2}-\d{2}$/.test(newEndDate)) {
      alert("Invalid date format. Please use YYYY-MM-DD.");
      return;
    }

    try {
      // The backend expects the new date as a request parameter.
      // In Axios, you send this using the `params` config object.
      await API.put(`/bookings/extend/${bookingId}`, null, {
        params: { newEndDate }
      });

      alert("Booking extended successfully!");
      fetchBookingsAndSummary(); // Refresh the list
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

  // --- Start of UI Rendering ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] text-gray-900 font-sans p-4">
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
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-[#fff3f3] rounded-xl shadow-md border-2 border-[#D32F2F] text-center"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">
            My Bookings 📋
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Manage and track all your rental bookings
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="flex flex-col md:flex-row gap-5 items-end">
            {/* Search */}
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                Search Items
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none bg-white text-gray-900 transition-colors duration-300"
              />
            </div>
            {/* Filter */}
            <div className="w-full md:w-48">
              <label htmlFor="filter" className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none bg-white text-gray-900 transition-colors duration-300"
              >
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
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="font-medium text-center sm:text-left">{error}</p>
            <button
              onClick={fetchBookingsAndSummary}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 uppercase text-sm font-bold"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Booking Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 border-2 border-[#D32F2F]"
          >
            <h3 className="text-xl font-extrabold uppercase text-[#D32F2F] mb-4 text-center tracking-wide">
              Booking Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-[#D32F2F]">
                  {bookings.length}
                </p>
                <p className="text-base text-gray-700 font-medium">
                  Total Bookings
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-green-600">
                  {summary["ACTIVE"] || 0}
                </p>
                <p className="text-base text-gray-700 font-medium">
                  Active
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-blue-600">
                  {summary["COMPLETED"] || 0}
                </p>
                <p className="text-base text-gray-700 font-medium">
                  Completed
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-red-600">
                  {summary["CANCELED"] || 0}
                </p>
                <p className="text-base text-gray-700 font-medium">
                  Canceled
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Extend Booking Modal */}
        <ExtendBookingModal
          isOpen={extendModal.open}
          onClose={handleCloseExtendModal}
          onSubmit={handleExtendBookingSubmit}
          currentEndDate={extendModal.booking ? extendModal.booking.endDate.split('T')[0] : ''}
          minDate={extendModal.booking ? extendModal.booking.endDate.split('T')[0] : ''}
          loading={extendLoading}
        />
        {extendError && extendModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-center border border-red-300 pointer-events-auto">
              {extendError}
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 text-center bg-white rounded-xl shadow-md border-2 border-[#D32F2F]"
            >
              <p className="text-xl font-semibold text-gray-700 mb-6">
                No bookings found for the selected criteria.
              </p>
              <Link
                to="/items"
                className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200"
              >
                Browse Items to Book
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Item Info */}
                      <div className="flex gap-4 items-center flex-1">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-[#fff3f3]">
                          <img
                            src={
                              booking.item?.imageUrl ||
                              `https://via.placeholder.com/96x96?text=${booking.item?.name || 'Item'}` // More specific placeholder
                            }
                            alt={booking.item?.name || "Booked Item"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-extrabold uppercase text-[#222] mb-1 tracking-wide">
                            {booking.item?.name || "Unknown Item"}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 font-medium">
                            Owner:{" "}
                            <span className="font-semibold">
                              {booking.owner?.name || "N/A"}
                            </span>
                            Email:{" "}
                            <span className="font-semibold">
                              {booking.owner?.email || "N/A"}
                            </span>
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
                            <span className="font-medium">
                              📅 {formatDate(booking.startDate)} -{" "}
                              {formatDate(booking.endDate)}
                            </span>
                            <span className="font-medium">
                              💰 ₹{booking.item?.pricePerDay || 0}{" "}/day
                            </span>
                            <span className="font-bold text-[#D32F2F] text-base">
                              💳 Total: ₹{booking.totalAmount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Status and Actions */}
                      <div className="flex flex-col items-center lg:items-end gap-3 mt-4 lg:mt-0">
                        {getStatusBadge(booking.status)}
                        <div className="flex gap-2 mt-2 flex-wrap justify-center lg:justify-end">
                          <Link
                            to={`/booking/${booking.id}`}
                            className="bg-[#D32F2F] text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 whitespace-nowrap"
                          >
                            View Details
                          </Link>

                          {/* Cancel button */}
                          {(booking.status === "ACTIVE" ||
                            booking.status === "UPCOMING") && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="bg-red-500 text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-red-500 hover:bg-white hover:text-red-500 transition-all duration-200 whitespace-nowrap"
                              >
                                Cancel
                              </button>
                            )}
                          {/* Extend Booking button */}
                          {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (
                            <button
                              onClick={() => handleOpenExtendModal(booking)}
                              className="bg-white text-[#D32F2F] font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition-all duration-200 whitespace-nowrap"
                            >
                              Extend
                            </button>
                          )}

                          {/* Return Item button */}
                          {(booking.status === "ACTIVE") && (
                            <button
                              onClick={() => handleReturnItem(booking.id)}
                              className="bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow-md text-sm uppercase border-2 border-orange-500 hover:bg-white hover:text-orange-500 transition-all duration-200 whitespace-nowrap"
                            >
                              Return
                            </button>
                          )}
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