import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for consistent navigation
import API from "../services/api"; // Assuming your API service is set up

const Register = () => {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password & Details
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // States for UI toggles and validation
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const isPasswordStrong = Object.values(passwordValidation).every(Boolean);

  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password), // Includes common special characters
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear errors on input change
    setMessage(""); // Clear messages on input change
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits
    setOtp(value);
    setError("");
    setMessage("");
  };

  // --- API HANDLERS FOR EACH STEP ---

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!formData.fullName || !formData.email) {
      setError("Please fill in both full name and email.");
      setIsLoading(false);
      return;
    }

    try {
      // This endpoint should only send an OTP, NOT save the user.
      await API.post("/users/register", {
        fullName: formData.fullName,
        email: formData.email,
      });
      setMessage(`OTP sent to ${formData.email}. Please check your inbox (and spam folder).`);
      setStep(2); // Move to OTP step
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please ensure the email is valid and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await API.post("/users/register", { // Re-using the same endpoint for resend
        fullName: formData.fullName,
        email: formData.email,
      });
      setMessage("A new OTP has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await API.post("/users/verify", {
        email: formData.email,
        otp: otp,
      });
      setMessage("Email verified successfully! You can now set your password and complete registration.");
      setStep(3); // Move to the final step
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isPasswordStrong) { // Use the consolidated validation
      setError("Password does not meet all requirements.");
      return;
    }
    if (!formData.studentId) {
        setError("Please enter your Student ID.");
        return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await API.post("/users/complete-registration", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
      });
      alert("Registration successful! You can now log in.");
      window.location.href = "/login"; // Full page reload to clear state and redirect
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. This email or Student ID might already be registered.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  const fadeInOutVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    // Added pt-20 to push content down below fixed Navbar (similar to Login page)
    <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] px-4 py-8 pt-20 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] flex flex-col items-center p-8 md:p-10"
      >
        <h2 className="text-[#D32F2F] font-extrabold uppercase text-3xl text-center mb-6 tracking-wide">
          {step === 1 ? 'Register' : step === 2 ? 'Verify Email' : 'Complete Registration'}
        </h2>

        {/* Universal Message Display */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              key="message"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOutVariants}
              className="p-3 my-2 text-base text-center text-green-700 bg-green-100 rounded-lg border border-green-300 w-full"
            >
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOutVariants}
              className="p-3 my-2 text-base text-center text-red-700 bg-red-100 rounded-lg border border-red-300 w-full"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* Step 1: Email Form */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOutVariants}
              onSubmit={handleSendOtp}
              className="w-full flex flex-col gap-5"
            >
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className={`w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !formData.fullName ? 'border-red-500' : ''}`}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@college.com"
                  required
                  className={`w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !formData.email ? 'border-red-500' : ''}`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !formData.fullName || !formData.email}
                className={`w-full h-12 mt-2 rounded-lg bg-[#D32F2F] text-white font-bold uppercase text-lg tracking-wide shadow-md transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 focus:ring-offset-white ${isLoading || !formData.fullName || !formData.email ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
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
            </motion.form>
          )}

          {/* Step 2: OTP Form */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOutVariants}
              onSubmit={handleVerifyOtp}
              className="w-full flex flex-col gap-5"
            >
              <p className="text-center text-gray-700 text-base mb-2">Enter the 6-digit code sent to <span className="font-semibold text-[#222]">{formData.email}</span></p>
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Verification Code</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="••••••"
                  maxLength={6}
                  className={`w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-base text-center tracking-widest placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && otp.length < 6 ? 'border-red-500' : ''}`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className={`w-full h-12 mt-2 rounded-lg bg-[#D32F2F] text-white font-bold uppercase text-lg tracking-wide shadow-md transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 focus:ring-offset-white ${isLoading || otp.length < 6 ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
              <div className="text-center mt-2">
                <span className="text-gray-700 text-sm">Didn't receive it? </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="font-bold text-[#D32F2F] hover:underline disabled:opacity-60 text-sm transition-colors duration-200"
                >
                  Resend OTP
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 3: Password and Details Form */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInOutVariants}
              onSubmit={handleCompleteRegistration}
              className="w-full flex flex-col gap-5"
            >
              {/* No need for "Email Verified" message here, handled by universal message */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className={`w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !formData.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    )}
                  </button>
                </div>
                {/* Password Validation Checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                  <div className={`flex items-center gap-1.5 ${passwordValidation.length ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.length ? '✔' : '✘'} At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.uppercase ? '✔' : '✘'} Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.lowercase ? '✔' : '✘'} Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.number ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.number ? '✔' : '✘'} At least one number
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordValidation.specialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidation.specialChar ? '✔' : '✘'} At least one special character
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className={`w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !formData.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="studentId" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Student ID</label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="e.g. 12345678"
                  required
                  className={`w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !formData.studentId ? 'border-red-500' : ''}`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong || formData.password !== formData.confirmPassword} // Added confirmation match to disable
                className={`w-full h-12 mt-2 rounded-lg bg-[#D32F2F] text-white font-bold uppercase text-lg tracking-wide shadow-md transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 focus:ring-offset-white ${isLoading || !isPasswordStrong || formData.password !== formData.confirmPassword ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              >
                {isLoading ? 'Completing...' : 'Complete Registration'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* --- Global Register/Login Link --- */}
        <div className="mt-8 text-center">
          <span className="text-gray-700 text-base font-medium">Already have an account? </span>
          <Link to="/login" className="text-[#D32F2F] font-bold hover:underline text-base">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;