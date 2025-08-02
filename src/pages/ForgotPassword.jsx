import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api"; // Import your API service

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(""); // This state will hold both success and error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous messages

    try {
      // 1. Make the real API call to your forgot-password endpoint
      await API.post("/users/forgot-password", { email });

      // 2. Handle the successful response
      setMessage("OTP sent successfully! Please check your email and spam folder.");

      // Store email in sessionStorage for the next step (verify OTP)
      sessionStorage.setItem("resetEmail", email);

      // Navigate to the OTP verification page after a short delay
      setTimeout(() => {
        navigate("/reset-password"); // Or your specific route for OTP verification
      }, 1500);
    } catch (error) {
      // 3. Handle errors from the backend
      console.error("Error sending OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to send OTP. Please try again.";
      setMessage(errorMessage); // Set the error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Half – Branding with Logo */}
      <div className="md:w-1/2 w-full flex items-center justify-center px-4 py-20 md:py-0 bg-gradient-to-br from-[#D32F2F] to-[#b71c1c] relative overflow-hidden">
        {/* Logo and App Name */}
        <div className="text-center relative z-10">
          {/* Logo SVG */}
          <div className="mb-6">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120" 
              className="mx-auto"
              fill="none"
            >
              {/* Shopping bag icon */}
              <path 
                d="M30 40h60v50c0 5.5-4.5 10-10 10H40c-5.5 0-10-4.5-10-10V40z" 
                fill="white" 
                stroke="white" 
                strokeWidth="2"
              />
              {/* Bag handles */}
              <path 
                d="M35 40c0-8.3 6.7-15 15-15s15 6.7 15 15" 
                stroke="white" 
                strokeWidth="2" 
                fill="none"
              />
              <path 
                d="M55 40c0-8.3 6.7-15 15-15s15 6.7 15 15" 
                stroke="white" 
                strokeWidth="2" 
                fill="none"
              />
              {/* Money symbol */}
              <text 
                x="60" 
                y="75" 
                textAnchor="middle" 
                fill="#D32F2F" 
                fontSize="24" 
                fontWeight="bold"
              >
                ₹
              </text>
            </svg>
          </div>
          
          {/* App Name */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center tracking-wide">
            Kharido-mat!
          </h1>
          
          {/* Tagline */}
          <p className="text-white text-lg md:text-xl mt-4 font-medium opacity-90">
            Campus Rental Marketplace
          </p>
          
          {/* Decorative elements */}
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-40"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-white opacity-10 rounded-full"></div>
      </div>
      {/* Right Side – Form Card */}
      <div className="md:w-1/2 w-full flex items-center justify-center px-4 py-20 md:py-0 bg-white" style={{ paddingTop: '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Themed card styling
          className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] flex flex-col items-center p-8 md:p-10"
        >
          {/* Header Icon */}
          <div className="w-16 h-16 bg-[#fff3f3] rounded-2xl flex items-center justify-center mb-4 shadow-md border-2 border-[#D32F2F]">
            <span className="text-[#D32F2F] font-bold text-3xl">🔒</span> {/* Changed icon color to primary red */}
          </div>
          {/* Header Text */}
          <h2 className="text-[#D32F2F] font-extrabold uppercase text-3xl text-center mb-3 tracking-wide">Forgot Password</h2> {/* Themed heading */}
          <p className="text-gray-700 text-lg text-center mb-8 font-medium">Enter your email address and we'll send you a verification code</p> {/* Themed text */}

          {/* Message Display (Success/Error) */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg text-base w-full text-center border ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700 border-green-300" // Themed success
                  : "bg-red-100 text-red-700 border-red-300" // Themed error
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Email Address</label> {/* Themed label */}
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200" /* Themed input */
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              // Themed button style
              className={`w-full h-12 mt-2 rounded-lg bg-[#D32F2F] text-white font-bold uppercase text-lg tracking-wide shadow-md transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 focus:ring-offset-white ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <span className="text-gray-700 text-base font-medium">Remember your password? </span> {/* Themed text */}
            <Link to="/login" className="text-[#D32F2F] font-bold hover:underline text-base">Back to Login</Link> {/* Themed link */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;