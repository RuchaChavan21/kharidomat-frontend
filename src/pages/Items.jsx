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
        <div className={`min-h-screen bg-[#F9F9F9] pt-20 transition-colors duration-300 font-sans`}> {/* Use same bg and font as home */}
            {/* Hero Section */}
            <section className="w-full bg-[#fff3f3] rounded-xl shadow-md border-2 border-[#D32F2F] max-w-4xl mx-auto mt-8 mb-8 px-8 py-10 flex flex-col items-center text-center">
                <h1 className="font-bold text-3xl md:text-4xl text-[#D32F2F] mb-2 uppercase tracking-wide">Discover What's Available</h1>
                <p className="text-gray-700 text-lg font-medium">Explore rental items posted by fellow students in your campus</p>
            </section>
            {/* Filter & Sort Bar */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white rounded-xl shadow-lg p-4">
                    {/* Search Bar */}
                    <div className="flex-1 w-full relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="20" height="20" fill="none" stroke="#B9162C" strokeWidth="2"><circle cx="9" cy="9" r="7"/><path d="M16 16l-3-3"/></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search for items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#B9162C] shadow-sm text-gray-900 bg-white transition-all duration-300"
                        />
                    </div>
                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-3 bg-white shadow-sm text-gray-900 focus:border-[#B9162C] transition-all duration-300"
                    >
                        <option value="All">All Categories</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Others">Others</option>
                    </select>
                    {/* Sort Dropdown */}
                    <select
                        value={sortOption}
                        onChange={e => setSortOption(e.target.value)}
                        className="rounded-lg border border-gray-200 px-4 py-3 bg-white shadow-sm text-gray-900 focus:border-[#B9162C] transition-all duration-300"
                    >
                        <option value="default">Recommended</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="titleAsc">Name: A-Z</option>
                        <option value="titleDesc">Name: Z-A</option>
                    </select>
                </div>
            </section>
            {/* Category Filter Bar (reuse FilterBar, but wrap in card) */}
            <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <FilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                </div>
            </section>
            {/* Results Section */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8"
                        >
                            <p className="text-[#B9162C] font-medium">{error}</p>
                            <button
                                onClick={fetchItems}
                                className="mt-4 px-6 py-2 bg-[#B9162C] text-white rounded-lg hover:bg-[#a01325] transition duration-300 font-bold"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                    {/* Loading State */}
                    {loading && !error ? (
                        <div className="flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B9162C] mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading items...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <div className="mb-8">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold text-[#B9162C]">{items.length}</span> items
                                    {searchTerm && ` for "${searchTerm}"`}
                                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                                </p>
                            </div>
                            {/* Items Grid */}
                            {items.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                        No items found
                                    </h3>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        Try adjusting your search terms or filters
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All');
                                            setSortOption('default');
                                        }}
                                        className="inline-flex items-center px-6 py-3 bg-[#B9162C] text-white rounded-lg hover:bg-[#a01325] transition duration-300 font-bold"
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