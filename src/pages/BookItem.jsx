import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
// FaComments icon import removed as the chat button is no longer present
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import API from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const BookOrRentItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  // State
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const isRentRoute = location.pathname.startsWith('/rent-now');
  const [bookedDates, setBookedDates] = useState([]);



  // Effect to load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  // Fetch item details
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/items/${itemId}`);
        setItem(res.data);
      } catch (err) {
        console.warn("API fetch failed. Using fallback data for development.");
        setItem({
          id: itemId,
          title: 'MacBook Pro 2023 (Fallback)',
          description: 'Excellent condition MacBook Pro for programming and design work.',
          imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
          pricePerDay: 200,
          category: 'Electronics',
          status: 'Available',
          owner: { name: 'John Doe', id: 'owner123' },
          location: 'MIT AOE Campus',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, isLoggedIn, navigate]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await API.get(`/bookings/${itemId}/bookings`);
        const blocked = [];

        res.data.forEach(({ startDate, endDate }) => {
          const current = new Date(startDate);
          const end = new Date(endDate);
          while (current <= end) {
            blocked.push(new Date(current).toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
          }
        });

        setBookedDates(blocked);
      } catch (err) {
        console.error("Failed to fetch booked dates:", err);
      }
    };

    if (itemId) fetchBookedDates();
  }, [itemId]);


  // Calculate price based on dates
  useEffect(() => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setTotalDays(0);
        setTotalPrice(0);
        return;
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);
      setTotalPrice(diffDays * (item.pricePerDay || 0));
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, item]);

  const validateDates = () => {
    if (!startDate || !endDate) return 'Please select both start and end dates.';
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (start < today) return 'Start date cannot be in the past.';
    if (end < start) return 'End date must be on or after the start date.';
  
    // Check for overlapping with bookedDates
    const check = new Date(start);
    while (check <= end) {
      const checkStr = check.toISOString().split('T')[0];
      if (bookedDates.includes(checkStr)) {
        return `Date ${checkStr} is already booked. Please select different dates.`;
      }
      check.setDate(check.getDate() + 1);
    }
  
    return null;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateDates();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    setFormError('');
    try {
      // 1. Create an order on your server.
      const orderRes = await API.post("/payment/create-order", {
        amount: totalPrice, // Convert Rupees to Paise
      });

      const orderData = orderRes.data;
      const { orderId, amount, currency } = orderData;

      // 2. Configure Razorpay checkout options.
      const options = {
        key: "rzp_test_n5Y0q2oWkbhx2b", // It's better to store this in an .env file
        amount: amount,
        currency: currency,
        name: "KharidoMat",
        description: `Rental for ${item.title}`,
        order_id: orderId,
        handler: async (response) => {
          // 3. Verify the payment and create the booking
          try {
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await API.post('/bookings', {
              itemId, startDate, endDate, totalPrice
            });

            setSuccess('Booking successful! Redirecting...');
            setShowPayment(false);
            setTimeout(() => navigate('/dashboard'), 2000);

          } catch (verificationError) {
            console.error("Payment verification or booking failed:", verificationError);
            setFormError("Payment succeeded, but booking failed. Please contact support.");
            setShowPayment(false);
          }
        },
        prefill: {
          name: user?.name || "KharidoMat User",
          email: user?.email,
          contact: user?.phone,
        },
        notes: {
          address: "KharidoMat Transaction",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error(response);
        setFormError(`Payment Failed: ${response.error.description}`);
        setShowPayment(false);
      });
      rzp.open();

    } catch (error) {
      console.error("An error occurred during payment:", error);
      setFormError("Could not initiate payment. Please try again.");
      setShowPayment(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] text-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading item...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] text-gray-900">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow text-center border border-red-300">{error}</div>
      </div>
    );
  }

  if (!item) return null;

  const itemTitle = item.title || item.name;
  const ownerName = item.owner?.name || item.owner;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] py-12 px-4 font-sans">
      <div className="w-full max-w-2xl mx-auto bg-white text-gray-900 shadow-lg border-2 border-[#D32F2F] rounded-xl p-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={itemTitle} className="w-48 h-48 object-cover rounded-xl shadow-md border-4 border-[#fff3f3]" />
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">{itemTitle}</h2>
            <p className="text-gray-700 font-medium mb-2">{item.description}</p>
            <p className="text-sm text-gray-600 mb-2">Category: <span className="font-semibold">{item.category}</span></p>
            <p className="text-2xl font-bold text-[#D32F2F] mb-2">₹{item.pricePerDay} <span className="text-base font-medium text-gray-700">per day</span></p>
            {ownerName && <p className="text-sm text-gray-600 mb-2">Owner: <span className="font-semibold">{ownerName}</span></p>}
            {item.location && <p className="text-sm text-gray-600 mb-2">Location: <span className="font-semibold">{item.location}</span></p>}
            {item.status && <p className="text-sm text-gray-600 mb-2">Status: <span className="font-semibold">{item.status}</span></p>}
            {/* The chat button that caused the error has been completely removed. */}
          </div>
        </div>

        <form className="space-y-6 mt-6 p-6 bg-[#fff3f3] rounded-xl border-2 border-[#D32F2F] shadow-inner" onSubmit={handleSubmit}>
          <h3 className="text-xl font-extrabold uppercase text-[#D32F2F] mb-4 text-center tracking-wide">{isRentRoute ? 'Rent this Item' : 'Book this Item'}</h3>
          {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded text-center flex items-center justify-center gap-2 border border-green-300"><FaCheckCircle className="text-green-500 text-xl" />{success}</div>}
          {formError && <div className="bg-red-100 text-red-700 px-4 py-3 rounded text-center border border-red-300">{formError}</div>}

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
              <input id="startDate" type="date" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] transition-colors duration-200" required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
              <input id="endDate" type="date" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] transition-colors duration-200" required min={startDate || new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          {(startDate && endDate && totalPrice > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white border-2 border-[#D32F2F] rounded-xl shadow-md">
              <h3 className="font-extrabold text-xl uppercase text-[#D32F2F] mb-4 tracking-wide">Rental Summary</h3>
              <div className="space-y-3 text-gray-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Rental Days:</span>
                  <span className="font-bold text-[#222]">{totalDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price per day:</span>
                  <span className="font-bold text-[#222]">₹{item.pricePerDay}</span>
                </div>
                <div className="border-t-2 border-[#D32F2F] pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-extrabold uppercase text-[#D32F2F]">Total Price:</span>
                    <span className="text-3xl font-extrabold text-[#D32F2F]">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <button type="submit" className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 w-full flex items-center justify-center gap-2" disabled={isSubmitting || totalPrice <= 0}>
            <FaCreditCard /> {isSubmitting ? (isRentRoute ? 'Renting...' : 'Booking...') : (isRentRoute ? 'Rent Now & Pay' : 'Book Now & Pay')}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => navigate('/items')} className="text-[#D32F2F] hover:text-[#B9162C] font-semibold text-lg underline">
            ← Back to Items
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPayment && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border-2 border-[#D32F2F] text-center">
              <FaCreditCard className="text-5xl text-[#D32F2F] mx-auto mb-6" />
              <h2 className="text-2xl font-extrabold uppercase mb-3 text-[#222] tracking-wide">Confirm Payment</h2>
              <p className="text-gray-700 text-lg mb-6">You will pay <span className="font-extrabold text-[#D32F2F]">₹{totalPrice}</span> for this {isRentRoute ? 'rental' : 'booking'}.</p>
              <button className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 w-full flex items-center justify-center gap-2 mb-3" onClick={handlePayment} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Pay Now'}
              </button>
              <button className="bg-gray-200 text-gray-800 font-bold px-8 py-4 rounded-lg shadow-md text-lg uppercase border-2 border-gray-200 hover:bg-gray-300 transition-all duration-200 w-full" onClick={() => setShowPayment(false)} disabled={isSubmitting}>
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookOrRentItem;