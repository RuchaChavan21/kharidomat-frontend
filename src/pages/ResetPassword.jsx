import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api"; // Make sure to import your API service

const ResetPassword = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setMessage(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and a special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.post("/users/reset-password", {
        email: email,
        otp: otp,
        newPassword: password,
      });

      setMessage(response.data);
      sessionStorage.removeItem("resetEmail");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to reset password. The OTP may be incorrect or expired.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(password);

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
        <h2 className="text-[#222] font-semibold uppercase text-[24px] text-center mb-2 tracking-wide">Reset Password</h2>
        <div className="text-center text-[#555] text-[15px] mb-8">Enter the OTP from your email and your new password</div>

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

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* OTP input */}
          <div>
            <label htmlFor="otp" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Verification Code (from email)</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] transition-all text-center tracking-widest"
              maxLength={6}
              required
            />
          </div>

          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">New Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.minLength ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={passwordValidation.minLength ? "text-green-600" : "text-gray-500"}>At least 8 characters</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasUpperCase ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500"}>One uppercase letter</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasLowerCase ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500"}>One lowercase letter</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasNumbers ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={passwordValidation.hasNumbers ? "text-green-600" : "text-gray-500"}>One number</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasSpecialChar ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}>One special character</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Confirm New Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#B9162C] focus:ring-2 focus:ring-[#B9162C] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[#B9162C] text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !passwordValidation.isValid ||
              password !== confirmPassword ||
              otp.length !== 6
            }
            className={`w-full h-11 mt-2 rounded-[8px] bg-[#B9162C] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#a01325] focus:outline-none focus:ring-2 focus:ring-[#B9162C] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Resetting Password...</div>
            ) : ("Reset Password")}
          </button>
        </form>

        <div className="text-center mt-8">
          <span className="text-[#222] text-[14px]">Remember your password? </span>
          <Link to="/login" className="text-[#B9162C] font-semibold hover:underline text-[14px]">Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
