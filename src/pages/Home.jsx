import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300"></div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-mint-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Rent What You Need,
              <span className="block text-white/90">When You Need It</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with fellow students to rent textbooks, electronics, sports equipment, and more. 
              Save money, reduce waste, and build community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/items" className="bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                  Browse Items
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Start Renting
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CampusRent?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              The smart way to access what you need during your academic journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "\ud83d\udcb0",
                title: "Save Money",
                description: "Rent instead of buy and save hundreds on textbooks and equipment"
              },
              {
                icon: "\ud83c\udf31",
                title: "Eco-Friendly",
                description: "Reduce waste and promote sustainable consumption on campus"
              },
              {
                icon: "\ud83e\udd1d",
                title: "Build Community",
                description: "Connect with fellow students and build lasting relationships"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card p-8 text-center hover:transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 text-3xl shadow-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-accent-50 dark:from-gray-900 dark:to-blue-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Join thousands of students who are already saving money and building community
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Create Your Account
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
