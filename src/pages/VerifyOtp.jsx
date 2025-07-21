import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api"; // Import your API service

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      await API.post("/users/verify", { email, otp });
      setMessage("OTP verified successfully!");
      setTimeout(() => {
        navigate("/reset-password", { state: { otp: otp } });
      }, 1500);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid OTP. Please try again.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits, max 6
    setOtp(value);
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      await API.post("/users/forgot-password", { email });
      setMessage("A new OTP has been sent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to resend OTP. Please try again.";
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
          <span className="text-[#B9162C] font-bold text-3xl">📱</span>
        </div>
        <h2 className="text-[#222] font-semibold uppercase text-[24px] text-center mb-2 tracking-wide">Verify OTP</h2>
        <div className="text-center text-[#555] text-[15px] mb-2">Enter the 6-digit code sent to</div>
        {email && <div className="text-sm text-[#B9162C] font-semibold mb-4">{email}</div>}

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm w-full text-center ${
              message.toLowerCase().includes("success")
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
            <label htmlFor="otp" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Verification Code</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={handleOtpChange}
              className="w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-2xl tracking-widest text-center placeholder-gray-400 focus:outline-none focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] transition-all"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`w-full h-11 mt-2 rounded-[8px] bg-[#B9162C] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#a01325] focus:outline-none focus:ring-2 focus:ring-[#B9162C] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Verifying...</div>
            ) : ("Verify & Proceed")}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          <span className="text-[#222] text-[14px]">Didn't receive the code? </span>
          <button
            onClick={resendOtp}
            disabled={isLoading}
            className="text-[#B9162C] font-semibold hover:underline text-[14px] disabled:opacity-50"
          >
            Resend OTP
          </button>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <Link to="/login" className="text-[#B9162C] font-semibold hover:underline text-[14px]">← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
