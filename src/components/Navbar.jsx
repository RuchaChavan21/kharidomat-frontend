import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Browse Items', path: '/items' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-soft border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Enhanced Brand */}
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`nav-link ${
                  location.pathname === '/dashboard' ? 'active' : ''
                } text-gray-700 hover:text-purple-600`}
              >
                Dashboard
              </Link>
            )}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                } text-gray-700 hover:text-purple-600`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/items/add" className="text-sm px-4 py-2 rounded-xl font-medium bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 transition-all duration-300">
                  Post Item
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="text-sm px-4 py-2 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
