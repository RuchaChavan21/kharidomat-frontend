import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Email verification states
  const [otp, setOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear password match error when user types
    if (name === 'confirmPassword' && errors.passwordMatch) {
      setErrors(prev => ({ ...prev, passwordMatch: '' }));
    }
    
    // Reset email verification if email changes
    if (name === 'email' && emailVerified) {
      setEmailVerified(false);
      setShowOtpInput(false);
      setOtp('');
      setOtpMessage('');
    }
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, passwordMatch: 'Passwords do not match' }));
      return false;
    }
    setErrors(prev => ({ ...prev, passwordMatch: '' }));
    return true;
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setOtpMessage('Please enter your email first');
      return;
    }

    setIsLoading(true);
    setOtpMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setOtpMessage('OTP sent to your email.');
        setShowOtpInput(true);
        // Store email in sessionStorage for consistency with other flows
        sessionStorage.setItem('registerEmail', formData.email);
      } else {
        const errorData = await response.json();
        setOtpMessage(errorData.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpMessage('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setOtpMessage('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          otp 
        }),
      });

      if (response.ok) {
        setOtpMessage('Email verified successfully!');
        setEmailVerified(true);
        setShowOtpInput(false);
        // Store verification status
        sessionStorage.setItem('emailVerified', 'true');
      } else {
        const errorData = await response.json();
        setOtpMessage(errorData.message || 'Invalid OTP. Try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpMessage('An error occurred. Please try again.');
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
    setOtpMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setOtpMessage('OTP resent successfully! Please check your email.');
      } else {
        const errorData = await response.json();
        setOtpMessage(errorData.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setOtpMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!emailVerified) {
      setOtpMessage('Please verify your email first');
      return;
    }
    
    if (!validatePasswords()) {
      return;
    }
    
    // TODO: Handle registration logic here
    console.log('Registration data:', formData);
  };

  const isFormValid = () => {
    return emailVerified && 
           formData.password === formData.confirmPassword && 
           formData.confirmPassword !== '' &&
           formData.password !== '';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200 dark:border-gray-800 transition-colors duration-300"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input
              id="name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Sujal Samadiya"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="202301040116@college.com"
                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
                required
                disabled={emailVerified}
              />
              {!emailVerified && (
                <motion.button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !formData.email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600 text-sm whitespace-nowrap"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </motion.button>
              )}
              {emailVerified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-1 px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm flex items-center"
                >
                  ✓ Verified
                </motion.div>
              )}
            </div>
          </div>

          {/* OTP Message */}
          {otpMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg text-sm ${
                otpMessage.includes('successfully') || otpMessage.includes('sent')
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {otpMessage}
            </motion.div>
          )}

          {/* OTP Input */}
          {showOtpInput && !emailVerified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={handleOtpChange}
                    className="mt-1 flex-1 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <motion.button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 text-sm whitespace-nowrap"
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </motion.button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-700 text-sm">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isLoading}
                    className="text-purple-600 hover:text-purple-700 font-semibold disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* Registration Form - Only show after email verification */}
          {emailVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-10 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-10 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.passwordMatch && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.passwordMatch}
                  </motion.div>
                )}
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g. 12345678"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={!isFormValid()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
              >
                Register
              </motion.button>
            </motion.div>
          )}
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-700 dark:text-gray-300">Already have an account? </span>
          <a href="/login" className="text-purple-600 dark:text-purple-400 hover:underline transition-colors duration-300">Log in</a>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
