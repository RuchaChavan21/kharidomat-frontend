import React from 'react';
import { motion } from 'framer-motion';
import ItemCard from './ItemCard';

const ItemCardList = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <motion.div
        className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-10 flex flex-col items-center justify-center text-center mt-12 mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600 mb-6">Start listing your items to earn money and help other students.</p>
        <a href="/post-item" className="inline-block px-6 py-3 bg-[#B9162C] text-white font-bold rounded-lg shadow hover:bg-[#a01325] transition-all duration-300 text-base mt-2">
          Add Your First Item
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, index) => (
        <ItemCard key={item.id || index} item={item} />
      ))}
    </motion.div>
  );
};

export default ItemCardList; 