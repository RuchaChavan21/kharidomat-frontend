import { useState } from 'react';
import itemsData from '../data/items';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import { motion } from 'framer-motion';
import bgImage from '../assets/mitaoe.jpg';
import { useTheme } from '../context/ThemeContext';

const Items = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const filteredItems = itemsData
    .filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'priceLowHigh') return a.pricePerDay - b.pricePerDay;
      if (sortOption === 'priceHighLow') return b.pricePerDay - a.pricePerDay;
      if (sortOption === 'titleAsc') return a.title.localeCompare(b.title);
      if (sortOption === 'titleDesc') return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-20 transition-colors duration-300">
      {/* Header Section - Explore Rentals with mitaoe.jpg */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white min-h-[60vh] md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center px-6 md:px-16"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="relative z-10 text-center w-full max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white dark:text-gray-100">Explore Rentals</h1>
          <p className="text-lg md:text-xl text-white dark:text-gray-200">
            Discover everything you need for your academic journey, from textbooks to equipment
          </p>
        </div>
      </div>
      {/* Search and Filter Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for books, electronics, sports gear..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                />
              </div>
            </div>
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="input-field py-3 px-4 text-sm min-w-[180px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
              >
                <option value="default">Recommended</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="titleAsc">Name: A-Z</option>
                <option value="titleDesc">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      {/* Category Filter */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <FilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        </div>
      </section>
      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{filteredItems.length}</span> items
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4"> 50d</div>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Try adjusting your search terms or filters
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSortOption('default');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Items;
