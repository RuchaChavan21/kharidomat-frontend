import React from 'react';
import { motion } from 'framer-motion';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-200">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center">
          Create Your Account 🎓
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Sujal Samadiya"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email (College ID)</label>
            <input
              type="email"
              placeholder="202301040116@college.com"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              placeholder="e.g. 12345678"
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-800 transition duration-300"
          >
            Register
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
