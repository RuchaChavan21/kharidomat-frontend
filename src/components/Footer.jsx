import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top after navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#D32F2F] text-white py-10 px-2 md:px-8 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section - Logo & Tagline */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">🎓</span>
            <span className="text-xl font-bold tracking-wide">KharidoMat</span>
          </div>
          <span className="text-sm">Rent Smart. Live Easy.</span>
        </div>

        {/* Center Section - Features */}
        <div>
          <div className="font-semibold uppercase text-sm mb-4">Features</div>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-red-200 cursor-pointer">OTP-Verified Returns</span></li>
            <li><span className="hover:text-red-200 cursor-pointer">Wishlist</span></li>
            <li><span className="hover:text-red-200 cursor-pointer">Track Bookings</span></li>
            <li><span className="hover:text-red-200 cursor-pointer">Posted by Students</span></li>
          </ul>
        </div>

        {/* Right Section - Quick Links */}
        <div>
          <div className="font-semibold uppercase text-sm mb-4">Quick Links</div>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => handleNavigation('/')} className="hover:text-red-200 hover:underline text-left">Home</button></li>
            <li><button onClick={() => handleNavigation('/items')} className="hover:text-red-200 hover:underline text-left">Items</button></li>
            <li><button onClick={() => handleNavigation('/my-bookings')} className="hover:text-red-200 hover:underline text-left">My Bookings</button></li>
            <li><button onClick={() => handleNavigation('/about')} className="hover:text-red-200 hover:underline text-left">About</button></li>
          </ul>
        </div>

        {/* Far-Right Section - Contact Info */}
        <div>
          <div className="font-semibold uppercase text-sm mb-4">Contact</div>
          <div className="space-y-2 text-sm">
            <a href="mailto:support@kharidomat.com" className="block hover:text-red-200 hover:underline">
              support@kharidomat.com
            </a>
            <a href="tel:+919876543210" className="block hover:text-red-200 hover:underline">
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom - Copyright */}
      <div className="text-center text-xs text-white/70 mt-8">
        © 2025 KharidoMat. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

