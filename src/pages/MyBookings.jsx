import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import ExtendBookingModal from '../components/ExtendBookingModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { Calendar, MapPin, DollarSign, Clock, Eye, Filter, SortAsc, SortDesc } from 'lucide-react';

const MyBookings = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
      const orderResponse = await API.post(`/bookings/${extendModal.booking.id}/create-extension-order`, {
        newEndDate: newEndDate,
      });
      const { orderId, amount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_n5Y0q2oWkbhx2b",
        amount: amount,
        currency: currency,
        name: "KharidoMat",
        description: `Extend booking for ${extendModal.booking.item.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await API.post(`/bookings/${extendModal.booking.id}/verify-and-extend`, {
              newEndDate: newEndDate,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Booking extended successfully!");
            handleCloseExtendModal();
            fetchBookingsAndSummary();

          } catch (verificationError) {
            console.error("Payment verification failed:", verificationError);
            setExtendError("Payment succeeded, but failed to update booking. Please contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setExtendLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error(response);
        setExtendError(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      return;

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Could not initiate extension payment.';
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
      ACTIVE: { 
        color: "bg-green-100 text-green-800 border-green-300", 
        text: "Confirmed",
        icon: "✅"
      },
      UPCOMING: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-300", 
        text: "Pending",
        icon: "⏳"
      },
      COMPLETED: { 
        color: "bg-blue-100 text-blue-800 border-blue-300", 
        text: "Completed",
        icon: "✅"
      },
      CANCELED: { 
        color: "bg-red-100 text-red-800 border-red-300", 
        text: "Cancelled",
        icon: "❌"
      },
    };
    const config = statusConfig[status] || { 
      color: "bg-gray-100 text-gray-800 border-gray-300", 
      text: status,
      icon: "❓"
    };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  // ADD THIS ENTIRE FUNCTION
const renderDepositStatus = (booking) => {
    // Don't render anything if there was no deposit or status is missing
    if (!booking.securityDeposit || !booking.depositStatus) {
      return null;
    }

    let statusStyle = "";
    let statusText = "";

    switch (booking.depositStatus) {
      case "REFUNDED":
        statusStyle = "bg-green-100 text-green-700 border-green-300";
        statusText = `✅ Deposit Refunded`;
        break;
      case "FORFEITED":
        statusStyle = "bg-red-100 text-red-800 border-red-300";
        statusText = `❌ Deposit Forfeited`;
        break;
      case "HELD":
      default:
        statusStyle = "bg-yellow-100 text-yellow-700 border-yellow-300";
        statusText = `⏳ Deposit Held`;
        break;
    }

    return (
       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle}`}>
         {statusText}
       </span>
    );
};

  const getPaymentStatusBadge = (booking) => {
    // Determine payment status based on booking data
    const isPaid = booking.status === 'ACTIVE' || booking.status === 'COMPLETED';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        isPaid 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : 'bg-orange-100 text-orange-800 border border-orange-300'
      }`}>
        {isPaid ? '💰 Paid' : '⏳ Pending'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      const matchesFilter = filter === "all" || booking.status === filter;
      const itemName = booking.item?.name || "";
      const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to view your bookings.</p>
          <Link 
            to="/login" 
            className="inline-block bg-[#D32F2F] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage and track all your rental bookings</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Items
              </label>
              <input 
                id="search" 
                type="text" 
                placeholder="Search by item name..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <div>
                <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select 
                  id="filter" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)} 
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none transition-colors"
                >
                  <option value="all">All Bookings</option>
                  <option value="ACTIVE">Confirmed</option>
                  <option value="UPCOMING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELED">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort
                </label>
                <select 
                  id="sort" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent outline-none transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchBookingsAndSummary} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Modals */}
        <ExtendBookingModal 
          isOpen={extendModal.open} 
          onClose={handleCloseExtendModal} 
          onSubmit={handleExtendBookingSubmit} 
          currentEndDate={extendModal.booking?.endDate.split('T')[0]} 
          minDate={extendModal.booking?.endDate.split('T')[0]} 
          loading={extendLoading} 
          error={extendError} 
        />
        <ConfirmationModal 
          isOpen={cancelModal.open} 
          title="Cancel Booking" 
          message="Are you sure you want to cancel this booking?" 
          onConfirm={handleCancelBookingConfirm} 
          onCancel={handleCloseCancelModal} 
          confirmText={cancelLoading ? 'Cancelling...' : 'Cancel Booking'} 
          error={cancelError} 
        />

        {/* Return Modal */}
        <AnimatePresence>
          {showReturnModal && selectedBooking && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 30 }} 
                className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border border-gray-200"
              >
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">Return Item</h2>
                {returnStep === 1 && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      To return <span className="font-semibold">{selectedBooking.item?.name}</span>, 
                      an OTP will be sent to your email.
                    </p>
                    <button 
                      onClick={handleRequestOtp} 
                      className="w-full bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Request OTP
                    </button>
                  </div>
                )}
                {returnStep === 2 && (
                  <div>
                    <p className="text-center text-gray-600 mb-6">
                      An OTP has been sent. Enter it below to confirm the return.
                    </p>
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      placeholder="Enter 6-digit OTP" 
                      maxLength="6" 
                      className="w-full text-center tracking-[.5em] text-2xl font-bold px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                    />
                    <button 
                      onClick={handleVerifyOtp} 
                      className="w-full bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Verify & Complete Return
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setShowReturnModal(false)} 
                  className="w-full mt-4 bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookings Grid */}
        <div className="space-y-6">
          {filteredAndSortedBookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "You have no bookings yet. Explore items to rent now!"
                  }
                </p>
                <Link 
                  to="/items" 
                  className="inline-flex items-center gap-2 bg-[#D32F2F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Browse Items
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredAndSortedBookings.map((booking, index) => (
                  <motion.div 
                    key={booking.id} 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, x: -50 }} 
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      {/* Item Info */}
                      <div className="flex gap-4 mb-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          {booking.item?.imageName ? (
                            <img
                              src={`http://localhost:8080/api/items/image/${booking.item.imageName}`}
                              alt={booking.item?.name || 'Item'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-400 ${booking.item?.imageName ? 'hidden' : 'flex'}`}>
                            <span className="text-xl">📦</span>
                          </div>
                        </div>
                        
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {booking.item?.name || "Unknown Item"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium">
                              {formatCurrency(booking.item?.pricePerDay || 0)} /day
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status and Payment Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking)}
                           {renderDepositStatus(booking)}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-lg font-bold text-[#D32F2F]">
                            {formatCurrency(booking.totalAmount || 0)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Link 
                          to={`/item/${booking.item.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#D32F2F] text-white font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>
                        
                        {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (
                          <button 
                            onClick={() => handleOpenCancelModal(booking)}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        
                        {(booking.status === "ACTIVE" || booking.status === "UPCOMING") && (
                          <button 
                            onClick={() => handleOpenExtendModal(booking)}
                            className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                          >
                            Extend
                          </button>
                        )}
                        
                        {booking.status === "ACTIVE" && (
                          <button 
                            onClick={() => openReturnModal(booking)}
                            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;