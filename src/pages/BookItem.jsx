import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookItem = () => {
  const { itemId } = useParams();
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ startDate: '', endDate: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch item');
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError('Could not load item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, isLoggedIn, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getTotalPrice = () => {
    if (!form.startDate || !form.endDate || !item) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (isNaN(start) || isNaN(end) || end < start) return 0;
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days * item.pricePerDay : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage(null);
    setBookingError(null);
    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      setBookingMessage('Booking successful!');
      setForm({ startDate: '', endDate: '' });
      
      // Redirect to dashboard after successful booking
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading item...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded shadow text-center">{error}</div>
      </div>
    );
  }
  if (!item) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl mx-auto card p-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="w-40 h-40 object-cover rounded-xl shadow" />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
            <p className="text-lg font-semibold text-purple-700 mb-2">₹{item.pricePerDay} <span className="text-sm font-normal text-gray-700">per day</span></p>
            {item.owner && (
              <p className="text-sm text-gray-500 mb-2">Owner: {item.owner.name || item.owner}</p>
            )}
          </div>
        </div>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Book this Item</h3>
          {bookingMessage && <div className="bg-green-50 text-green-700 px-4 py-2 rounded text-center">{bookingMessage}</div>}
          {bookingError && <div className="bg-red-50 text-red-700 px-4 py-2 rounded text-center">{bookingError}</div>}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-semibold text-gray-900">Total: </span>
            <span className="text-xl font-bold text-purple-700">₹{getTotalPrice()}</span>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 transition w-full mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookItem;
