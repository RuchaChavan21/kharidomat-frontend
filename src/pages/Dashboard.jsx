import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api"; // +++ ADDED: API service for making requests

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  // --- MODIFIED: States now start empty and will be filled by API data ---
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ""
  );

  // +++ ADDED: Function to fetch all dashboard data from the backend +++
  const fetchDashboardData = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");

      // Fetch all data concurrently for better performance
      const [summaryRes, bookingsRes, itemsRes] = await Promise.all([
        API.get("/users/dashboard"),
        API.get("/bookings/my?limit=3&sortBy=createdAt:desc"),
        API.get("/items/my?limit=3&sortBy=createdAt:desc"),
      ]);

      setStats(summaryRes.data);
      setRecentBookings(bookingsRes.data);
      setRecentItems(itemsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load your dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  // --- MODIFIED: This useEffect now triggers the data fetch ---
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // This useEffect for handling the success message remains
  useEffect(() => {
    if (successMessage) {
      const msgTimer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(msgTimer);
    }
  }, [successMessage]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    // This helper function remains the same
    const statusConfig = {
      ACTIVE: {
        color:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
        text: "Active",
      },
      COMPLETED: {
        color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
        text: "Completed",
      },
      UPCOMING: {
        color:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
        text: "Upcoming",
      },
      CANCELED: {
        color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
        text: "Canceled",
      },
      AVAILABLE: {
        color:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
        text: "Available",
      },
      RENTED: {
        color:
          "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300",
        text: "Rented",
      },
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
      text: status,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  if (loading) {
    // Loading UI remains the same
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    // +++ ADDED: Error display UI +++
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Login prompt UI remains the same
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        {/* ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-6 text-center font-semibold shadow transition-colors duration-300">
            {successMessage}
          </div>
        )}
        {/* --- MODIFIED: Stats Cards now use live data from the 'stats' object --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            {
              title: "My Bookings",
              value: stats?.totalBookings || 0,
              icon: "📋",
              color: "bg-purple-500",
              description: "Total bookings made",
            },
            {
              title: "Items Posted",
              value: stats?.itemsPosted || 0,
              icon: "📦",
              color: "bg-blue-500",
              description: "Items you've listed",
            },
            {
              title: "Active Listings",
              value: stats?.activeListings || 0,
              icon: "✅",
              color: "bg-green-500",
              description: "Currently available",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-xl`}>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons (No changes needed) */}
        <motion.div /* ... */>{/* ... */}</motion.div>

        {/* --- MODIFIED: Recent Activity Section now uses live data --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Bookings */}
          <motion.div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Bookings
              </h2>
              <Link
                to="/my-bookings"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {booking.item?.name || "Item Name"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </p>
                    </div>
                    <div className="ml-4">{getStatusBadge(booking.status)}</div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">No recent bookings found.</p>
              )}
            </div>
          </motion.div>

          {/* Recent Items Posted */}
          <motion.div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Listings
              </h2>
              <Link
                to="/my-listings" // Ensure you have a route for this page
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.category?.name || "Category"}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{item.pricePerDay}/day
                      </p>
                      {getStatusBadge(item.status)}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">
                  You haven't listed any items yet.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Stats Footer */}
        <motion.div className="mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {stats?.totalBookings || 0}
              </p>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.itemsPosted || 0}
              </p>
              <p className="text-sm text-gray-600">Items Posted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats?.activeListings || 0}
              </p>
              <p className="text-sm text-gray-600">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{stats?.totalEarnings || 0}
              </p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
