import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Items', path: '/items' }, // Will remain here for data structure
  { name: 'My Bookings', path: '/my-bookings' },
  { name: 'Contact', path: '/about' },
];

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cartCount] = useState(0); // TODO: Replace with real cart count if available
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = React.useRef();

  useEffect(() => {
    setMobileOpen(false); // Close mobile menu on route change
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers for protected navigation (still useful if direct clicks skip NavLink logic, though less common now)
  const handleProtectedNav = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  // Close search dropdown on outside click or Escape
  useEffect(() => {
    if (!showSearch) return;
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setShowSearch(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showSearch]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-none'}`} style={{ fontFamily: 'inherit' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none" onClick={() => setMobileOpen(v => !v)} aria-label="Open menu">
              <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2"><path d="M4 7h20M4 14h20M4 21h20" strokeLinecap="round"/></svg>
            </button>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎓</span>
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#222] group-hover:text-[#D32F2F] transition-colors duration-200">KharidoMat</span>
            </Link>
          </div>
          {/* Center: Nav Links */}
          <div className="hidden md:flex gap-2 lg:gap-6 mx-auto">
            {/* NavLink for Home */}
            <NavLink
              key="Home"
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`
              }
              end
            >
              Home
            </NavLink>

            {/* NavLink for Items - Changed from button to NavLink */}
            <NavLink
              key="Items" // Using key for consistency
              to="/items"
              className={({ isActive }) =>
                `px-3 py-2 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`
              }
            >
              Items
            </NavLink>

            {/* NavLink for My Bookings */}
            <NavLink
              key="My Bookings"
              to="/my-bookings"
              className={({ isActive }) =>
                `px-3 py-2 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`
              }
            >
              My Bookings
            </NavLink>
            {/* NavLink for Contact (now '/about' based on your previous code) */}
            <NavLink
              key="Contact"
              to="/about" // Assuming '/about' is the correct path for Contact page
              className={({ isActive }) =>
                `px-3 py-2 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`
              }
            >
              Contact
            </NavLink>
          </div>
          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            {/* Profile/Account */}
            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222]" title="Account">
                <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="13" cy="9" r="4.5"/><path d="M4 22c0-3.5 4.5-5 9-5s9 1.5 9 5"/></svg>
              </Link>
            )}
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(v => !v)}
                className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222] focus:outline-none"
                title="Search"
                aria-label="Open search bar"
              >
                <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="12" cy="12" r="8"/><path d="M20 20l-3-3"/></svg>
              </button>
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    ref={searchRef}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Search for items..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Wishlist */}
            <button
              onClick={() => handleProtectedNav('/wishlist')} // Using handleProtectedNav for wishlist
              className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222] focus:outline-none"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col p-6 gap-6"
          >
            <button className="self-end mb-4 p-2 rounded hover:bg-[#fff3f3]" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg width="28" height="28" fill="none" stroke="#D32F2F" strokeWidth="2"><path d="M6 6l16 16M22 6L6 22" strokeLinecap="round"/></svg>
            </button>
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded font-bold uppercase tracking-wide text-base transition-colors duration-150 ${isActive ? 'text-[#D32F2F] underline underline-offset-8' : 'text-[#222] hover:text-[#D32F2F] hover:bg-[#fff3f3]'}`
                }
                end={link.path === '/'}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex gap-4 mt-8">
              {/* Mobile version of icons - ensure consistency with desktop if possible */}
              {isLoggedIn ? (
                <ProfileDropdown /> // Or a simplified mobile profile link
              ) : (
                <Link to="/login" className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222]" title="Account">
                  <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="13" cy="9" r="4.5"/><path d="M4 22c0-3.5 4.5-5 9-5s9 1.5 9 5"/></svg>
                </Link>
              )}
              {/* Search button in mobile menu */}
              <button
                onClick={() => { setShowSearch(true); setMobileOpen(false); }} // Open search and close mobile menu
                className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222] focus:outline-none"
                title="Search"
                aria-label="Open search bar"
              >
                <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><circle cx="12" cy="12" r="8"/><path d="M20 20l-3-3"/></svg>
              </button>
              <Link to="/wishlist" className="p-2 rounded-full hover:bg-[#fff3f3] text-[#222]" title="Wishlist">
                <svg width="26" height="26" fill="none" stroke="#222" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;