import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { name: 'All', icon: '🏠' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Books', icon: '📚' },
  { name: 'Furniture', icon: '🛏️' },
  { name: 'Hostel Essentials', icon: '🏠' },
  { name: 'Clothing & Costumes', icon: '👕' },
  { name: 'Sports Equipment', icon: '⚽' },
  { name: 'Bicycles', icon: '🚲' },
  { name: 'Event Decor', icon: '🎉' },
  { name: 'Musical Instruments', icon: '🎸' },
  { name: 'Lab Equipment', icon: '🧪' },
  { name: 'Mobile Accessories', icon: '📱' },
  { name: 'Kitchenware', icon: '🍳' },
  { name: 'Stationery', icon: '✏️' },
  { name: 'Others', icon: '📦' },
];

const FilterBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="flex overflow-x-auto gap-4 px-2 md:px-0 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        tabIndex={0}
        aria-label="Filter by Category"
      >
        {categories.map((category, idx) => {
          const isActive = selectedCategory === category.name;
          return (
            <motion.button
              key={category.name}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={`flex flex-col items-center justify-center min-w-[100px] max-w-[120px] px-4 py-3 rounded-xl border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B9162C] bg-white scrollSnapAlign-start
                ${isActive
                  ? 'border-[#B9162C] bg-[#fff3f3] text-[#B9162C] font-extrabold shadow-lg scale-105'
                  : 'border-gray-200 text-gray-700 hover:border-[#B9162C] hover:bg-[#fff3f3] hover:text-[#B9162C]'}
              `}
              style={{ scrollSnapAlign: 'start' }}
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              aria-pressed={isActive}
            >
              <span className="text-2xl md:text-3xl mb-1">{category.icon}</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wide">{category.name}</span>
            </motion.button>
          );
        })}
      </div>
      {/* Hide scrollbar utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.div>
  );
};

export default FilterBar;
