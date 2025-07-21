import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api"; // Import your API service

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 1. Make the real API call to your forgot-password endpoint
      const response = await API.post("/users/forgot-password", { email });

      // 2. Handle the successful response
      setMessage("OTP sent successfully! Please check your email.");

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
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto mt-10 mb-10 bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex flex-col items-center p-8 md:p-10"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="w-16 h-16 bg-[#fff3f3] rounded-2xl flex items-center justify-center mb-4 shadow">
          <span className="text-[#B9162C] font-bold text-3xl">🔒</span>
        </div>
        <h2 className="text-[#222] font-semibold uppercase text-[24px] text-center mb-2 tracking-wide">Forgot Password</h2>
        <div className="text-center text-[#555] text-[15px] mb-8">Enter your email address and we'll send you a verification code</div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm w-full text-center ${
              message.includes("successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-[#B9162C] border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-11 mt-2 rounded-[8px] bg-[#B9162C] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#a01325] focus:outline-none focus:ring-2 focus:ring-[#B9162C] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Sending OTP...</div>
            ) : ("Send OTP")}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <span className="text-[#222] text-[14px]">Remember your password? </span>
          <Link to="/login" className="text-[#B9162C] font-semibold hover:underline text-[14px]">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
