import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import ProfileCompletionPopup from "../components/ProfileCompletionModal"; // Update the path if needed

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State to hold login errors
  const [showProfilePopup, setShowProfilePopup] = useState(false);


  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await API.post("/users/login", { email, password });
    const token = response.data;

    if (token) {
      const placeholderUser = { email }; // Keeps your structure safe
      await login(placeholderUser, token); // Will fetch full user data
      console.log('Login successful:', { token });
    } else {
      setError("Login failed: An empty token was received.");
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data ||
      "Login failed. Please check your credentials.";
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  const handleGoogleSignIn = () => {
    // Redirect to your backend's Google OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Navigate to home or dashboard after successful login
    }
  }, [isLoggedIn, navigate]);
  

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

      {/* Right Half – Login Box */}
      <div className="md:w-1/2 w-full flex items-center justify-center px-4 py-20 md:py-0 bg-white" style={{ paddingTop: '120px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border-2 border-[#D32F2F] flex flex-col items-center p-8 md:p-10"
        >
        <h2 className="text-[#D32F2F] font-extrabold uppercase text-3xl text-center mb-3 tracking-wide">Login</h2>
        <p className="text-gray-700 text-lg text-center mb-8 font-medium">Welcome back! Please login to continue.</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* Error Display Block */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 my-2 text-base text-center text-red-700 bg-red-100 rounded-lg border border-red-300"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !email ? 'border-red-500' : ''}`}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold uppercase text-[#222] mb-2 tracking-wide">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-11 px-4 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder-gray-500 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all duration-200 ${error && !password ? 'border-red-500' : ''}`}
                required
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.673.124 2.458.35M18.825 13.875A10.05 10.05 0 0119 12c0-4.478-2.943-8.268-7-9.542C7.943 3.732 5 7.523 5 12c0 4.477 2.943 8.268 7 9.542m0-11.082a3 3 0 11-5.858 2.558M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end mt-1 mb-2">
            <Link to="/forgot-password" className="text-sm text-[#D32F2F] font-semibold hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 rounded-lg bg-[#D32F2F] text-white font-bold uppercase text-lg tracking-wide shadow-md transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-2 focus:ring-offset-white ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 w-full">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600 font-medium">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Social Login */}
        <div className="w-full mb-2">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md font-semibold text-base"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <span className="text-gray-700 text-base font-medium">New to KharidoMat? </span>
          <Link to="/register" className="text-[#D32F2F] font-bold hover:underline text-base">Register</Link>
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;