import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, User2, Eye, XCircle, CheckCircle } from 'lucide-react';

const VerifyReturns = () => {
  const [pendingReturns, setPendingReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingReturns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/bookings/returns/pending-for-owner");
      setPendingReturns(response.data);
    } catch (err) {
      setError("Failed to fetch pending returns. Please try again.");
      console.error("Error fetching pending returns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingReturns();
  }, [fetchPendingReturns]);

  const handleVerification = async (bookingId, isAccepted) => {
    const action = isAccepted ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${action} this return?`)) {
      return;
    }
    try {
      await API.post(`/bookings/return/verify/${bookingId}`, null, {
        params: { accepted: isAccepted }
      });
      alert(`Return ${action}d successfully!`);
      fetchPendingReturns();
    } catch (err) {
      alert(`Failed to ${action} the return. Please try again.`);
      console.error(`Error ${action}ing return:`, err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending returns...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Returns Verification</h1>
          <p className="text-gray-600">Approve or reject items returned by renters.</p>
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
                onClick={fetchPendingReturns}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Pending Returns Grid */}
        <div className="space-y-6">
          {pendingReturns.length === 0 && !error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending returns to verify</h3>
                <p className="text-gray-600 mb-6">
                  All returns have been processed. You have no pending returns to verify.
                </p>
                <Link
                  to="/items"
                  className="inline-flex items-center gap-2 bg-[#D32F2F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Explore Items
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {pendingReturns.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
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
                          {booking.item?.name || 'Unknown Item'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User2 className="w-4 h-4" />
                          <span>Rented by: <span className="font-medium">{booking.user?.name || 'N/A'}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Return initiated on: <span className="font-medium">{formatDate(new Date())}</span></span>
                        </div>
                      </div>
                      {/* Verification Actions */}
                      <div className="flex flex-col gap-2 mt-4 md:mt-0">
                        <button
                          onClick={() => handleVerification(booking.id, false)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleVerification(booking.id, true)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg border border-green-200 hover:bg-green-600 hover:text-white transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
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

export default VerifyReturns;