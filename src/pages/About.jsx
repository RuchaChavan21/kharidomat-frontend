import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mint-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              About CampusRent
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
              Empowering students with convenience, affordability, and sustainability through the power of community sharing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/items" className="bg-white text-purple-600 hover:bg-gray-50 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                Start Renting
              </Link>
              <Link to="/register" className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Join Community
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6">
              Our Mission & Vision
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
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
              className="card p-8 lg:p-12"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700">
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
              className="card p-8 lg:p-12"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔮</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-4">
                  Our Vision
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                  To become the leading student community platform that transforms how students access resources, build connections, and contribute to a more sustainable future. We envision a world where every student has access to the tools they need to succeed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
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
                className="card p-8 text-center hover:transform hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6">
              Why Choose CampusRent?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Discover what makes us the preferred choice for students across campuses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              The passionate individuals behind CampusRent's mission
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="card p-8 text-center hover:transform hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6">
              What Students Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Real feedback from our community members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="card p-8 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start saving money, building connections, and contributing to a more sustainable future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-purple-600 hover:bg-gray-50 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                Get Started Today
              </Link>
              <Link to="/items" className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium text-lg px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Browse Items
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
