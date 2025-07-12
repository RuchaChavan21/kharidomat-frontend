import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Books',
  'Electronics',
  'Furniture',
  'Stationery',
  'Music',
  'Sports',
  'Other',
];

const PostItem = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    pricePerDay: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          pricePerDay: Number(form.pricePerDay),
          imageUrl: form.imageUrl,
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });
      if (!res.ok) throw new Error('Failed to post item');
      setMessage('Item posted successfully!');
      setForm({
        name: '',
        description: '',
        category: '',
        pricePerDay: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
      });
    } catch (err) {
      setError('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white py-12 px-4">
      <div className="w-full max-w-xl mx-auto card p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4 text-center">Post an Item for Rent</h2>
        {message && <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-2 text-center">{message}</div>}
        {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-2 text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white min-h-[80px]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per day (₹)</label>
            <input
              type="number"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500 bg-white"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability Start Date</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability End Date</label>
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
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 transition w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
