import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import ReviewSection from "../components/ReviewSection";
import API from "../services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ItemCard from "../components/ItemCard"; // Added import for ItemCard

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [ownerDetails, setOwnerDetails] = useState(null); // <-- ADD THIS
  const [loadingOwner, setLoadingOwner] = useState(true); // <-- ADD THIS

  // Fetch item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await API.get(`/items/${itemId}`);

        const itemData = response.data;
        setItem(itemData);
      } catch (err) {
        console.error("Error fetching item:", err);
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch item details. Please try again.";
        setError(errorMessage);
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  useEffect(() => {
    if (item?.ownerId) {
      const fetchOwnerDetails = async () => {
        setLoadingOwner(true);
        try {
          const response = await API.get(`/users/profile/${item.ownerId}`);
          setOwnerDetails(response.data);
        } catch (error) {
          console.error("Failed to fetch owner details:", error);
          setOwnerDetails(null); // Set to null on error
        } finally {
          setLoadingOwner(false);
        }
      };
      fetchOwnerDetails();
    }
  }, [item?.ownerId]); // This runs when item.ownerId is available


  // Wishlist check logic (like ItemCard)
  useEffect(() => {
    const checkWishlistStatus = async () => {
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
      }
    };
    checkWishlistStatus();
  }, [isLoggedIn, item?.id, user?.email]);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to your wishlist!");
      navigate("/login");
      return;
    }
    if (!item?.id || !user?.email) {
      alert("Cannot update wishlist: Invalid item or user data.");
      return;
    }
    setWishlistLoading(true);
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
        setTimeout(() => setShowToast(false), 2000);
      } else {
        throw new Error(response.data?.message || "Failed to update wishlist");
      }
    } catch (error) {
      setToastMessage("Failed to update wishlist. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleRentNow = () => {
    if (!isLoggedIn) {
      alert("Please log in to rent items!");
      navigate("/login");
    } else {
      navigate(`/bookings/item/${itemId}`);
    }
  };

  // In your ItemDetails.jsx file

  const handleStartChat = async () => {
    if (!isLoggedIn) {
      alert("Please log in to start a chat!");
      navigate("/login");
      return;
    }

    // Use the ownerDetails state which is already being fetched
    if (!ownerDetails) {
      alert("Owner information is still loading or is unavailable for chat.");
      return;
    }

    // Check if the current user is trying to chat with themselves
    if (user?.id === ownerDetails.id) {
      alert("You cannot chat with yourself.");
      return;
    }

    try {
      // 1. Call your backend to get or create the chat room.
      // The backend will return a unique chatId for this conversation.
      const response = await API.post(`/chats/start/${ownerDetails.id}`);
      const { chatId } = response.data;

      // 2. Navigate to the chat page, PASSING THE STATE.
      // This sends the necessary info to the chat page.
      navigate('/chat', {
        state: {
          chatId: chatId,
          recipient: ownerDetails // Pass the full owner object
        }
      });

    } catch (error) {
      console.error("Failed to start chat:", error);
      const chatErrorMessage =
        error.response?.data?.message ||
        "Failed to start chat. Please try again.";
      alert(chatErrorMessage);
    }
  };

  // Function for adding to wishlist

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to your wishlist!");
      navigate("/login");
      return;
    }

    try {
      const response = await API.post(`/users/wishlist/add/${user.email}/${item.id}`);
      alert(`Item "${item.title}" added to wishlist!`);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to add item to wishlist.");
      }
    }
  };


  const getCategoryColor = (category) => {
    const colors = {
      Books:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      Electronics:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      Furniture:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      Stationery:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      Music: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      Sports:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      Other: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    };
    return colors[category] || colors.default;
  };

  const getStatusColor = (status) => {
    const colors = {
      Available:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      Rented: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      Maintenance:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    };
    return colors[status] || colors.default;
  };

  // Determine if the logged-in user is the owner of the item
  const isOwner =
    user &&
    item &&
    (user.email === item.ownerEmail || user.id === item.ownerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading item details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              Item Not Found
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => navigate("/items")}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    // This case should ideally be caught by the error block above, but as a fallback
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No item data available.
          </p>
          <button
            onClick={() => navigate("/items")}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 mt-4"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] text-gray-900 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left: Image/Slider */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
          >
            {item.images && item.images.length > 1 ? (
              <>
                {/* Simple slider: show selected image large, thumbnails below */}
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full max-w-md h-80 object-cover rounded-lg mb-4 shadow"
                />
                <div className="flex gap-2 mt-2">
                  {item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-all duration-200"
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {item.imageName ? (
                  <img
                    src={`http://localhost:8080/api/items/image/${item.imageName}`}
                    alt={item.title}
                    className="w-full max-w-md h-80 object-cover rounded-lg shadow"
                  />
                ) : (
                  <div className="w-full max-w-md h-80 flex items-center justify-center bg-gray-200 rounded-lg text-5xl text-gray-400">
                    <span role="img" aria-label="No Image">🖼️</span>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Right: Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
          >
            {/* Title and Wishlist/Share */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 truncate">{item.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs rounded-full px-3 py-1">{item.category}</span>
                  {item.isBestSeller && <span className="inline-block bg-[#B9162C] text-white text-xs font-bold rounded-full px-3 py-1 ml-2">Best Seller</span>}
                  {item.isNew && <span className="inline-block bg-green-100 text-green-700 text-xs font-bold rounded-full px-3 py-1 ml-2">New Arrival</span>}
                </div>
              </div>
              {/* Wishlist Heart */}
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition-all duration-200 disabled:opacity-60 mt-1"
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wishlistLoading ? (
                  <div className="w-4 h-4 border-2 border-[#B9162C] border-t-transparent rounded-full animate-spin"></div>
                ) : isInWishlist ? (
                  <FaHeart className="w-5 h-5 text-[#B9162C]" />
                ) : (
                  <FaRegHeart className="w-5 h-5 text-gray-400 hover:text-[#B9162C] transition-colors duration-200" />
                )}
              </button>
              {/* Share icons (optional) */}
              {/* <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 transition-all duration-200 ml-2">
                <svg ... />
              </button> */}
            </div>
            {/* Price and Rent Now + Chat */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
              <div className="text-2xl font-bold text-[#B9162C]">₹{item.pricePerDay} <span className="text-base font-normal text-gray-500">/ day</span></div>
              <button
                onClick={handleRentNow}
                className="bg-[#B9162C] text-white font-bold rounded-lg px-8 py-3 shadow hover:bg-[#a01325] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B9162C] focus:ring-offset-2 w-full sm:w-auto"
              >
                Rent Now
              </button>
              <button
                onClick={handleStartChat}
                className="bg-blue-600 text-white font-bold rounded-lg px-8 py-3 shadow hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
              >
                Chat
              </button>
            </div>
            {/* Short Description */}
            <div className="text-gray-700 text-base mb-2 line-clamp-2">{item.shortDescription || item.description?.slice(0, 120) + '...'}</div>
            {/* Badges */}
            <div className="flex gap-3 mb-2">
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-xs rounded-full px-3 py-1 font-semibold"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg> Quality Assured</span>
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-xs rounded-full px-3 py-1 font-semibold"><svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v16h16V4z" /><path d="M8 8h8v8H8z" /></svg> Easy Returns</span>
            </div>
          </motion.div>
        </motion.div>
        {/* Description & Owner Details Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-7xl mx-auto"
        >
          {/* Description/Specs Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">{item.description}</p>
            {(item.material || item.dimensions || item.color || item.weight || item.usageType) && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                <ul className="text-gray-700 text-base grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-2">
                  {item.material && <li><span className="font-semibold">Material:</span> {item.material}</li>}
                  {item.dimensions && <li><span className="font-semibold">Dimensions:</span> {item.dimensions}</li>}
                  {item.color && <li><span className="font-semibold">Color:</span> {item.color}</li>}
                  {item.weight && <li><span className="font-semibold">Weight:</span> {item.weight}</li>}
                  {item.usageType && <li><span className="font-semibold">Usage Type:</span> {item.usageType}</li>}
                </ul>
              </>
            )}
          </div>
          {/* --- MODIFIED: Owner Details/Reviews Card --- */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Owner Details</h3>

            {/* Check if item.owner exists before trying to display it */}
            {item.owner ? (
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={item.owner.profilePictureUrl || '/images/default-avatar.png'}
                  alt={item.owner.name}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-900">{item.owner.name}</p>
                  <p className="text-sm text-gray-500">{item.owner.email}</p>
                  {item.owner.memberSince && (
                    <p className="text-xs text-gray-400 mt-1">
                      Member since {new Date(item.owner.memberSince).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Owner information not available.</p>
            )}

            {/* Your Ratings & Reviews section can stay the same */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-gray-700 text-base font-semibold">{item.rating || 'N/A'}</span>
                {item.totalReviews > 0 && <span className="text-gray-500 text-sm">({item.totalReviews} reviews)</span>}
              </div>
              {item && <ReviewSection itemId={item.id} />}
            </div>
          </div>
        </motion.div>
      </div>
      {/* Toast Notification for wishlist */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={showToast ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 max-w-sm text-gray-900 dark:text-gray-100 ${showToast ? "" : "pointer-events-none"
          }`}
        style={{ display: showToast ? "block" : "none" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <p className="text-sm">{toastMessage}</p>
        </div>
      </motion.div>
      {/* You May Also Like Section */}
      {item && (
        <SimilarItemsSection category={item.category} excludeId={item.id} />
      )}
    </div>
  );
};

export default ItemDetails;

function SimilarItemsSection({ category, excludeId }) {
  const [similarItems, setSimilarItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let url = category && category !== 'Other'
      ? `/items/search?category=${encodeURIComponent(category)}`
      : '/items/search';
    API.get(url)
      .then(res => {
        let filtered = res.data.filter(i => i.id !== excludeId);
        // Pick 3-4 random or first few
        if (filtered.length > 4) {
          filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
        }
        setSimilarItems(filtered);
      })
      .catch(() => setSimilarItems([]))
      .finally(() => setLoading(false));
  }, [category, excludeId]);
  if (loading) return null;
  if (!similarItems.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="bg-white rounded-xl shadow-lg p-8 mt-12 max-w-7xl mx-auto"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </motion.div>
  );
}