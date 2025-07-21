import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State to hold login errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // 1. Make the real API call to your /login endpoint
      const response = await API.post("/users/login", { email, password });

      // 2. The response.data is the token string itself, based on your controller
      const token = response.data;

      if (token) {
        // 3. Since the user object isn't returned from /login,
        //    we create a placeholder. The token is the important part.
        const user = { email };
        login(user, token); // This saves the token via your AuthContext
        console.log('Login successful:', { user, token }); // Debug log
        // Remove navigate here, will move to useEffect
        // navigate("/dashboard");
      } else {
        // This case is unlikely if the request is successful, but good for safety
        setError("Login failed: An empty token was received.");
      }
    } catch (err) {
      // 5. Handle errors from the backend (e.g., invalid credentials)
      //    Axios stores the error response in err.response.data
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data || // For raw string error responses
        "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Add this useEffect to navigate after isLoggedIn is true
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <div className="w-full max-w-md mx-auto mt-10 mb-10 bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex flex-col items-center p-8 md:p-10" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <h2 className="text-[#222] font-semibold uppercase text-[24px] text-center mb-2 tracking-wide">Login</h2>
        <div className="text-center text-[#555] text-[15px] mb-8">Welcome back! Please login to continue.</div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {/* Error Display Block */}
          {error && (
            <div className="p-3 my-2 text-sm text-center text-[#D32F2F] bg-[#ffeaea] rounded-lg">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full h-11 px-4 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !email ? 'border-[#D32F2F]' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[14px] font-medium uppercase text-[#222] mb-2 tracking-wide">Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-11 px-4 pr-10 rounded-[8px] border border-[#ccc] bg-white text-[#222] text-[15px] placeholder-gray-400 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F] transition-all ${error && !password ? 'border-[#D32F2F]' : ''}`}
                required
              />
              {/* Optional: Eye icon for password toggle (not implemented for logic, just UI) */}
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1 mb-2">
            <div></div>
            <Link to="/forgot-password" className="text-[13px] text-[#D32F2F] font-medium hover:underline">Forgot password?</Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-11 mt-2 rounded-[8px] bg-[#D32F2F] text-white font-bold uppercase text-[16px] tracking-wide shadow transition-all duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
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
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-600">Or continue with</span>
            </div>
          </div>
        </div>
        {/* Social Login */}
        <div className="w-full mb-2">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
        {/* Sign Up Link */}
        <div className="text-center mt-8">
          <span className="text-[#222] text-[14px]">New to KharidoMat? </span>
          <Link to="/register" className="text-[#D32F2F] font-semibold hover:underline text-[14px]">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
