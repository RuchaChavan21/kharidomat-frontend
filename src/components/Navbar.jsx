import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

// Define the core navigation links
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Items', path: '/items' },
  { name: 'My Bookings', path: '/my-bookings', protected: true },
  { name: 'Contact', path: '/about' },
];

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    setMobileOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedNav = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!showSearch) return;
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [showSearch]);

  // Filter links based on login status for the mobile menu
  const accessibleNavLinks = navLinks.filter(link => !link.protected || isLoggedIn);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-none'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none" onClick={() => setMobileOpen(v => !v)} aria-label="Open menu">
              <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2"><path d="M4 7h20M4 14h20M4 21h20" strokeLinecap="round" /></svg>
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎓</span>
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#222] group-hover:text-[#D32F2F] transition-colors duration-200">KharidoMat</span>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex gap-2 lg:gap-6 mx-auto">
            {navLinks.map(link => {
              if (link.protected && !isLoggedIn) return null;
              return (
                <NavLink key={link.name} to={link.path} className={({ isActive }) => `px-3 py-2 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`} end={link.path === '/'}>
                  {link.name}
                </NavLink>
              );
            })}

            {/* --- "VERIFY RETURNS" LINK FOR DESKTOP --- */}
            {isLoggedIn && (
              <NavLink to="/verify-returns" className={({ isActive }) => `px-3 py-2 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`}>
                Verify Returns
              </NavLink>
            )}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222]" title="Account">
                <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="13" cy="9" r="4.5" /><path d="M4 22c0-3.5 4.5-5 9-5s9 1.5 9 5" /></svg>
              </Link>
            )}
            <div className="relative">
              <button onClick={() => setShowSearch(v => !v)} className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222] focus:outline-none" title="Search" aria-label="Open search bar">
                <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="12" cy="12" r="8" /><path d="M20 20l-3-3" /></svg>
              </button>
              <AnimatePresence>
                {showSearch && (
                  <motion.div ref={searchRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2">
                    <input type="text" placeholder="Search for items..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D32F2F]" autoFocus />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => handleProtectedNav('/wishlist')} className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222] focus:outline-none" title="Wishlist" aria-label="Wishlist">
              <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.25 }} className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col p-6 gap-6">
            <button className="self-end mb-4 p-2 rounded hover:bg-[#fff3f3]" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg width="28" height="28" fill="none" stroke="#D32F2F" strokeWidth="2"><path d="M6 6l16 16M22 6L6 22" strokeLinecap="round" /></svg>
            </button>

            {accessibleNavLinks.map(link => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => `block px-3 py-3 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`} end={link.path === '/'}>
                {link.name}
              </NavLink>
            ))}

            {/* --- "VERIFY RETURNS" LINK FOR MOBILE --- */}
            {isLoggedIn && (
              <NavLink to="/verify-returns" className={({ isActive }) => `block px-3 py-3 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`}>
                Verify Returns
              </NavLink>
            )}

            <div className="flex gap-4 mt-8">
              {isLoggedIn ? (
                <ProfileDropdown />
              ) : (
                <Link to="/login" className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222]" title="Account">
                  <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="13" cy="9" r="4.5" /><path d="M4 22c0-3.5 4.5-5 9-5s9 1.5 9 5" /></svg>
                </Link>
              )}
              {/* ... other mobile icons */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;