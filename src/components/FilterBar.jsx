import React from 'react';
import { motion } from 'framer-motion';

const FilterBar = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { name: 'All', icon: '🏠' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Stationery', icon: '✏️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Books', icon: '📚' },
  ];

  const getCategoryColor = (categoryName) => {
    const colors = {
      'All': 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
      'Electronics': 'bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900 dark:text-accent-200 dark:hover:bg-accent-800',
      'Stationery': 'bg-mint-100 text-mint-700 hover:bg-mint-200 dark:bg-mint-900 dark:text-mint-200 dark:hover:bg-mint-800',
      'Music': 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800',
      'Sports': 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800',
      'Books': 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800',
    };
    return colors[categoryName] || colors['All'];
  };

  const getActiveColor = (categoryName) => {
    const colors = {
      'All': 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900',
      'Electronics': 'bg-accent-600 text-white dark:bg-accent-200 dark:text-accent-900',
      'Stationery': 'bg-mint-600 text-white dark:bg-mint-200 dark:text-mint-900',
      'Music': 'bg-purple-600 text-white dark:bg-purple-200 dark:text-purple-900',
      'Sports': 'bg-orange-600 text-white dark:bg-orange-200 dark:text-orange-900',
      'Books': 'bg-purple-600 text-white dark:bg-purple-200 dark:text-purple-900',
    };
    return colors[categoryName] || colors['All'];
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {categories.map((category, index) => (
          <motion.button
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category.name)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              selectedCategory === category.name
                ? getActiveColor(category.name)
                : getCategoryColor(category.name)
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
