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
                <span className="text-white font-bold text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Enter your email address and we'll send you a verification code
              </p>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg text-sm ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-gray-700 leading-relaxed">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
