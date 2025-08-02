import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

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
    // Ensure these match your ItemPostRequest DTO on backend
    pricePerDay: '',
    startDate: '',
    endDate: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/categories/all");
        console.log("Categories response:", response.data);
        
        // Check if response.data is an array and has the expected structure
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCategories(response.data);
        } else {
          // If API returns empty or unexpected data, use fallback
          throw new Error("API returned empty or invalid data");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories if API fails or returns invalid data
        const fallbackCategories = [
          { name: 'Electronics' },
          { name: 'Books' },
          { name: 'Furniture' },
          { name: 'Hostel Essentials' },
          { name: 'Clothing & Costumes' },
          { name: 'Sports Equipment' },
          { name: 'Bicycles' },
          { name: 'Event Decor' },
          { name: 'Musical Instruments' },
          { name: 'Lab Equipment' },
          { name: 'Mobile Accessories' },
          { name: 'Kitchenware' },
          { name: 'Stationery' },
          { name: 'Others' }
        ];
        setCategories(fallbackCategories);
        console.log("Using fallback categories:", fallbackCategories);
      }
    };
    
    // For now, let's use fallback categories immediately to ensure all 14 are shown
    const fallbackCategories = [
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Furniture' },
      { name: 'Hostel Essentials' },
      { name: 'Clothing & Costumes' },
      { name: 'Sports Equipment' },
      { name: 'Bicycles' },
      { name: 'Event Decor' },
      { name: 'Musical Instruments' },
      { name: 'Lab Equipment' },
      { name: 'Mobile Accessories' },
      { name: 'Kitchenware' },
      { name: 'Stationery' },
      { name: 'Others' }
    ];
    setCategories(fallbackCategories);
    console.log("Setting fallback categories immediately:", fallbackCategories);
    
    // Uncomment the line below when you want to fetch from API again
    // fetchCategories();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedCategories.includes(selectedValue)) {
      setSelectedCategories(prev => [...prev, selectedValue]);
    }
  };

  const removeCategory = (categoryToRemove) => {
    setSelectedCategories(prev => prev.filter(cat => cat !== categoryToRemove));
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
    
    // Validate that at least one category is selected
    if (selectedCategories.length === 0) {
      setError("Please select at least one category.");
      return;
    }
    
    setLoading(true);
    setMessage(null);
    setError(null);
    setImageError(null);

    let newItemId = null;
    try {
      const itemToPost = {
        title: form.name,
        description: form.description,
        categories: selectedCategories,
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
      pricePerDay: '',
      startDate: '',
      endDate: '',
    });
    setSelectedCategories([]);
    setImageFile(null);
    setImagePreview(null);
    setLoading(false);
    let successMsg = imageFile ? 'Item posted and image uploaded successfully!' : 'Item posted successfully!';
    navigate('/dashboard', { state: { successMessage: successMsg } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex-1">
            <h1 className="font-extrabold text-xl text-[#D32F2F] tracking-wide uppercase">Post an Item for Rent</h1>
            <p className="text-gray-600 text-sm mt-1">List your item and start earning by sharing with the community.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="border-b border-gray-200 mb-4"></div>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Item Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 text-base transition-all duration-200"
              placeholder="e.g., Study Table with Chair"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Description <span className="font-normal text-xs text-gray-400 normal-case">(optional)</span></label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 text-base min-h-[70px] transition-all duration-200"
              placeholder="Include size, condition, and special notes."
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1">Include size, condition, and special notes.</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Categories</label>
            
            {/* Dropdown for selecting categories */}
            <div className="mb-4">
              <select
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 text-base transition-all duration-200"
                defaultValue=""
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option 
                    key={category.name} 
                    value={category.name}
                    disabled={selectedCategories.includes(category.name)}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Display selected categories */}
            {selectedCategories.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Selected Categories:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-2 text-white hover:text-red-200 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedCategories.length === 0 && categories.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">Please select at least one category</p>
            )}
            
            {/* Debug info - remove this later */}
            <div className="text-xs text-gray-400 mt-1 opacity-50">
              Debug: {categories.length} categories loaded, {selectedCategories.length} selected
            </div>
          </div>
          <div>
            <label htmlFor="pricePerDay" className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Price per day (₹)</label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 text-base transition-all duration-200"
              min="1"
              required
            />
          </div>
          {/* Availability Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-4">
            <h3 className="font-semibold text-base text-red-600 mb-3 uppercase tracking-wide">Availability</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <label htmlFor="startDate" className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">Start Date</label>
                <span className="absolute left-3 top-9 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M10 2v2M6 2v2M2 6h12" /></svg>
                </span>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // <-- This line
                  className="w-full rounded-lg border border-gray-300 px-8 py-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 text-base transition-all duration-200"
                  required
                />
              </div>
              <div className="flex-1 relative">
                <label htmlFor="endDate" className="block text-sm font-semibold text-red-600 mb-2 uppercase tracking-wide">End Date</label>
                <span className="absolute left-3 top-9 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M10 2v2M6 2v2M2 6h12" /></svg>
                </span>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 px-8 py-2.5 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 text-base transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>
          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-4">
            <h3 className="font-semibold text-base text-red-600 mb-3 uppercase tracking-wide">Upload Image</h3>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-red-400 rounded-lg p-5 bg-white transition-colors duration-200 cursor-pointer hover:border-red-500"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
                             <input
                 type="file"
                 id="imageUpload"
                 accept=".jpg,.jpeg,.png,image/*"
                 onChange={handleImageChange}
                 className="w-full text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-base file:font-semibold file:bg-gray-100 file:text-red-600 hover:file:bg-gray-200 focus:outline-red-400"
                 style={{ display: 'block' }}
               />
              <span className="text-xs text-gray-500 mt-2">Drag & drop or click to select an image (JPG, JPEG, PNG)</span>
                             {imagePreview && (
                 <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto object-cover border-2 border-red-400 rounded-lg" />
               )}
               {imageUploading && (
                 <div className="mt-2 text-red-600 text-sm">Uploading image...</div>
               )}
               {imageError && (
                 <div className="mt-2 text-red-600 text-sm">{imageError}</div>
               )}
              <div className="text-xs text-gray-400 mt-2">Show the actual condition of your item. One image is required.</div>
            </div>
          </div>
                    {/* Submission Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="bg-red-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow hover:bg-red-700 transition-all duration-200 w-full sm:w-auto text-base"
              disabled={loading || imageUploading}
            >
              {loading ? 'Processing...' : 'Post Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="border border-red-600 text-red-600 font-semibold rounded-lg px-6 py-2.5 bg-white hover:bg-red-50 transition-all duration-200 w-full sm:w-auto text-base"
              disabled={loading || imageUploading}
            >
              Cancel
            </button>
          </div>
         </form>
       </div>
     </motion.div>
   </div>
 );
};

export default PostItem;