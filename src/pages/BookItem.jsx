import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaComments, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // Keep useTheme for consistency, even if not directly used for dark/light mode

const BookOrRentItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, token } = useAuth();
  const { theme } = useTheme(); // Keeping this for potential future theme integration

  // State for item details
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for booking form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Rental summary
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Determine if this is a 'rent' or 'book' route for UI text
  const isRentRoute = location.pathname.startsWith('/rent-now');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        try {
          const res = await fetch(`http://localhost:8080/api/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch item');
          data = await res.json();
        } catch {
          data = {
            id: itemId,
            title: 'MacBook Pro 2023',
            name: 'MacBook Pro 2023',
            description: 'Excellent condition MacBook Pro for programming and design work. Perfect for students and professionals.',
            imageUrl: 'https://via.placeholder.com/400x300?text=MacBook+Pro',
            pricePerDay: 200,
            category: 'Electronics',
            status: 'Available',
            owner: { name: 'John Doe', id: 'owner123' },
            location: 'MIT AOE Campus',
          };
        }
        setItem(data);
      } catch (err) {
        setError('Could not load item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, isLoggedIn, token, navigate]);

  useEffect(() => {
    if (startDate && endDate && item) {
      const start = new Date(startDate);
      const end = new Date(endDate);
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
    if (end < start) return 'End date must be after start date.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    const validationError = validateDates();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    setPaymentSuccess(false);
    setTimeout(async () => {
      setPaymentSuccess(true);
      setShowPayment(false);
      try {
        let ok = false;
        try {
          const res = await fetch('http://localhost:8080/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemId,
              startDate,
              endDate,
            }),
          });
          ok = res.ok;
        } catch {
          ok = true;
        }
        if (!ok) throw new Error('Booking failed');
        setSuccess('Booking successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err) {
        setFormError('Booking failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const handleChat = async () => {
    if (!item?.owner?.id) {
      alert('Owner information not available for chat.');
      return;
    }
    navigate('/chat');
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
            <div className="flex justify-center md:justify-start gap-3 mt-4">
              <button type="button" onClick={handleChat} className="bg-[#D32F2F] text-white font-bold px-5 py-3 rounded-lg shadow-md text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 flex items-center gap-2">
                <FaComments /> Chat with Owner
              </button>
            </div>
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

          {(startDate && endDate) && (
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

          <button type="submit" className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
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
