import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import API from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// No external CSS file is needed. All styles are handled inside this component.

const BookOrRentItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  // --- All state and logic remain the same ---
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

  // NEW: useEffect to inject custom styles for the date picker
  useEffect(() => {
    const customDatePickerStyles = `
      .react-datepicker-popper {
        z-index: 100 !important;
      }
      .react-datepicker {
        font-family: inherit !important;
        border: 2px solid #d32f2f !important;
        border-radius: 1rem !important;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        padding: 8px;
      }
      .react-datepicker__header {
        background-color: #d32f2f !important;
        border-bottom: none !important;
        border-top-left-radius: 0.875rem !important;
        border-top-right-radius: 0.875rem !important;
      }
      .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
        color: white !important;
        font-weight: bold !important;
        padding-bottom: 8px;
      }
      .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
        color: #222 !important;
        font-weight: 500 !important;
        margin: 0.25rem !important;
        width: 2rem;
        line-height: 2rem;
      }
      .react-datepicker__navigation-icon::before {
        border-color: white !important;
        border-width: 3px 3px 0 0 !important;
        top: 10px !important;
      }
      .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {
        background-color: #d32f2f !important;
        color: white !important;
        border-radius: 0.375rem !important;
      }
      .react-datepicker__day:hover {
        background-color: #fff3f3 !important;
        border-radius: 0.375rem !important;
      }
      .react-datepicker__day--keyboard-selected {
        background-color: #b71c1c !important;
      }
      .react-datepicker__day--disabled {
        color: #ccc !important;
        text-decoration: line-through !important;
        cursor: not-allowed;
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customDatePickerStyles;
    document.head.appendChild(styleElement);

    // Cleanup function to remove styles when the component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []); // Empty array ensures this effect runs only once

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
          name: 'MacBook Pro 2023 (Fallback)',
          description: 'Excellent condition MacBook Pro.',
          imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
          pricePerDay: 200,
          baseDeposit: 1500,
          category: 'Electronics',
          status: 'Available',
          owner: { fullName: 'John Doe', email: 'owner@example.com' },
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
        const res = await API.get(`/bookings/item/${itemId}/dates`);
        const blocked = [];
        res.data.forEach(({ startDate, endDate }) => {
          const current = new Date(startDate);
          const end = new Date(endDate);
          while (current <= end) {
            blocked.push(new Date(current));
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
        return 'Date ${checkStr} is already booked. Please select different dates.';
      }
      check.setDate(check.getDate() + 1);
    }
    return null;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateDates();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError('');
    setShowPayment(true);
  };

  const handlePayment = async () => {
  setIsSubmitting(true);
  setFormError('');
  try {
    const orderRes = await API.post("/payment/create-order", {
      itemId: itemId,
      startDate: startDate,
      endDate: endDate,
    });
    const orderData = orderRes.data;
    const { orderId, amount, currency } = orderData;
    const options = {
      key: "rzp_test_n5Y0q2oWkbhx2b",
      amount: amount,
      currency: currency,
      name: "KharidoMat",
      description: `Rental for ${item.title}`,
      order_id: orderId,
      handler: async (response) => {
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
            totalPrice,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id
          });

          setSuccess('Booking successful! Redirecting...');
          setShowPayment(false);
          setTimeout(() => navigate('/dashboard'), 2000);

        } catch (verificationError) {
          console.error("Payment verification or booking failed:", verificationError);
          // ✅ Show backend message directly
          const backendMsg =
            verificationError.response?.data?.message || // in case backend sends { message: "..." }
            verificationError.response?.data || // if backend sends plain text
            verificationError.message;

          setFormError(
            backendMsg ||
            "Payment failed or item was booked by someone else. A refund will be initiated if payment was deducted."
          );
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
        color: "#D32F2F",
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
    const backendMsg =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;

    setFormError(backendMsg || "Could not initiate payment. Please try again.");
    setShowPayment(false);
  } finally {
    setIsSubmitting(false);
  }
};

  
  if (loading) return <div className="text-center font-semibold text-lg p-20">Loading Your Item...</div>;
  if (error) return <div className="text-center p-20 text-[#D32F2F] font-semibold">{error}</div>;
  if (!item) return null;

  const itemTitle = item.title || item.name;
  const ownerName = item.owner?.fullName || "N/A";
  const isOwner = user?.email === item?.owner?.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3f3] via-white to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: 'easeOut' }} 
            className="max-w-5xl mx-auto rounded-2xl shadow-2xl bg-white border-2 border-red-100 p-6 sm:p-8 lg:p-12 relative"
        >
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Go Back"
            >
                <FaArrowLeft className="text-gray-700" />
            </button>

<div className="w-full">
    <div className="flex flex-col space-y-4 text-left">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 uppercase tracking-wide">{itemTitle}</h1>
        <p className="text-lg text-gray-600 leading-relaxed">{item.description}</p>
        <p className="text-4xl font-bold text-[#D32F2F]">₹{item.pricePerDay} <span className="text-lg font-medium text-gray-500">/ day</span></p>
        {item.baseDeposit > 0 && (
            <p className="text-md font-semibold text-gray-700 flex items-center justify-start gap-2">
                <FaShieldAlt className="text-[#D32F2F]" /> Refundable Deposit: ₹{item.baseDeposit}
            </p>
        )}
    </div>
</div>

            <div className="mt-12">
            {isOwner ? (
                <div className="text-center p-6 bg-yellow-50 text-yellow-800 rounded-xl border-2 border-yellow-200">
                    <h3 className="text-xl font-semibold">THIS IS YOUR LISTING</h3>
                    <p className="mt-1">You cannot book or rent an item that you own.</p>
                </div>
            ) : (
                <form className="space-y-6 mt-2 p-6 sm:p-8 bg-[#fff3f3] rounded-2xl border-2 border-red-100 shadow-inner" onSubmit={handleSubmit}>
                    <h3 className="text-2xl font-extrabold text-[#D32F2F] text-center uppercase tracking-wider">{isRentRoute ? 'Rent this Item' : 'Book this Item'}</h3>
                    {success && <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-semibold">{success}</div>}
                    {formError && <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-semibold">{formError}</div>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-bold text-gray-700 mb-2 uppercase">Start Date</label>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-[#D32F2F] transition" minDate={new Date()} excludeDates={bookedDates} dateFormat="yyyy-MM-dd" placeholderText="Select start date" required />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-bold text-gray-700 mb-2 uppercase">End Date</label>
                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D32F2F] focus:border-[#D32F2F] transition" minDate={startDate || new Date()} excludeDates={bookedDates} dateFormat="yyyy-MM-dd" placeholderText="Select end date" required />
                        </div>
                    </div>

                    {(startDate && endDate && totalPrice > 0) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-white border-2 border-red-100 rounded-xl shadow-md">
                            <h4 className="font-extrabold text-xl text-gray-800 mb-4 uppercase tracking-wide">Payment Summary</h4>
                            <div className="space-y-3 text-gray-700 font-medium">
                                <div className="flex justify-between"><span>Rental Price ({totalDays} {totalDays > 1 ? 'days' : 'day'})</span><span className="font-bold">₹{totalPrice}</span></div>
                                <div className="flex justify-between"><span>Refundable Security Deposit</span><span className="font-bold">₹{item.baseDeposit}</span></div>
                                <div className="border-t-2 border-dashed border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between items-center text-xl">
                                        <span className="font-bold text-gray-900 uppercase">Total Payable</span>
                                        <span className="font-extrabold text-2xl text-[#D32F2F]">₹{finalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <button type="submit" className="w-full bg-[#D32F2F] text-white font-bold text-lg py-4 rounded-xl shadow-lg uppercase tracking-wider border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting || totalPrice <= 0}>
                        <FaCreditCard className="inline mr-2" />
                        {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
                    </button>
                </form>
            )}
            </div>
      </motion.div>

      <AnimatePresence>
        {showPayment && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-4 border-[#D32F2F]">
                <FaCreditCard className="text-6xl text-[#D32F2F] mx-auto mb-5" />
                <h2 className="text-2xl font-extrabold mb-2 text-gray-900 uppercase tracking-wide">Confirm Payment</h2>
                <p className="text-base text-gray-600 mb-4">You are about to pay a total of <span className="font-bold text-2xl text-[#D32F2F]">₹{finalAmount}</span>.</p>
                <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600 mb-6">
                    (₹{totalPrice} rent + ₹{item.baseDeposit} refundable deposit)
                </div>
                <div className='space-y-3'>
                    <button className="w-full bg-[#D32F2F] text-white font-bold text-lg py-3 rounded-xl shadow-lg uppercase border-2 border-[#D32F2F] hover:bg-[#b71c1c] transition-all duration-200" onClick={handlePayment} disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : `Pay ₹${finalAmount} Securely`}
                    </button>
                    <button className="w-full bg-white text-[#D32F2F] font-bold py-3 rounded-xl uppercase border-2 border-[#D32F2F] hover:bg-gray-100 transition-all duration-200" onClick={() => setShowPayment(false)} disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookOrRentItem;