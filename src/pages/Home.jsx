import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-white">
      <div className="text-center pt-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold text-purple-800"
        >
          Welcome to CampusRent 🎓
        </motion.h1>

        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Rent and lend anything — books, project kits, sports gear, calculators, and more!
          A student-friendly rental platform built for your campus.
        </p>

        <div className="mt-6">
          <a href="/items" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-800 transition duration-300">
            Browse Items
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
