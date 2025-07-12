import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleRent = () => {
    if (!isLoggedIn) {
      alert('Please log in to rent items!');
      navigate('/login');
    } else {
      // Later we'll show item detail / booking flow
      alert(`Ready to book: ${item.title}`);
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

  return (
    <motion.div
      className="card group overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
          {item.category}
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-purple-600">
          ₹{item.pricePerDay}/day
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button
            onClick={handleRent}
            className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Rent Now
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
          {item.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{item.category}</p>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">₹{item.pricePerDay}</p>
            <p className="text-xs text-gray-500">per day</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-600 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200">
            View Details
          </button>
          <button 
            onClick={handleRent}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-glow hover:shadow-glow-lg"
          >
            Rent Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
