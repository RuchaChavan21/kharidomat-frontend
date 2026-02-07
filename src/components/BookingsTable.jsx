import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BookingsTable = ({ bookings, onCancelBooking }) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canCancelBooking = (status) => {
    return ['Active', 'Upcoming'].includes(status);
  };

  if (bookings.length === 0) {
    return (
      <div className="card p-12 text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No rentals yet</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">Start exploring items to rent and they'll appear here</p>
        <a href="/items" className="btn-primary">
          Browse Items
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block card overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Owner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Start Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">End Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={booking.itemImage}
                        alt={booking.itemName}
                        className="w-12 h-12 rounded-lg object-cover mr-3 border border-gray-200 dark:border-gray-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.itemName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">ID: {booking.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{booking.owner}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(booking.startDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(booking.endDate)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-purple-600 dark:text-purple-300">₹{booking.price}/day</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">₹{booking.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {canCancelBooking(booking.status) && (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/booking/${booking.id}`)}
                        className="text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 transition-colors duration-300"
          >
            {/* Header: Image, Title, Status */}
            <div className="flex items-start gap-3 mb-3">
              <img
                src={booking.itemImage}
                alt={booking.itemName}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate pr-2">{booking.itemName}</h3>
                  <span className={`flex-shrink-0 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ID: {booking.id}</p>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-300 mt-1">₹{booking.totalAmount}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Start Date</span>
                {formatDate(booking.startDate)}
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">End Date</span>
                {formatDate(booking.endDate)}
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Owner</span>
                {booking.owner}
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-0.5">Rate</span>
                ₹{booking.price}/day
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/booking/${booking.id}`)}
                className="flex-1 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                View Details
              </button>
              {canCancelBooking(booking.status) && (
                <button
                  onClick={() => onCancelBooking(booking.id)}
                  className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default BookingsTable; 