import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  RETURNED: 'bg-blue-100 text-blue-800 border-blue-300',
  COMPLETED: 'bg-gray-100 text-gray-700 border-gray-300',
};

const PaymentsPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchPayments = async () => {
      try {
        const res = await API.get('/bookings/my');
        setBookings(res.data);
        console.log('PaymentsPage bookings:', res.data);
      } catch (err) {
        console.error('API error:', err);
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [token]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar with Title and Back Button */}
        <div className="flex justify-between items-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">Payment History</h1>
            <p className="text-gray-700 text-lg font-medium">All your completed and active rental payments</p>
          </motion.div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-red-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D32F2F]" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg font-medium py-32">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg font-medium py-32">
            No payments made yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Item Info */}
                    <div className="flex gap-4 items-center flex-1">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-[#fff3f3]">
                        <img
                          src={booking.item?.imageUrl ? `/images/${booking.item.imageUrl}` : `https://via.placeholder.com/96x96?text=${booking.item?.title || 'Item'}`}
                          alt={booking.item?.title || 'Payment Item'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-extrabold uppercase text-[#222] mb-1 tracking-wide truncate">{booking.item?.title || 'Unknown Item'}</h3>
                        <div className="text-xs text-gray-500 mb-1">
                          {booking.startDate && booking.endDate && (
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()} &rarr; {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[booking.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>{booking.status}</span>
                      </div>
                    </div>
                    {/* Amount */}
                    <div className="flex flex-col items-end justify-center mt-4 lg:mt-0">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="text-lg font-bold text-[#D32F2F]">₹{booking.amount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
