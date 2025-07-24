import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { Link } from 'react-router-dom';

const VerifyReturns = () => {
    const [pendingReturns, setPendingReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingReturns = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Call the new backend endpoint
            const response = await API.get("/bookings/returns/pending-for-owner");
            setPendingReturns(response.data);
        } catch (err) {
            setError("Failed to fetch pending returns. Please try again.");
            console.error("Error fetching pending returns:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingReturns();
    }, [fetchPendingReturns]);

    const handleVerification = async (bookingId, isAccepted) => {
        const action = isAccepted ? "approve" : "reject";
        if (!window.confirm(`Are you sure you want to ${action} this return?`)) {
            return;
        }

        try {
            // Call the verification endpoint
            await API.post(`/bookings/return/verify/${bookingId}`, null, {
                params: { accepted: isAccepted }
            });
            alert(`Return ${action}d successfully!`);
            // Refresh the list after verification
            fetchPendingReturns();
        } catch (err) {
            alert(`Failed to ${action} the return. Please try again.`);
            console.error(`Error ${action}ing return:`, err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#fff3f3]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F]"></div></div>;
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans pt-24">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 bg-[#fff3f3] rounded-xl shadow-md border-2 border-[#D32F2F] text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">
                        Verify Returns ✔️
                    </h1>
                    <p className="text-gray-700 text-lg font-medium">
                        Approve or reject items returned by renters.
                    </p>
                </motion.div>

                {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">{error}</div>}

                {/* Pending Returns List */}
                <div className="space-y-6">
                    {pendingReturns.length === 0 && !error ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center bg-white rounded-xl shadow-md border-2 border-[#D32F2F]">
                            <p className="text-xl font-semibold text-gray-700">You have no pending returns to verify.</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {pendingReturns.map((booking, index) => (
                                <motion.div key={booking.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] overflow-hidden">
                                    <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
                                        {/* Item Info */}
                                        <div className="flex gap-4 items-center flex-1">
                                            <img src={booking.item?.imageUrl || `https://via.placeholder.com/96x96?text=${booking.item?.name || 'Item'}`} alt={booking.item?.name || "Booked Item"} className="w-24 h-24 rounded-lg object-cover border-2 border-[#fff3f3]" />
                                            <div className="flex-1">
                                                <h3 className="text-xl font-extrabold uppercase text-[#222] mb-1 tracking-wide">{booking.item?.name}</h3>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Rented by: <span className="font-semibold">{booking.user?.name || "N/A"}</span>
                                                </p>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Return initiated on: <span className="font-semibold">{formatDate(new Date())}</span> {/* Placeholder for actual return date if available */}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Verification Actions */}
                                        <div className="flex gap-3 mt-4 md:mt-0">
                                            <button onClick={() => handleVerification(booking.id, false)} className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md text-sm uppercase border-2 border-red-500 hover:bg-white hover:text-red-500 transition-all">
                                                Reject
                                            </button>
                                            <button onClick={() => handleVerification(booking.id, true)} className="bg-green-500 text-white font-bold px-6 py-3 rounded-lg shadow-md text-sm uppercase border-2 border-green-500 hover:bg-white hover:text-green-500 transition-all">
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyReturns;