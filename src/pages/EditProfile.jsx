import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';



const EditProfile = () => {

  const { user, isLoggedIn, token, refreshUser } = useAuth();

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');

  const [phone, setPhone] = useState('');

  const [prn, setPrn] = useState('');

  const [academicYear, setAcademicYear] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');



  useEffect(() => {

    if (!isLoggedIn) {

      navigate('/login');

    } else if (user) {

      // Use the correct field names from your User model

      setFullName(user.fullName || '');

      setPhone(user.phone || '');

      setPrn(user.prn || '');

      setAcademicYear(user.academicYear || '');

    }

  }, [user, isLoggedIn, navigate]);

  // Auto-close modal after successful update
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    setSuccess('');



    try {

      const response = await fetch(`http://localhost:8080/api/users/edit-profile`, {

        method: 'PUT', // ← OR 'POST' if your backend uses @PostMapping

        headers: {

          'Content-Type': 'application/json',

          Authorization: `Bearer ${token}`,

        },

        body: JSON.stringify({ fullName, phone, prn, academicYear }),

      });



      const contentType = response.headers.get("content-type");

      let data;



      if (contentType && contentType.includes("application/json")) {

        data = await response.json();

      } else {

        data = await response.text();

      }



      if (!response.ok) {

        throw new Error(data.message || data || 'Failed to update profile');

      }



      setSuccess('Profile updated successfully!');
      
      if (refreshUser) refreshUser();



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

    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">

      <motion.div

        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"

        initial={{ opacity: 0, scale: 0.95 }}

        animate={{ opacity: 1, scale: 1 }}

        transition={{ duration: 0.3, ease: 'easeOut' }}

      >

        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-red-600">Edit Profile</h2>
            <p className="text-gray-600 text-sm mt-1">Update your personal information</p>
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



        {error && (

          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm border border-red-200">

            {error}

          </div>

        )}







        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          {/* 3. Updated field for Full Name */}

          <div>

            <label className="block text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">Full Name</label>

            <input

              type="text"

              value={fullName}

              onChange={(e) => setFullName(e.target.value)}

              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 transition-all duration-200"

              required

            />

          </div>



          <div>

            <label className="block text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">Phone</label>

            <input

              type="tel"

              value={phone}

              onChange={(e) => setPhone(e.target.value)}

              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 transition-all duration-200"

              placeholder="e.g., 9876543210"

            />

          </div>



          {/* 4. Added new fields for PRN and Academic Year */}

          <div>

            <label className="block text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">PRN</label>

            <input

              type="text"

              value={prn}

              onChange={(e) => setPrn(e.target.value)}

              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 transition-all duration-200"

              placeholder="Enter your PRN"

            />

          </div>



          <div>

            <label className="block text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">Academic Year</label>

            <input

              type="text"

              value={academicYear}

              onChange={(e) => setAcademicYear(e.target.value)}

              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 bg-white text-gray-900 transition-all duration-200"

              placeholder="e.g., Third Year"

            />

          </div>



          <div>

            <label className="block text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">Email</label>

            <input

              type="email"

              value={user?.email}

              disabled

              className="w-full rounded-lg border border-gray-300 p-2 bg-gray-100 text-gray-500 cursor-not-allowed transition-all duration-200"

            />

          </div>



          <div className="flex justify-center mt-6">

            <button

              type="submit"

              disabled={loading}

              className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold"

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

          {success && (

            <div className="mt-4 bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm border border-green-200 flex items-center justify-between">

              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </span>
              <span className="text-xs text-green-500">Redirecting...</span>

            </div>

          )}

        </form>
      </div>
    </motion.div>
  </div>

  );

};



export default EditProfile;



