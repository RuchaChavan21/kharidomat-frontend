import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const teamMembers = [
    {
      name: 'Sujal Samadiya',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/150x150?text=SJ',
      bio: 'Former student who experienced the struggle of expensive textbooks firsthand.'
    },
    {
      name: 'Neha Narkhede',
      role: 'CTO',
      image: 'https://via.placeholder.com/150x150?text=NN',
      bio: 'Tech enthusiast passionate about building sustainable solutions for students.'
    },
    {
      name: 'Rucha Chavan',
      role: 'COO',
      image: 'https://via.placeholder.com/150x150?text=RC',
      bio: 'Dedicated to fostering meaningful connections within campus communities.'
    },
    {
      name: 'Krishna Tolani',
      role: 'CFO',
      image: 'https://via.placeholder.com/150x150?text=KT',
      bio: 'Passionate about financial empowerment and student success.'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Computer Science Student',
      content: 'CampusRent saved me over ₹5000 on textbooks this semester alone!',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      role: 'Engineering Student',
      content: 'The community is amazing. I\'ve made friends while saving money on equipment.',
      rating: 5
    },
    {
      name: 'David Kim',
      role: 'Business Student',
      content: 'Easy to use, reliable, and the customer support is exceptional.',
      rating: 5
    }
  ];

  const features = [
    {
      icon: '🔒',
      title: 'Secure & Trusted',
      description: 'Verified users and secure payment processing ensure safe transactions.'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book items instantly with our streamlined rental process.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access CampusRent anywhere with our responsive mobile app.'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock support team.'
    }
  ];

  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden transition-colors duration-300 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.h1 className="text-4xl sm:text-5xl font-bold font-display mb-6 text-white dark:text-white">
            About CampusRent
          </motion.h1>
          <motion.p className="text-lg sm:text-xl text-white/90 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            CampusRent is a student-driven platform for renting and lending textbooks, electronics, and more. Save money, reduce waste, and build community.
          </motion.p>
          <div className="flex flex-col items-center w-full sm:w-auto justify-center">
            <Link
              to="/items"
              className="font-medium text-lg px-8 py-4 rounded-xl w-full sm:w-auto transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                bg-white text-purple-700 border-2 border-purple-600 hover:bg-purple-50 hover:text-purple-800
                dark:bg-purple-700 dark:text-white dark:border-transparent dark:hover:bg-purple-800 dark:hover:text-white shadow-glow hover:shadow-glow-lg"
            >
              Start Renting
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Our Mission & Vision
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're building a sustainable future where students can access what they need, when they need it, without breaking the bank.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8 lg:p-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  To democratize access to educational resources by creating a trusted platform where students can share, rent, and access items they need for their academic journey. We believe that education should be accessible to everyone, regardless of their financial situation.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="card p-8 lg:p-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔮</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Our Vision
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  To become the leading student community platform that transforms how students access resources, build connections, and contribute to a more sustainable future. We envision a world where every student has access to the tools they need to succeed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              The principles that guide everything we do and every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤝",
                title: "Community First",
                description: "We believe in the power of community. Every feature we build, every decision we make, is centered around fostering meaningful connections and building trust within campus communities.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: "💰",
                title: "Accessibility",
                description: "Education should be accessible to everyone. We're committed to breaking down financial barriers and making quality resources available to students from all backgrounds.",
                color: "from-purple-400 to-purple-500"
              },
              {
                icon: "🌱",
                title: "Sustainability",
                description: "We're passionate about reducing waste and promoting responsible consumption. Every rental is a step toward a more sustainable future for our planet.",
                color: "from-purple-600 to-purple-700"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="card p-8 text-center hover:transform hover:scale-105 transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md dark:shadow-none border border-gray-100 dark:border-gray-700 rounded-lg transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-12 text-gray-900 dark:text-white">Why CampusRent?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 text-3xl shadow-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold font-display mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-12 text-gray-900 dark:text-white">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300"
              >
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-purple-200 dark:border-purple-700 shadow" />
                <h4 className="text-lg font-semibold font-display text-gray-900 dark:text-white mb-1">{member.name}</h4>
                <span className="text-purple-600 dark:text-purple-400 font-medium mb-2">{member.role}</span>
                <p className="text-gray-600 dark:text-gray-300 text-base">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-12 text-gray-900 dark:text-white">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-4">"{testimonial.content}"</p>
                <span className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-50 to-accent-50 dark:from-gray-900 dark:to-blue-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            Join thousands of students who are already saving money and building community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto">
              Get Started Today
            </Link>
            <Link to="/items" className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 w-full sm:w-auto">
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
