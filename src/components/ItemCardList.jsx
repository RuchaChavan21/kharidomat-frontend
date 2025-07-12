import React from 'react';
import { motion } from 'framer-motion';

const ItemCardList = ({ items, onDeleteItem }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'bg-accent-100 text-accent-700',
      'Stationery': 'bg-mint-100 text-mint-700',
      'Music': 'bg-purple-100 text-purple-700',
      'Sports': 'bg-orange-100 text-orange-700',
      'Books': 'bg-purple-100 text-purple-700',
      'default': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.default;
  };

  if (items.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
        <p className="text-gray-600 mb-6">Start listing your items to earn money and help other students</p>
        <a href="/items/add" className="btn-primary">
          Add Your First Item
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="card group overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
            
            {/* Price Badge */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-purple-600">
              ₹{item.pricePerDay}/day
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
              {item.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {item.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-purple-600">{item.totalBookings}</p>
                <p className="text-xs text-gray-500">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">₹{item.totalEarnings}</p>
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200">
                Edit
              </button>
              <button 
                onClick={() => onDeleteItem(item.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ItemCardList; 