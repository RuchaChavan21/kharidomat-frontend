import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion } from 'framer-motion';

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
  // Get the token directly from useAuth context
  const { isLoggedIn, token } = useAuth(); // <-- Get token from context here
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    // Ensure these match your ItemPostRequest DTO on backend
    pricePerDay: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageError(null);
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (.jpg, .jpeg, .png).');
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImageError(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (.jpg, .jpeg, .png).');
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

    let newItemId = null;
    try {
      const itemToPost = {
        title: form.name,
        description: form.description,
        category: form.category,
        pricePerDay: Number(form.pricePerDay),
        startDate: form.startDate,
        endDate: form.endDate,
      };

      // This API call should be handled by the interceptor for authorization
      const itemResponse = await API.post('/items/post', itemToPost);
      newItemId = itemResponse.data.id;

      if (!newItemId) {
        throw new Error('Item created but no ID returned. Cannot upload image.');
      }

    } catch (err) {
      console.error('Error posting item:', err.response?.data || err.message);
      const postErrorMessage = err.response?.data?.message || 'Failed to post item. Please check your inputs.';
      setError(postErrorMessage);
      setLoading(false);
      return;
    }

    if (imageFile && newItemId) {
      try {
        setImageUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile); // Backend expects @RequestParam("file")

        // console.log('Uploading image with token:', token); // Keep this for debugging if needed

        // --- CRITICAL CHANGE: Remove explicit Authorization header here ---
        // The API.js interceptor will automatically add the token if it's available in context/localStorage
        const uploadRes = await API.post(`/items/upload-image/${newItemId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${token}`, // <-- REMOVE THIS LINE
          },
        });

        let uploadedImageName = null;
        if (uploadRes.data && typeof uploadRes.data === 'object' && uploadRes.data.imageName) {
          uploadedImageName = uploadRes.data.imageName;
        } else if (typeof uploadRes.data === 'string') {
          uploadedImageName = uploadRes.data;
        } else {
          console.warn("Unexpected image upload response data:", uploadRes.data);
          setImageError("Image upload response was unexpected. Please check server logs.");
        }

        if (uploadedImageName) {
          // Construct the full image URL using the received image name and API base URL
          const fullImageUrl = `${API.defaults.baseURL}/items/image/${uploadedImageName}`;
          console.log('Image uploaded successfully. Full URL:', fullImageUrl);
          setMessage('Item posted and image uploaded successfully!');
        } else {
          throw new Error("Image name not received from upload response.");
        }

        setImageUploading(false);

      } catch (err) {
        setImageUploading(false);
        console.error('Error uploading image:', err.response?.data || err.message);
        const uploadErrorMessage = err.response?.data?.message || 'Failed to upload image. Item was created, but image upload failed.';
        setImageError(uploadErrorMessage);
        setError(prev => prev ? prev + '\n' + uploadErrorMessage : uploadErrorMessage);
      }
    } else if (!imageFile) {
      setMessage('Item posted successfully! No image was uploaded.');
    }

    setForm({
      name: '',
      description: '',
      category: '',
      pricePerDay: '',
      startDate: '',
      endDate: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setLoading(false);
    let successMsg = imageFile ? 'Item posted and image uploaded successfully!' : 'Item posted successfully!';
    navigate('/dashboard', { state: { successMessage: successMsg } });
  };

  return (
    <div className="min-h-screen bg-[#fff3f3] flex flex-col items-center justify-center px-2 md:px-4 py-10 pt-24">
      {/* Page Title */}
      <div className="max-w-xl w-full text-left mt-4 mb-8">
        <h1 className="w-full max-w-full break-words px-2 text-center md:text-left font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#D32F2F] mb-2 tracking-wide uppercase">Post an Item for Rent</h1>
        <p className="text-gray-700 text-lg font-medium text-center md:text-left px-2">List your item and start earning by sharing with the community.</p>
      </div>
      {/* Basic Item Details Card + Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-[#D32F2F] p-8 mt-0 mb-16"
      >
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-base font-bold text-[#D32F2F] mb-2 uppercase tracking-wide">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-900 text-lg transition-all duration-300"
              placeholder="e.g., Study Table with Chair"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-base font-bold text-[#D32F2F] mb-2 uppercase tracking-wide">Description <span className="font-normal text-xs text-gray-400 normal-case">(optional)</span></label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-900 text-lg min-h-[80px] transition-all duration-300"
              placeholder="Include size, condition, and special notes."
              rows={4}
            />
            <div className="text-xs text-gray-400 mt-1">Include size, condition, and special notes.</div>
          </div>
          <div>
            <label htmlFor="category" className="block text-base font-bold text-[#D32F2F] mb-2 uppercase tracking-wide">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-900 text-lg transition-all duration-300"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pricePerDay" className="block text-base font-bold text-[#D32F2F] mb-2 uppercase tracking-wide">Price per day (₹)</label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-xl px-5 py-3 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-900 text-lg transition-all duration-300"
              min="1"
              required
            />
          </div>
          {/* Availability Section */}
          <div className="bg-[#fff3f3] rounded-xl shadow border-2 border-[#D32F2F] p-6 mb-6">
            <h3 className="font-bold text-lg text-[#D32F2F] mb-4 uppercase tracking-wide">Availability</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <label htmlFor="startDate" className="block text-base font-bold text-[#D32F2F] mb-2 uppercase tracking-wide">Start Date</label>
                <span className="absolute left-3 top-11 text-gray-400 pointer-events-none">
                  <svg width="18" height="18" fill="none" stroke="#D32F2F" strokeWidth="2"><circle cx="9" cy="9" r="7" /><path d="M12 2v2M6 2v2M3 6h12" /></svg>
                </span>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-10 py-3 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-900 text-lg transition-all duration-300"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <label htmlFor="endDate" className="block text-base font-bold text-[#D32F2F] mb-2 uppercase tracking-wide">End Date</label>
                <span className="absolute left-3 top-11 text-gray-400 pointer-events-none">
                  <svg width="18" height="18" fill="none" stroke="#D32F2F" strokeWidth="2"><circle cx="9" cy="9" r="7" /><path d="M12 2v2M6 2v2M3 6h12" /></svg>
                </span>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-300 rounded-xl px-10 py-3 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-900 text-lg transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>
          {/* Image Upload Section */}
          <div className="bg-[#fff3f3] rounded-xl shadow border-2 border-[#D32F2F] p-6 mb-6">
            <h3 className="font-bold text-lg text-[#D32F2F] mb-4 uppercase tracking-wide">Upload Image</h3>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#D32F2F] rounded-xl p-6 bg-white transition-colors duration-300 cursor-pointer hover:border-[#B9162C]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="imageUpload"
                accept=".jpg,.jpeg,.png,image/*"
                onChange={handleImageChange}
                className="w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-base file:font-semibold file:bg-[#F9F9F9] file:text-[#D32F2F] hover:file:bg-[#F3EAEA] focus:outline-[#D32F2F]"
                style={{ display: 'block' }}
              />
              <span className="text-xs text-gray-500 mt-2">Drag & drop or click to select an image (JPG, JPEG, PNG)</span>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto object-cover border-2 border-[#D32F2F] rounded-lg" />
              )}
              {imageUploading && (
                <div className="mt-2 text-[#D32F2F] text-sm">Uploading image...</div>
              )}
              {imageError && (
                <div className="mt-2 text-red-600 text-sm">{imageError}</div>
              )}
              <div className="text-xs text-gray-400 mt-2">Show the actual condition of your item. One image is required.</div>
            </div>
          </div>
          {/* Submission Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              className="bg-[#D32F2F] text-white font-bold rounded-xl px-8 py-3 shadow hover:bg-[#a01325] transition-all duration-300 w-full sm:w-auto text-lg"
              disabled={loading || imageUploading}
            >
              {loading ? 'Processing...' : 'Post Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="border-2 border-[#D32F2F] text-[#D32F2F] font-bold rounded-xl px-8 py-3 bg-white hover:bg-[#F9F9F9] transition-all duration-300 w-full sm:w-auto text-lg"
              disabled={loading || imageUploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostItem;
