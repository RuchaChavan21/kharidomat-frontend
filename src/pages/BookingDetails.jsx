import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import API from "../services/api";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await API.get(`/bookings/${bookingId}`); // Assuming /api prefix
      setBooking(response.data);
    } catch (err) {
      setError(
        "Failed to fetch booking details. It might not exist or you may not have permission to view it."
      );
      console.error("Error fetching booking:", err);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  const handleCancelBooking = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      setIsCancelling(true);
      await API.put(`/bookings/cancel/${bookingId}`);
      alert("Booking cancelled successfully!");
      fetchBookingDetails();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to cancel the booking.";
      alert(`Error: ${errorMessage}`);
      console.error("Error cancelling booking:", err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleExtendBooking = async () => {
    const newEndDateStr = prompt(
      `The current booking ends on ${formatDate(
        booking.endDate
      )}. Please enter the new end date (YYYY-MM-DD):`,
      booking.endDate.split("T")[0]
    );
    if (!newEndDateStr) return;
    if (new Date(newEndDateStr) <= new Date(booking.endDate)) {
      alert("The new end date must be after the current end date.");
      return;
    }
    try {
      setIsExtending(true);
      await API.put(
        `/bookings/extend/${bookingId}?newEndDate=${newEndDateStr}`
      );
      alert("Booking extended successfully!");
      fetchBookingDetails();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to extend the booking.";
      alert(`Error: ${errorMessage}`);
      console.error("Error extending booking:", err);
    } finally {
      setIsExtending(false);
    }
  };

  const isActive = () => {
    return booking.status === "ACTIVE" || booking.status === "UPCOMING";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      ACTIVE: "🟢",
      UPCOMING: "⏳",
      COMPLETED: "✅",
      CANCELED: "❌",
    };
    return icons[status] || "❓";
  };

  // +++ NEW: HELPER FUNCTION TO DISPLAY DEPOSIT STATUS +++
  const renderDepositStatus = (booking) => {
    // Don't render anything if there was no deposit or status is missing
    if (!booking.securityDeposit || !booking.depositStatus) {
      return null;
    }

    let statusStyle = "";
    let statusText = "";

    switch (booking.depositStatus) {
      case "REFUNDED":
        statusStyle = "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
        statusText = `✅ Refunded (₹${booking.securityDeposit})`;
        break;
      case "FORFEITED":
        statusStyle = "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
        statusText = `❌ Forfeited (₹${booking.securityDeposit})`;
        break;
      case "HELD":
      default:
        statusStyle = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
        statusText = `⏳ Held (₹${booking.securityDeposit})`;
        break;
    }

    return (
      <div>
        <h3 className="font-semibold text-gray-500 dark:text-gray-400">
          Security Deposit
        </h3>
        <span className={`px-3 py-1 mt-1 inline-block rounded-full text-sm font-medium ${statusStyle}`}>
          {statusText}
        </span>
      </div>
    );
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied or Not Found
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {booking.item.name}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : booking.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : booking.status === "CANCELED"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {getStatusIcon(booking.status)} {booking.status}
                  </span>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Booking ID: {booking.id}
                </div>
              </div>
              <div className="text-left sm:text-right mt-4 sm:mt-0">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  ₹{booking.totalAmount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Paid
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Item Image */}
              <div className="md:col-span-1">
                <img
                  src={
                    `/items/image/${booking.item.imageUrl}` || // Assuming correct image URL structure
                    "https://via.placeholder.com/400x300?text=Item"
                  }
                  alt={booking.item.name}
                  className="w-full h-auto object-cover rounded-xl shadow-md"
                />
              </div>

              {/* Booking Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-500 dark:text-gray-400">
                    Booking Period
                  </h3>
                  <p className="text-lg text-gray-800 dark:text-gray-100">
                    {formatDate(booking.startDate)} to{" "}
                    {formatDate(booking.endDate)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 dark:text-gray-400">
                    Item Owner
                  </h3>
                  <p className="text-lg text-gray-800 dark:text-gray-100">
                    {booking.owner.fullName} ({booking.owner.email})
                  </p>
                </div>

                {/* +++ ADDED: Display the deposit status here +++ */}
                {renderDepositStatus(booking)}

                {booking.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-500 dark:text-gray-400">
                      Notes from Renter
                    </h3>
                    <p className="text-lg text-gray-800 dark:text-gray-100 italic">
                      "{booking.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-end">
              {isActive() && (
                <>
                  <button
                    onClick={handleExtendBooking}
                    disabled={isExtending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExtending ? "Extending..." : "Extend"}
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel"}
                  </button>
                </>
              )}
              <button
                onClick={() => navigate("/my-bookings")}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDetails;