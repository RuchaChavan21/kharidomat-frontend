import React from 'react';
import { motion } from 'framer-motion';

const BookingsTable = ({ bookings, onCancelBooking }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rentals yet</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">Start exploring items to rent and they'll appear here</p>
        <a href="/items" className="btn-primary">
          Browse Items
        </a>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Owner</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Start Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={booking.itemImage} 
                      alt={booking.itemName}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.itemName}</p>
                      <p className="text-xs text-gray-500">ID: {booking.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{booking.owner}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.startDate)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.endDate)}</td>
                <td className="px-6 py-4 text-sm font-medium text-purple-600">₹{booking.price}/day</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{booking.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
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
                    <button className="text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors duration-200">
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
  );
};

export default BookingsTable; 