import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaComments, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const BookOrRentItem = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoggedIn, token } = useAuth();
    const { theme } = useTheme();

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

    // Determine if this is a 'rent' or 'book' route for UI text
    const isRentRoute = location.pathname.startsWith('/rent-now');
    
    // --- RAZORPAY INTEGRATION: Add your Key ID here ---
    // IMPORTANT: Replace this with your actual Razorpay Key ID from your dashboard
   const razorpayKeyId = "rzp_test_n5Y0q2oWkbhx2b";


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        const fetchItem = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/items/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch item');
                const data = await res.json();
                setItem(data);
            } catch (err) {
                setError('Could not load item. Please try again later.');
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
            if (end < start) {
                setTotalDays(0);
                setTotalPrice(0);
                return;
            }
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including start day
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
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        setSuccess('');
        const validationError = validateDates();
        if (validationError) {
            setFormError(validationError);
            return;
        }
        // Show the payment confirmation modal instead of submitting directly
        setShowPayment(true);
    };

    // --- RAZORPAY INTEGRATION: This is the new, integrated payment handler ---
    const handlePayment = async () => {
        setIsSubmitting(true);
        try {
            // STEP 1: Create an Order on Your Backend
            const orderResponse = await fetch('http://localhost:8080/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ amount: totalPrice }),
            });

            if (!orderResponse.ok) {
                throw new Error(await orderResponse.text());
            }

            const orderData = await orderResponse.json();

            // STEP 2: Configure and Open the Razorpay Payment Popup
            const options = {
                key: razorpayKeyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "CampusRent",
                description: `Rental for ${item.title || item.name}`,
                image: "https://placehold.co/200x200/D32F2F/white?text=CR",
                order_id: orderData.orderId,
                handler: async function (response) {
                    // STEP 3: Verify the Payment on Your Backend
                    const verificationResponse = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    if (!verificationResponse.ok) {
                        throw new Error("Payment verification failed.");
                    }
                    
                    // STEP 4: PAYMENT SUCCESSFUL! Now create the booking.
                    console.log("Payment verified. Now creating booking...");
                    setShowPayment(false); // Close the payment modal

                    const bookingRes = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ itemId, startDate, endDate, totalPrice }),
                    });

                    if (!bookingRes.ok) {
                        throw new Error('Booking failed after successful payment. Please contact support.');
                    }
                    
                    setSuccess('Booking successful! Redirecting to dashboard...');
                    setTimeout(() => navigate('/dashboard'), 2000);
                },
                prefill: {
                    name: user?.name || "CampusRent User",
                    email: user?.email,
                    contact: user?.phone
                },
                theme: { color: "#D32F2F" },
            };

         const script = document.createElement("script");
script.src = "https://checkout.razorpay.com/v1/checkout.js";
script.async = true;
document.body.appendChild(script);

script.onload = () => {
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

script.onerror = () => {
  toast.error("Razorpay SDK failed to load. Are you online?");
};

            rzp.on('payment.failed', function (response) {
                console.error("Razorpay Payment Failed:", response);
                setFormError(`Payment Failed: ${response.error.description}`);
                setShowPayment(false); // Close modal on failure
            });
            rzp.open();

        } catch (error) {
            setFormError(error.message || "An unexpected error occurred.");
            setShowPayment(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChat = () => {
        if (!item?.owner?.id) {
            alert('Owner information not available for chat.');
            return;
        }
        navigate('/chat');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fff3f3]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F]"></div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-[#fff3f3]"><div className="bg-red-100 text-red-700 p-4 rounded">{error}</div></div>;
    if (!item) return null;

    const itemTitle = item.title || item.name;
    const ownerName = item.owner?.name || item.owner;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] py-12 px-4 font-sans">
            <div className="w-full max-w-2xl mx-auto bg-white text-gray-900 shadow-lg border-2 border-[#D32F2F] rounded-xl p-8 space-y-8">
                {/* Item Details Section */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {item.imageUrl && <img src={item.imageUrl} alt={itemTitle} className="w-48 h-48 object-cover rounded-xl shadow-md border-4 border-[#fff3f3]" />}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">{itemTitle}</h2>
                        <p className="text-gray-700 font-medium mb-2">{item.description}</p>
                        <p className="text-2xl font-bold text-[#D32F2F] mb-2">₹{item.pricePerDay} <span className="text-base font-medium text-gray-700">per day</span></p>
                        <div className="flex justify-center md:justify-start gap-3 mt-4">
                            <button type="button" onClick={handleChat} className="bg-[#D32F2F] text-white font-bold px-5 py-3 rounded-lg shadow-md text-base uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all duration-200 flex items-center gap-2">
                                <FaComments /> Chat with Owner
                            </button>
                        </div>
                    </div>
                </div>

                {/* Booking Form Section */}
                <form className="space-y-6 mt-6 p-6 bg-[#fff3f3] rounded-xl border-2 border-[#D32F2F] shadow-inner" onSubmit={handleSubmit}>
                    <h3 className="text-xl font-extrabold uppercase text-[#D32F2F] mb-4 text-center tracking-wide">{isRentRoute ? 'Rent this Item' : 'Book this Item'}</h3>
                    {success && <div className="bg-green-100 text-green-700 px-4 py-3 rounded text-center flex items-center justify-center gap-2 border border-green-300"><FaCheckCircle />{success}</div>}
                    {formError && <div className="bg-red-100 text-red-700 px-4 py-3 rounded text-center border border-red-300">{formError}</div>}

                    <div className="flex flex-col sm:flex-row gap-5">
                        <div className="flex-1">
                            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                            <input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]" required min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                            <input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F]" required min={startDate || new Date().toISOString().split('T')[0]} />
                        </div>
                    </div>

                    {totalPrice > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white border-2 border-[#D32F2F] rounded-xl shadow-md">
                            <h3 className="font-extrabold text-xl uppercase text-[#D32F2F] mb-4 tracking-wide">Rental Summary</h3>
                            <div className="flex justify-between items-center text-xl font-extrabold uppercase text-[#D32F2F] border-t-2 border-[#D32F2F] pt-4 mt-4">
                                <span>Total Price:</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </motion.div>
                    )}

                    <button type="submit" className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] transition-all w-full flex items-center justify-center gap-2" disabled={isSubmitting || totalPrice <= 0}>
                        <FaCreditCard /> {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
                    </button>
                </form>

                {/* Back Button */}
                <div className="text-center mt-6">
                    <button onClick={() => navigate('/items')} className="text-[#D32F2F] hover:text-[#B9162C] font-semibold text-lg underline">
                        ← Back to Items
                    </button>
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            <AnimatePresence>
                {showPayment && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 50, opacity: 0 }} className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border-2 border-[#D32F2F] text-center">
                            <FaCreditCard className="text-5xl text-[#D32F2F] mx-auto mb-6" />
                            <h2 className="text-2xl font-extrabold uppercase mb-3 text-[#222] tracking-wide">Confirm Payment</h2>
                            <p className="text-gray-700 text-lg mb-6">You will pay <span className="font-extrabold text-[#D32F2F]">₹{totalPrice}</span> for this rental.</p>
                            <button className="bg-[#D32F2F] text-white font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] w-full flex items-center justify-center gap-2 mb-3" onClick={handlePayment} disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Pay Now'}
                            </button>
                            <button className="bg-gray-200 text-gray-800 font-bold px-8 py-4 rounded-lg shadow-md text-lg uppercase border-2 border-gray-200 hover:bg-gray-300 w-full" onClick={() => setShowPayment(false)} disabled={isSubmitting}>
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
