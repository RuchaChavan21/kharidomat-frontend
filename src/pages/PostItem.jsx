import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api'; // <--- CORRECTED PATH HERE

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
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
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
        title: form.name, // Assuming 'name' maps to 'title' in your Item model
        description: form.description,
        category: form.category,
        pricePerDay: Number(form.pricePerDay),
        startDate: form.startDate,
        endDate: form.endDate,
      };

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

        const uploadRes = await API.post(`/items/upload-image/${newItemId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log('Image upload response:', uploadRes.data);

        setImageUploading(false);
        setMessage('Item posted and image uploaded successfully!');

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
    // Pass success message to dashboard
    let successMsg = imageFile ? 'Item posted and image uploaded successfully!' : 'Item posted successfully!';
    navigate('/dashboard', { state: { successMessage: successMsg } });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center px-2 md:px-4">
      {/* Page Title */}
      <div className="max-w-xl w-full text-center mt-10 mb-6 md:mb-10">
        <h1 className="font-bold text-3xl md:text-4xl text-[#B9162C] mb-2">Post an Item for Rent</h1>
        <p className="text-gray-600 text-lg">List your item and start earning by sharing with the community.</p>
      </div>
      {/* Basic Item Details Card + Form */}
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 mt-0 mb-16">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-1">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300"
              placeholder="e.g., Study Table with Chair"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-1">Description <span className="font-normal text-xs text-gray-400">(optional)</span></label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base min-h-[80px] transition-all duration-300"
              placeholder="Include size, condition, and special notes."
              rows={4}
            />
            <div className="text-xs text-gray-400 mt-1">Include size, condition, and special notes.</div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-900 mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pricePerDay" className="block text-sm font-bold text-gray-900 mb-1">Price per day (₹)</label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300"
              min="1"
              required
            />
          </div>
          {/* Availability Section */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Availability</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <label htmlFor="startDate" className="block text-sm font-bold text-gray-900 mb-1">Start Date</label>
                <span className="absolute left-3 top-9 text-gray-400 pointer-events-none">
                  <svg width="18" height="18" fill="none" stroke="#B9162C" strokeWidth="2"><circle cx="9" cy="9" r="7"/><path d="M12 2v2M6 2v2M3 6h12"/></svg>
                </span>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <label htmlFor="endDate" className="block text-sm font-bold text-gray-900 mb-1">End Date</label>
                <span className="absolute left-3 top-9 text-gray-400 pointer-events-none">
                  <svg width="18" height="18" fill="none" stroke="#B9162C" strokeWidth="2"><circle cx="9" cy="9" r="7"/><path d="M12 2v2M6 2v2M3 6h12"/></svg>
                </span>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] bg-white text-gray-900 text-base transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Upload Image</h3>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white transition-colors duration-300 cursor-pointer hover:border-[#B9162C]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                id="imageUpload"
                accept=".jpg,.jpeg,.png,image/*"
                onChange={handleImageChange}
                className="w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F9F9F9] file:text-[#B9162C] hover:file:bg-[#F3EAEA] focus:outline-[#B9162C]"
                style={{ display: 'block' }}
              />
              <span className="text-xs text-gray-500 mt-2">Drag & drop or click to select an image (JPG, JPEG, PNG)</span>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto object-cover border rounded-md" />
              )}
              {imageUploading && (
                <div className="mt-2 text-[#B9162C] text-sm">Uploading image...</div>
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
              className="bg-[#B9162C] text-white font-bold rounded-lg px-6 py-3 shadow hover:bg-[#a01325] transition-all duration-300 w-full sm:w-auto"
              disabled={loading || imageUploading}
            >
              {loading ? 'Processing...' : 'Post Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="border border-[#B9162C] text-[#B9162C] font-bold rounded-lg px-6 py-3 bg-white hover:bg-[#F9F9F9] transition-all duration-300 w-full sm:w-auto"
              disabled={loading || imageUploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostItem;