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
        className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full flex flex-col p-0"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.025 }}
      >
        {/* Best Seller Ribbon */}
        {item.isBestSeller && (
          <div className="absolute top-4 left-0 bg-[#B9162C] text-white text-xs font-bold px-3 py-1 rounded-r-xl shadow z-20">
            Best Seller
          </div>
        )}
        {/* Wishlist Heart Icon (unchanged) */}
        <motion.button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading || !isLoggedIn}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {isWishlistLoading ? (
            <div className="w-4 h-4 border-2 border-[#B9162C] border-t-transparent rounded-full animate-spin"></div>
          ) : isInWishlist ? (
            <FaHeart className="w-4 h-4 text-[#B9162C]" />
          ) : (
            <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-[#B9162C] transition-colors duration-200" />
          )}
        </motion.button>
        {/* Image */}
        <Link to={`/item/${item.id}`} className="block">
          <div className="relative overflow-hidden rounded-t-xl w-full h-44 bg-gray-100 flex items-center justify-center">
            {itemImageUrl ? (
              <motion.img
                src={itemImageUrl}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                whileHover={{ scale: 1.07 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-4xl text-gray-300">
                <span role="img" aria-label="No Image">🖼️</span>
              </div>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{item.title}</h3>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs rounded-full px-3 py-1 mb-2">{item.category}</span>
            <div className="font-bold text-[#B9162C] text-base mb-2">₹{item.pricePerDay} <span className="font-normal text-xs">per day</span></div>
            <div className="flex items-center justify-between mb-2">
              {item.location && <span className="text-xs text-gray-500 font-medium line-clamp-1">{item.location}</span>}
              {item.owner && <span className="text-xs text-gray-400 font-medium line-clamp-1">Owner: {item.owner}</span>}
            </div>
            {item.rating && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-base mr-1">★</span>
                <span className="text-gray-600 text-xs font-medium">{item.rating}</span>
                {item.totalReviews > 0 && (
                  <span className="text-gray-500 text-xs ml-1">({item.totalReviews} reviews)</span>
                )}
              </div>
            )}
          </div>
        </Link>
        {/* Action Buttons */}
        <div className="mt-auto flex gap-2 px-5 pb-4 pt-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/item/${String(item.id)}`)}
            className="flex-1 px-2 py-2 rounded-lg bg-white border border-[#B9162C] text-[#B9162C] font-bold text-xs md:text-sm hover:bg-[#B9162C] hover:text-white transition-all duration-300"
          >
            Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={handleRentClick}
            className="flex-1 px-2 py-2 rounded-lg bg-[#B9162C] text-white font-bold text-xs md:text-sm hover:bg-[#a01325] transition-all duration-300"
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
