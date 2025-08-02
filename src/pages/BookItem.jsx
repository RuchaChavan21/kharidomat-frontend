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

            // --- MODIFY THIS PART TO SEND THE IDs ---
            // This part creates the booking in your database
            await API.post('/bookings', {
              itemId,
              startDate,
              endDate,
              totalPrice,
              razorpayPaymentId: response.razorpay_payment_id, // <-- ADD THIS
              razorpayOrderId: response.razorpay_order_id    // <-- ADD THIS
            });

            setSuccess('Booking successful! Redirecting...');
            setShowPayment(false);
            setTimeout(() => navigate('/dashboard'), 2000);

          } catch (verificationError) {
            console.error("Payment verification or booking failed:", verificationError);
            setFormError("Payment was made but the item was just booked by someone else. A refund will be initiated.");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading item...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white text-red-700 px-8 py-6 rounded-2xl shadow-md text-center border border-red-300 max-w-md mx-auto">
          {error}
        </div>
      </div>
    );
  }

  if (!item) return null;

  const itemTitle = item.title || item.name;
  const ownerName = item.owner?.name || item.owner;

  const isOwner = user?.email === item?.owner?.email;
  console.log("--- Owner Check ---");
  console.log("Logged-in User ID:", user?.id, "(Type: " + typeof user?.id + ")");
  console.log("Item Owner ID:", item?.owner?.id, "(Type: " + typeof item?.owner?.id + ")");
  console.log("Are they the same?", isOwner);
  console.log("-------------------");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="max-w-4xl mx-auto rounded-2xl shadow-xl bg-white border border-gray-200 p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={itemTitle} className="w-full h-64 object-cover rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105" />
          )}
          <div className="flex flex-col justify-center space-y-2 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-gray-800 mb-1 leading-tight">{itemTitle}</h2>
            <p className="text-lg text-gray-700 mb-1 font-medium">{item.description}</p>
            <p className="text-sm text-gray-500">Category: <span className="font-medium text-gray-700">{item.category}</span></p>
            <p className="text-2xl font-semibold text-indigo-600 mb-1">₹{item.pricePerDay} <span className="text-base font-normal text-gray-500">per day</span></p>
            {ownerName && <p className="text-sm text-gray-500">Owner: <span className="font-medium text-gray-700">{ownerName}</span></p>}
            {item.location && <p className="text-sm text-gray-500">Location: <span className="font-medium text-gray-700">{item.location}</span></p>}
            {item.status && <p className="text-sm text-gray-500">Status: <span className="font-medium text-gray-700">{item.status}</span></p>}
          </div>
        </div>

        {isOwner ? (
          <div className="text-center p-6 bg-yellow-50 text-yellow-800 rounded-xl border-2 border-yellow-200 shadow-inner">
            <h3 className="text-xl font-semibold">This is your item</h3>
            <p className="mt-1">You cannot book or rent an item that you own.</p>
          </div>
        ) : (
          <form className="space-y-8 mt-2 p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-200" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{isRentRoute ? 'Rent this Item' : 'Book this Item'}</h3>
            {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2 border border-green-300 text-base"><FaCheckCircle className="text-green-500 text-xl" />{success}</div>}
            {formError && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-center border border-red-300 text-base">{formError}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="startDate" className="block text-base font-medium text-gray-700 mb-2">Start Date</label>
                <input id="startDate" type="date" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-base bg-white" required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate" className="block text-base font-medium text-gray-700 mb-2">End Date</label>
                <input id="endDate" type="date" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-base bg-white" required min={startDate || new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {(startDate && endDate && totalPrice > 0) && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="p-6 bg-white border border-gray-200 rounded-xl shadow-md mt-2">
                <h3 className="font-semibold text-xl text-gray-800 mb-4">Rental Summary</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Rental Days:</span>
                    <span className="font-semibold text-gray-800">{totalDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price per day:</span>
                    <span className="font-semibold text-gray-800">₹{item.pricePerDay}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-gray-800">Total Price:</span>
                      <span className="text-3xl font-extrabold text-indigo-600">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <button type="submit" className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-300 w-full flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting || totalPrice <= 0}>
              <FaCreditCard /> {isSubmitting ? (isRentRoute ? 'Renting...' : 'Booking...') : (isRentRoute ? 'Rent Now & Pay' : 'Book Now & Pay')}
            </button>
          </form>)}

        <div className="text-center mt-2">
          <button onClick={() => navigate('/items')} className="text-indigo-600 hover:text-indigo-800 font-medium text-base underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            ← Back to Items
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPayment && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border border-gray-200 text-center">
              <FaCreditCard className="text-5xl text-indigo-600 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Confirm Payment</h2>
              <p className="text-base text-gray-700 mb-6">You will pay <span className="font-extrabold text-indigo-600">₹{totalPrice}</span> for this {isRentRoute ? 'rental' : 'booking'}.</p>
              <button className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-300 w-full flex items-center justify-center gap-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed" onClick={handlePayment} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Pay Now'}
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-xl shadow transition-all duration-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-300" onClick={() => setShowPayment(false)} disabled={isSubmitting}>
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