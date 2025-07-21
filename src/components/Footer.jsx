import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="w-full bg-[#B9162C] text-white py-10 px-2 md:px-8 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">🎓</span>
            <span className="text-xl font-bold tracking-wide">KharidoMat</span>
          </div>
          <span className="text-sm">Rent Smart. Live Easy.</span>
        </div>
        <div>
          <div className="font-bold mb-2 uppercase">Campus Rentals</div>
          <ul className="space-y-1 text-sm">
            <li><Link to="/items" className="hover:underline">Furniture</Link></li>
            <li><Link to="/items" className="hover:underline">Electronics</Link></li>
            <li><Link to="/items" className="hover:underline">Appliances</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2 uppercase">Quick Links</div>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">FAQs</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><Link to="/about" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2 uppercase">Contact</div>
          <div className="text-sm mb-2">support@kharidomat.com</div>
          <div className="text-sm mb-4">+91 98765 43210</div>
          <div className="flex gap-3">
            <a href="#" className="hover:text-[#70C9B0]" aria-label="Instagram"><svg width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/><rect x="7" y="7" width="10" height="10" rx="3" fill="white"/><circle cx="12" cy="12" r="2" fill="#B9162C"/></svg></a>
            <a href="#" className="hover:text-[#70C9B0]" aria-label="LinkedIn"><svg width="24" height="24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" fill="none"/><rect x="7" y="10" width="2" height="6" fill="white"/><rect x="11" y="10" width="2" height="6" fill="white"/><circle cx="8" cy="8" r="1" fill="white"/></svg></a>
            <a href="#" className="hover:text-[#70C9B0]" aria-label="Mail"><svg width="24" height="24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" fill="none"/><path d="M6 8l6 5 6-5" stroke="white" strokeWidth="2" fill="none"/></svg></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-white/70 mt-8">&copy; 2025 KharidoMat. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
