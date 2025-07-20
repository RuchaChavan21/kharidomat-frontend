import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard'; // Import ItemCard
import API from '../services/api'; // Import API service

const RecentListings = () => {
    const { isLoggedIn, token, user } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useTheme();

    // Fetch listings from the actual API
    const fetchListings = useCallback(async () => {
        // Essential check: If not logged in or token/user info is missing, stop.
        // The outer useEffect will handle redirection.
        if (!isLoggedIn || !token || !user?.email) { 
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // CORRECTED API CALL: Using /api/items/my
            const response = await API.get('/items/my'); 
            setListings(response.data); // Assuming response.data is an array of Item objects
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch your listings. Please try again.';
            setError(errorMessage);
            console.error('Error fetching listings:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, token, user?.email]); // Dependencies for useCallback

    // Access control and initial data fetch on component mount
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect if not authenticated
        } else {
            fetchListings(); // Fetch if logged in
        }
    }, [isLoggedIn, navigate, fetchListings]); // Depend on fetchListings (due to useCallback)

    // Helper for displaying item status (e.g., Available, Rented)
    // This is distinct from BookingStatus in MyBookings.jsx
    const getItemStatusBadge = useCallback((status) => {
        if (status === 'Available' || status === 'ACTIVE') {
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Available</span>;
        } else if (status === 'Rented' || status === 'UNAVAILABLE' || status === 'BOOKED') {
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Rented</span>;
        } else if (status === 'MAINTENANCE') { // Example for maintenance status
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Maintenance</span>;
        } else {
            return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">{status}</span>;
        }
    }, []);

    // Handler for deleting an item
    const handleDeleteItem = useCallback(async (itemIdToDelete) => {
        if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }
        try {
            // ACTUAL API CALL: DELETE /api/items/{itemId}
            const response = await API.delete(`/items/${itemIdToDelete}`); // Assuming DELETE method
            
            if (response.status === 200 || response.status === 204) { // 200 OK or 204 No Content
                alert('Item deleted successfully!');
                fetchListings(); // Re-fetch the list to update UI
            } else {
                throw new Error(response.data?.message || 'Failed to delete item');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete item. Please try again.');
            console.error('Error deleting item:', err.response?.data || err.message);
        }
    }, [fetchListings]); // Depend on fetchListings to re-fetch after delete

    // Helper to format date (reused from Dashboard/MyBookings)
    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, []);


    // --- Conditional Rendering for Loading, Access Denied, Error ---

    // Loading State
    if (loading) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'} pt-20 transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-300">Loading your listings...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Access Denied (Not Logged In) State
    if (!isLoggedIn) {
        // This case is handled by the useEffect redirecting to /login
        // This return null prevents further rendering errors if the redirect hasn't happened yet.
        return null;
    }

    // Error State (if API calls failed)
    if (error) {
        return (
            <div className="min-h-screen bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center justify-center pt-20 transition-colors duration-300">
                <div className="max-w-xl mx-auto text-center p-8 rounded-lg shadow-md border border-red-200 dark:border-red-700">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Listings</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={fetchListings}
                        className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // --- Main Content (Displayed if not loading, logged in, and no error) ---
    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'} pt-20 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 leading-tight tracking-tight">My Recent Listings</h1>
                        <p className="text-base text-gray-500 dark:text-gray-300 font-medium">All items you've posted for rent</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center px-5 py-2 rounded bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                    >
                        <span className="text-lg mr-2">←</span> Back to Dashboard
                    </button>
                </div>

                {/* No Listings Found State */}
                {listings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-14 text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300 flex flex-col items-center justify-center backdrop-blur"
                    >
                        <div className="text-7xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No listings found</h3>
                        <p className="text-gray-500 dark:text-gray-300 mb-8 text-base">You haven't posted any items yet.</p>
                        <button
                            onClick={() => navigate('/post-item')}
                            className="inline-flex items-center px-7 py-3 rounded bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        >
                            <span className="text-lg mr-2">＋</span> Post an Item
                        </button>
                    </motion.div>
                ) : (
                    // Listings Grid
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.08
                                }
                            }
                        }}
                    >
                        <AnimatePresence>
                            {listings.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                                    className="relative group rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col min-h-[420px]"
                                >
                                    {/* ItemCard displays item details and general actions (wishlist, rent) */}
                                    <div className="p-0 flex-1 flex flex-col">
                                        <ItemCard item={item} />
                                    </div>
                                    {/* Owner-specific actions (Edit/Delete) placed outside ItemCard */}
                                    <div className="flex gap-2 px-5 pb-5 pt-0">
                                        <button 
                                            onClick={() => navigate(`/edit-item/${item.id}`)}
                                            className="flex-1 px-3 py-2 rounded bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="flex-1 px-3 py-2 rounded bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecentListings;