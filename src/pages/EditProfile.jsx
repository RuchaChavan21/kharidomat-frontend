import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const { user, isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user, isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8080/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] font-sans pt-20 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be logged in to view this page.</p>
          <Link to="/login" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] px-4 py-8 pt-20 font-sans">
      {/* Main container for the whole page. Removed the card styling from this div. */}
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">Edit Profile</h2>

        {/* Themed error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-center border border-red-300 font-medium">
            {error}
          </div>
        )}

        {/* Themed success */}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4 text-center border border-green-300 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="e.g., 9876543210"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-2 border bg-gray-100 text-gray-500 cursor-not-allowed rounded-lg"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white border-t-2 border-b-2 border-white rounded-full" viewBox="0 0 24 24" />
                  Updating...
                </span>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
