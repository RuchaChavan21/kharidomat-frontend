import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
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
  const [finalAmount, setFinalAmount] = useState(0);
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
        const res = await API.get(`/items/${itemId}`); // Assuming your endpoint is /api/items/
        setItem(res.data);
      } catch (err) {
        console.warn("API fetch failed. Using fallback data for development.");
        setItem({
          id: itemId,
          title: 'MacBook Pro 2023 (Fallback)',
          description: 'Excellent condition MacBook Pro.',
          imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
          pricePerDay: 200,
          baseDeposit: 1500,
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

  // Fetch booked dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await API.get(`/bookings/item/${itemId}/dates`); // Assuming a correct endpoint
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

  // Calculate RENT price based on dates
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

  // Calculate FINAL amount whenever rent or deposit changes
  useEffect(() => {
    const deposit = item?.baseDeposit || 0;
    setFinalAmount(totalPrice + deposit);
  }, [totalPrice, item]);

  // Validate dates
  const validateDates = () => {
    if (!startDate || !endDate) return 'Please select both start and end dates.';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) return 'Start date cannot be in the past.';
    if (end < start) return 'End date must be on or after the start date.';

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
      // ================== THIS IS THE CRITICAL CHANGE ==================
      // 1. Create an order on your server by sending booking DETAILS, not the amount.
      // This is secure because the server calculates the price.
      const orderRes = await API.post("/payment/create-order", {
        itemId: itemId,
        startDate: startDate,
        endDate: endDate,
      });
      // =================================================================

      const orderData = orderRes.data;
      const { orderId, amount, currency } = orderData;

      // 2. Configure Razorpay checkout options.
      const options = {
        key: "rzp_test_n5Y0q2oWkbhx2b", // Store this in an environment variable
        amount: amount,
        currency: currency,
        name: "KharidoMat",
        description: `Rental for ${item.title}`,
        order_id: orderId,
        handler: async (response) => {
          // 3. Verify the payment and create the final booking
          try {
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await API.post('/bookings', {
              itemId,
              startDate,
              endDate,
              totalPrice, // The base rent price
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id
            });

            setSuccess('Booking successful! Redirecting...');
            setShowPayment(false);
            setTimeout(() => navigate('/dashboard'), 2000);

          } catch (verificationError) {
            console.error("Payment verification or booking failed:", verificationError);
            setFormError("Payment failed or item was booked by someone else. A refund will be initiated if payment was deducted.");
            setShowPayment(false);
          }
        },
        prefill: {
          name: user?.fullName || "KharidoMat User",
          email: user?.email,
          contact: user?.phoneNumber,
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
      setFormError(error.response?.data?.message || "Could not initiate payment. Please try again.");
      setShowPayment(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!item) return null;

  const itemTitle = item.title || item.name;
  const ownerName = item.owner?.fullName || "N/A";
  const isOwner = user?.email === item?.owner?.email;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="max-w-4xl mx-auto rounded-2xl shadow-xl bg-white border border-gray-200 p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={itemTitle} className="w-full h-80 object-cover rounded-2xl shadow-md border border-gray-200" />
          )}
          <div className="flex flex-col justify-center space-y-3 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-gray-800 leading-tight">{itemTitle}</h2>
            <p className="text-lg text-gray-700">{item.description}</p>
            <p className="text-2xl font-semibold text-indigo-600">₹{item.pricePerDay} <span className="text-base font-normal text-gray-500">/ day</span></p>
            {item.baseDeposit > 0 && (
                <p className="text-md font-semibold text-blue-600 flex items-center justify-center md:justify-start gap-2">
                    <FaShieldAlt /> Refundable Deposit: ₹{item.baseDeposit}
                </p>
            )}
             <p className="text-sm text-gray-500">Owner: <span className="font-medium text-gray-700">{ownerName}</span></p>
          </div>
        </div>

        {isOwner ? (
          <div className="text-center p-6 bg-yellow-50 text-yellow-800 rounded-xl border-2 border-yellow-200">
            <h3 className="text-xl font-semibold">This is your item</h3>
            <p className="mt-1">You cannot book or rent an item that you own.</p>
          </div>
        ) : (
          <form className="space-y-6 mt-2 p-6 bg-gray-50 rounded-xl shadow-inner border" onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold text-gray-800 text-center">{isRentRoute ? 'Rent this Item' : 'Book this Item'}</h3>
            {success && <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center">{success}</div>}
            {formError && <div className="bg-red-100 text-red-800 p-3 rounded-xl text-center">{formError}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" minDate={new Date()} excludeDates={bookedDates.map(d => new Date(d))} dateFormat="yyyy-MM-dd" required />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" minDate={startDate || new Date()} excludeDates={bookedDates.map(d => new Date(d))} dateFormat="yyyy-MM-dd" required />
              </div>
            </div>

            {(startDate && endDate && totalPrice > 0) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white border rounded-xl shadow-md">
                <h3 className="font-semibold text-xl text-gray-800 mb-4">Payment Summary</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between"><span>Rental Price ({totalDays} days)</span><span className="font-semibold">₹{totalPrice}</span></div>
                  <div className="flex justify-between"><span>Refundable Security Deposit</span><span className="font-semibold">₹{item.baseDeposit}</span></div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl">
                      <span className="font-semibold text-gray-800">Total Payable Amount</span>
                      <span className="font-extrabold text-indigo-600">₹{finalAmount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow disabled:opacity-50" disabled={isSubmitting || totalPrice <= 0}>
              <FaCreditCard className="inline mr-2" />
              {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
            </button>
          </form>
        )}
         <div className="text-center mt-4">
            <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">
                ← Go Back
            </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPayment && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
              <FaCreditCard className="text-5xl text-indigo-500 mx-auto mb-5" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">Confirm Payment</h2>
              <p className="text-base text-gray-600 mb-2">You will pay a total of <span className="font-bold text-indigo-600">₹{finalAmount}</span>.</p>
              <p className="text-sm text-gray-500 mb-6">(₹{totalPrice} rent + ₹{item.baseDeposit} refundable deposit)</p>
              <button className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow mb-3" onClick={handlePayment} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : `Pay ₹${finalAmount}`}
              </button>
              <button className="w-full bg-gray-200 text-gray-700 font-medium py-3 rounded-xl" onClick={() => setShowPayment(false)} disabled={isSubmitting}>
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