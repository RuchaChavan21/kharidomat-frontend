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
    // Main container with themed background and padding for fixed Navbar
    <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] px-4 py-8 pt-20 font-sans">
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
  );
};

export default ForgotPassword;