import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageError(null);
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (.jpg, .jpeg, .png)');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Optional: Drag and drop support
  const handleDrop = (e) => {
    e.preventDefault();
    setImageError(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (.jpg, .jpeg, .png)');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setImageError(null);
    if (!imageFile) {
      setImageError('Please select an image to upload.');
      setLoading(false);
      return;
    }
    let uploadedImageUrl = '';
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      const uploadRes = await axios.post('http://localhost:8080/api/items/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      uploadedImageUrl = uploadRes.data.imageUrl || uploadRes.data.url || uploadRes.data.path;
      setImageUploading(false);
    } catch (err) {
      setImageUploading(false);
      setImageError('Failed to upload image. Please try again.');
      setLoading(false);
      return;
    }
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
          imageUrl: uploadedImageUrl,
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
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white py-12 px-4 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="w-full max-w-xl mx-auto card p-8 space-y-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300">
        <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-4 text-center">Post an Item for Rent</h2>
        {message && <div className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded mb-2 text-center transition-colors duration-300">{message}</div>}
        {error && <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-2 text-center transition-colors duration-300">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[80px] transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Price per day ( 4b9)</label>
            <input
              type="number"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              min="1"
              required
            />
          </div>
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Upload Image</label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-900 transition-colors duration-300 cursor-pointer hover:border-purple-400"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png,image/*"
                onChange={handleImageChange}
                className="w-full text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 focus:outline-purple-500"
                style={{ display: 'block' }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Drag & drop or click to select an image (JPG, JPEG, PNG)</span>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto object-cover border rounded-md" />
              )}
              {imageUploading && (
                <div className="mt-2 text-purple-600 dark:text-purple-400 text-sm">Uploading image...</div>
              )}
              {imageError && (
                <div className="mt-2 text-red-600 dark:text-red-400 text-sm">{imageError}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Availability Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Availability End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
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
