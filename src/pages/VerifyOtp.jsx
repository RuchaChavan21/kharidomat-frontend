import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      // If no email is stored, redirect back to forgot password
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, otp }),
      // });


      // Replace inside handleSubmit in VerifyOtp.jsx
setTimeout(() => {
  setMessage('OTP verified successfully!');
  navigate('/reset-password');
}, 1000);

      if (response.ok) {
        setMessage('OTP verified successfully!');
        setTimeout(() => {
          navigate('/reset-password');
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only allow digits, max 6
    setOtp(value);
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('OTP resent successfully! Please check your email.');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-accent-50 to-mint-50 pt-20">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-white font-bold text-2xl">📱</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
                Verify OTP
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Enter the 6-digit code sent to your email
              </p>
              {email && (
                <p className="text-sm text-gray-600 mt-2">
                  {email}
                </p>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={handleOtpChange}
                  className="input-field text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-6">
              <p className="text-gray-700 text-sm">
                Didn't receive the code?{' '}
                <button
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="text-purple-600 hover:text-purple-700 font-semibold disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            {/* Back to Forgot Password */}
            <div className="text-center mt-8">
              <p className="text-gray-700 leading-relaxed">
                <Link to="/forgot-password" className="text-purple-600 hover:text-purple-700 font-semibold">
                  ← Back to Forgot Password
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtp; 