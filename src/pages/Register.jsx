import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../services/api"; // Assuming your API service is set up
// import { useTheme } from "../context/ThemeContext"; // You can re-enable this if needed

const Register = () => {
  // const { theme } = useTheme();

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

  const isFormValid = Object.values(passwordValidation).every(Boolean);

  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear errors on input change
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits
    setOtp(value);
    setError("");
  };

  // --- API HANDLERS FOR EACH STEP ---

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      // This endpoint should only send an OTP, NOT save the user.
      await API.post("/users/register", {
        fullName: formData.fullName,
        email: formData.email,
      });
      setMessage(`OTP sent to ${formData.email}.`);
      setStep(2); // Move to OTP step
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
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
      await API.post("/users/register", {
        fullName: formData.fullName,
        email: formData.email,
      });
      setMessage("A new OTP has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
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
      setMessage("Email verified successfully! Please set your password.");
      setStep(3); // Move to the final step
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
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
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      // This is the only call that should create the user in the database.
      // It now includes the fullName.
      await API.post("/users/complete-registration", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
      });
      alert("Registration successful! You can now log in.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <div
        className="w-full max-w-md mx-auto mt-10 mb-10 bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex flex-col items-center p-8 md:p-10"
        style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      >
        <h2 className="text-[#222] font-semibold uppercase text-[24px] text-center mb-8 tracking-wide">{step === 1 ? 'Register' : step === 2 ? 'Verify Email' : 'Complete Registration'}</h2>
        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-5">
            <div>
              <label htmlFor="fullName" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your Full Name"
                required
                className={`w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !formData.fullName ? 'border-[#D32F2F]' : ''}`}
              />
              {error && !formData.fullName && <div className="text-[#D32F2F] text-xs mt-1">{error}</div>}
            </div>
            <div>
              <label htmlFor="email" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@college.com"
                required
                className={`w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !formData.email ? 'border-[#D32F2F]' : ''}`}
              />
              {error && !formData.email && <div className="text-[#D32F2F] text-xs mt-1">{error}</div>}
            </div>
            <button
              type="submit"
              disabled={isLoading || !formData.fullName || !formData.email}
              className={`w-full h-11 mt-2 rounded-[8px] bg-[#D32F2F] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {/* Step 2: OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-5">
            <div className="text-center text-[#222] text-[15px] mb-2">Enter the code sent to <span className="font-semibold">{formData.email}</span></div>
            <div>
              <label htmlFor="otp" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Verification Code</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="6-Digit Code"
                maxLength={6}
                className={`w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] text-center tracking-widest placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && otp.length < 6 ? 'border-[#D32F2F]' : ''}`}
              />
              {error && otp.length < 6 && <div className="text-[#D32F2F] text-xs mt-1">{error}</div>}
            </div>
            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className={`w-full h-11 mt-2 rounded-[8px] bg-[#D32F2F] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            <div className="text-center mt-2">
              <span className="text-[13px] text-[#222]">Didn't receive it? </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="font-semibold text-[#D32F2F] hover:underline disabled:opacity-60 text-[13px]"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}
        {/* Step 3: Password and Details Form */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="w-full flex flex-col gap-5">
            <div className="text-center text-green-600 text-[15px] mb-2">Email Verified Successfully!</div>
            <div>
              <label htmlFor="password" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className={`w-full h-11 px-4 pr-10 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !formData.password ? 'border-[#D32F2F]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
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
              {error && !formData.password && <div className="text-[#D32F2F] text-xs mt-1">{error}</div>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className={`w-full h-11 px-4 pr-10 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !formData.confirmPassword ? 'border-[#D32F2F]' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  )}
                </button>
              </div>
              {error && !formData.confirmPassword && <div className="text-[#D32F2F] text-xs mt-1">{error}</div>}
            </div>
            <div>
              <label htmlFor="studentId" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Student ID</label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="e.g. 12345678"
                required
                className={`w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !formData.studentId ? 'border-[#D32F2F]' : ''}`}
              />
              {error && !formData.studentId && <div className="text-[#D32F2F] text-xs mt-1">{error}</div>}
            </div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full h-11 mt-2 rounded-[8px] bg-[#D32F2F] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${isLoading || !isFormValid ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Completing...' : 'Complete Registration'}
            </button>
          </form>
        )}
        {/* --- Universal Messages/Errors --- */}
        {message && <div className="text-green-600 text-sm text-center mt-4">{message}</div>}
        {error && <div className="text-[#D32F2F] text-sm text-center mt-4">{error}</div>}
        <div className="mt-8 text-center">
          <span className="text-[#222] text-[14px]">Already have an account? </span>
          <a href="/login" className="text-[#D32F2F] font-semibold hover:underline text-[14px]">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
