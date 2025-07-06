import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Items', path: '/items' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/register' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">CampusRent</h1>
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'text-purple-700 font-semibold'
                    : 'text-gray-600'
                } hover:text-purple-900 transition duration-200`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
