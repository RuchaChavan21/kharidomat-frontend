import React from 'react';
import { motion } from 'framer-motion';

const ItemCard = ({ item }) => {
  return (
    <motion.div
      className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover group-hover:scale-105 transition duration-300" />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <button className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-100 transition">
            Rent Now
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-purple-800">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.category}</p>
        <p className="mt-2 text-purple-600 font-bold">₹{item.pricePerDay}/day</p>
      </div>
    </motion.div>
  );
};

export default ItemCard;
