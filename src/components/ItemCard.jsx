// src/components/ItemCard.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api"; // Ensure this is imported and configured

const ItemCard = ({ item }) => {
  const { isLoggedIn, token, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // checkWishlistStatus and handleWishlistToggle functions remain as they were in the previous correct version.
  // They are correctly using API.get/post and user.email.
  const checkWishlistStatus = useCallback(async () => {
    if (!isLoggedIn || !item?.id || !user?.email) {
      setIsInWishlist(false);
      return;
    }
    try {
      const response = await API.get(`/users/wishlist/${user.email}`);
      const wishlistItems = response.data;
      const itemFound = wishlistItems.some(
        (wishlistItem) => wishlistItem.id === item.id
      );
      setIsInWishlist(itemFound);
    } catch (error) {
      setIsInWishlist(false);
      console.error(
        "Error checking wishlist status:",
        error.response?.data || error.message
      );
    }
  }, [isLoggedIn, item?.id, user?.email]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please log in to add items to your wishlist!");
      navigate("/login");
      return;
    }
    if (!item?.id || !user?.email) {
      alert("Cannot update wishlist: Invalid item or user data.");
      return;
    }

    setIsWishlistLoading(true);
    try {
      let response;
      if (isInWishlist) {
        response = await API.post(
          `/users/wishlist/remove/${user.email}/${item.id}`
        );
      } else {
        response = await API.post(
          `/users/wishlist/add/${user.email}/${item.id}`
        );
      }

      if (response.status === 200 || response.status === 201) {
        const newState = !isInWishlist;
        setIsInWishlist(newState);
        setToastMessage(
          newState
            ? `${item.title} added to wishlist`
            : `${item.title} removed from wishlist`
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setTimeout(() => checkWishlistStatus(), 500);
      } else {
        if (response.status === 401) {
          setToastMessage("Session expired. Please log in again.");
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            navigate("/login");
          }, 3000);
          return;
        }
        throw new Error(response.data?.message || "Failed to update wishlist");
      }
    } catch (error) {
      setToastMessage("Failed to update wishlist. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      console.error(
        "Error updating wishlist:",
        error.response?.data || error.message
      );
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Handler for the "Rent Now" button at the bottom of the card and in the overlay
  const handleRentClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("Please log in to rent items!");
      navigate("/login");
    } else {
      navigate(`/item/${item.id}?action=rent`); // Navigates to consolidated page with action
    }
  };

  // Helper for category colors (unchanged)
  const getCategoryColor = (category) => {
    const colors = {
      Electronics:
        "bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-200",
      Stationery:
        "bg-mint-100 text-mint-700 dark:bg-mint-900 dark:text-mint-200",
      Music:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
      Sports:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
      Books:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
      Furniture:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
      Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    };
    return colors[category] || colors.default;
  };

  if (!item) return null;

  // --- CRITICAL CHANGE: Image URL Handling ---
  // This will be an empty string if imageName is not present, preventing external calls.
  const itemImageUrl = item.imageName
    ? `http://localhost:8080/api/items/image/${item.imageName}`
    : "";

  return (
    <>
      <motion.div
        className="card group overflow-hidden relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 min-h-[340px] w-[250px] flex flex-col"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{
          y: -10,
          scale: 1.025,
          boxShadow: "0 8px 32px 0 rgba(80, 0, 200, 0.10)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Wishlist Heart Icon */}
        <motion.button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading || !isLoggedIn}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {isWishlistLoading ? (
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          ) : isInWishlist ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors duration-200" />
          )}
        </motion.button>

        {/* --- Content Area (clickable for details) --- */}
        <Link to={`/item/${item.id}`} className="block">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-t-xl aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {itemImageUrl ? (
              <img
                src={itemImageUrl}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[120px] max-h-[150px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-4xl text-gray-300 dark:text-gray-600">
                <span role="img" aria-label="No Image">
                  🖼️
                </span>
              </div>
            )}
            {/* Category Badge */}
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium shadow-sm ${getCategoryColor(
                item.category
              )} bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 transition-colors duration-300 tracking-wide`}
            >
              {item.category}
            </div>
            {/* Price Badge */}
            <div className="absolute top-4 right-16 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-base font-medium text-purple-500 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300 tracking-wide">
              ₹{item.pricePerDay}/day
            </div>
            {/* Overlay "Rent Now" Button - for quick action on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <button
                onClick={handleRentClick}
                className="bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 font-semibold px-6 py-2 rounded text-base shadow-lg hover:bg-purple-600 dark:hover:bg-purple-700 hover:text-white transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                Rent Now
              </button>
            </div>
          </div>

          {/* Content below image */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 truncate leading-relaxed">
              {item.title}
            </h3>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 tracking-wide">
                {item.category}
              </span>
              <span className="text-sm font-medium text-purple-500 tracking-wide">
                ₹{item.pricePerDay}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              {item.owner && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                  Owner: {item.owner}
                </span>
              )}
              {item.location && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                  {item.location}
                </span>
              )}
            </div>
            {item.rating && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-base mr-1">★</span>
                <span className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                  {item.rating}
                </span>
                {item.totalReviews > 0 && (
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    ({item.totalReviews} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>

        {/* --- Separate Action Buttons at the bottom --- */}
        <div className="mt-auto flex gap-2 px-5 pb-4 pt-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!item.id && item.id !== 0) {
                console.warn("Invalid item id for View Details:", item);
                return;
              }
              navigate(`/item/${String(item.id)}`);
            }}
            className="flex-1 px-2 py-1.5 rounded bg-white text-purple-600 border border-purple-500 text-xs font-medium hover:bg-purple-600 hover:text-white focus-visible:ring-2 focus-visible:ring-purple-500 dark:bg-purple-600 dark:text-white dark:border-transparent dark:shadow-md dark:hover:bg-purple-700 dark:focus-visible:ring-2 dark:focus-visible:ring-purple-400 transition-all duration-200"
          >
            View Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={handleRentClick}
            className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white py-1.5 px-2 rounded text-xs font-medium transition-all duration-200 shadow-glow hover:shadow-glow-lg border border-purple-700 dark:border-purple-800"
          >
            Rent Now
          </motion.button>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 z-50 max-w-sm text-gray-900 dark:text-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">{toastMessage}</p>
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 ml-auto"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ItemCard;
