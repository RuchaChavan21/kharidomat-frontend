import React, { useState, useEffect, useCallback } from 'react';
import ItemCard from '../components/ItemCard'; // Make sure ItemCard.jsx is updated as per our last conversation
import FilterBar from '../components/FilterBar';
import { motion } from 'framer-motion';
import bgImage from '../assets/mitaoe.jpg';
import { useTheme } from '../context/ThemeContext';
import API from '../services/api'; // Import your API service

const Items = () => {
    const { theme } = useTheme();
    const [items, setItems] = useState([]); // State to store fetched items
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state for API calls

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('default');

    // Function to fetch items based on filters and search terms
    const fetchItems = useCallback(async () => {
        setLoading(true); // Always set loading to true when starting a fetch
        setError(null);   // Clear any previous errors

        try {
            const params = new URLSearchParams();
            if (searchTerm) {
                params.append('title', searchTerm); // Use 'title' param for search
            }
            if (selectedCategory !== 'All') {
                params.append('category', selectedCategory); // Use 'category' param for filter
            }
            // If your backend /items/search supports sorting, append params here:
            // if (sortOption === 'priceLowHigh') params.append('sortBy', 'pricePerDay_asc');
            // else if (sortOption === 'priceHighLow') params.append('sortBy', 'pricePerDay_desc');
            // etc.

            // ACTUAL API CALL: Using /api/items/search with params for dynamic filtering
            const response = await API.get(`/items/search?${params.toString()}`);
            
            let fetchedItems = response.data;

            // Apply frontend sorting if backend doesn't sort or for 'default'
            fetchedItems = fetchedItems.sort((a, b) => {
                if (sortOption === 'priceLowHigh') return a.pricePerDay - b.pricePerDay;
                if (sortOption === 'priceHighLow') return b.pricePerDay - a.pricePerDay;
                if (sortOption === 'titleAsc') return a.title.localeCompare(b.title);
                if (sortOption === 'titleDesc') return b.title.localeCompare(a.title);
                // For 'default' or if createdAt is available, sort by newest
                if (sortOption === 'default' && a.createdAt && b.createdAt) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0; // Maintain original order if no specific sort or dates
            });

            setItems(fetchedItems);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load items. Please try again.';
            setError(errorMessage);
            console.error('Error fetching items:', err);
        } finally {
            setLoading(false); // Always set loading to false after fetch completes (success or error)
        }
    }, [selectedCategory, searchTerm, sortOption]); // Dependencies for useCallback

    // Trigger fetch when filters/search/sort change
    useEffect(() => {
        fetchItems();
    }, [fetchItems]); // Depend on memoized fetchItems

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'} pt-20 transition-colors duration-300`}>
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
                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center mb-8 transition-colors duration-300"
                        >
                            <p className="text-red-600 dark:text-red-300 font-medium">{error}</p>
                            <button
                                onClick={fetchItems} // Retry fetch
                                className="mt-4 px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition duration-300"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {/* Loading State - Conditionally rendered only if loading and no error */}
                    {loading && !error ? (
                        <div className="flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-300">Loading items...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Results Count - Rendered if not loading and no error */}
                            <div className="mb-8">
                                <p className="text-gray-600 dark:text-gray-300">
                                    Showing <span className="font-semibold text-purple-600 dark:text-purple-400">{items.length}</span> items
                                    {searchTerm && ` for "${searchTerm}"`}
                                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                                </p>
                            </div>
                            {/* Items Grid */}
                            {items.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <ItemCard
                                                item={{
                                                    ...item,
                                                    // ItemCard now expects imageUrl and owner directly,
                                                    // but ensures internal fallback for imageName and owner structure.
                                                    // No need for conversion here unless backend returns different names.
                                                    // For now, pass item as is.
                                                    // ItemCard is responsible for constructing the image URL
                                                    // and adapting owner structure itself.
                                                }}
                                            />
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
                                    <div className="text-6xl mb-4">🔍</div> {/* Corrected icon */}
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
                                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Items;