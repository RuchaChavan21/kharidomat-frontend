import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Browse Items', path: '/items' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800' 
          : 'bg-white dark:bg-gray-900 shadow-soft border-b border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Enhanced Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex flex-col items-start group">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <h1 className="text-xl sm:text-2xl font-bold text-purple-600 group-hover:scale-105 transition-transform duration-300">
                  CampusRent
                </h1>
              </div>
              <p className="text-xs text-gray-500 ml-8 -mt-1 tracking-wide font-medium">
                KharidoMat
              </p>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex items-center space-x-8"
          >
            {isLoggedIn && (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `font-medium text-base px-4 py-2 rounded-lg transition-colors duration-200 h-12 flex items-center justify-center ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-glow'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`
                    }
                  >
                    Dashboard
                  </NavLink>
                </motion.div>
                {/* Chat Tab - now styled like all other tabs */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      `font-medium text-base px-4 py-2 rounded-lg transition-colors duration-200 h-12 flex items-center justify-center ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-glow'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`
                    }
                  >
                    <span role="img" aria-label="Chat">💬</span>
                    <span className="hidden sm:inline">Chat</span>
                  </NavLink>
                </motion.div>
              </>
            )}
            {(!isLoggedIn ? [{ name: 'Home', path: '/' }, ...navItems] : navItems).map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium text-base px-4 py-2 rounded-lg transition-colors duration-200 h-12 flex items-center justify-center ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-glow'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`
                  }
                >
                  {item.name}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>

          {/* Auth Buttons & Profile Dropdown */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex items-center space-x-4"
          >
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors duration-300 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m8.485-8.485h-1.5m-15 0H3m15.364-6.364l-1.06 1.06m-12.728 0l-1.06-1.06m16.97 12.728l-1.06-1.06m-12.728 0l-1.06 1.06M12 7.5A4.5 4.5 0 1012 16.5 4.5 4.5 0 0012 7.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.64-7.64 6.37-9.175.512-.21 1.08-.03 1.387.453.306.482.18 1.12-.332 1.33A7.501 7.501 0 0012 19.5c2.485 0 4.675-1.21 6.025-3.067.34-.47 1.01-.57 1.41-.19.4.38.47 1.03.17 1.46z" />
                </svg>
              )}
            </button>
            {isLoggedIn ? (
              <>
                {/* Profile Dropdown */}
                <ProfileDropdown />
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/login" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/register" className="text-sm px-4 py-2 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300">
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
