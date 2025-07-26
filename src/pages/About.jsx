import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import heroImg from '../assets/mitaoe.jpg'; // Ensure this path is correct or replace with a generic placeholder

const infoCards = [
  {
    title: '🎯 Our Mission',
    desc: 'To democratize access to educational resources by creating a trusted platform where students can share, rent, and access items they need for their academic journey.'
  },
  {
    title: '🔁 How It Works',
    desc: (
      <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-medium">
        <li><span className="font-bold text-[#222]">Post:</span> List your items for rent</li>
        <li><span className="font-bold text-[#222]">Rent:</span> Browse and book what you need</li>
        <li><span className="font-bold text-[#222]">Return:</span> Easy, flexible returns</li>
      </ul>
    )
  },
  {
    title: '⭐ Why Choose CampusRent',
    desc: (
      <ul className="list-disc list-inside space-y-1 text-base text-gray-700 font-medium">
        <li>Affordable for students</li>
        <li>Trustworthy & secure</li>
        <li>Student-friendly support</li>
      </ul>
    )
  }
];

const About = () => {
  // Removed teamMembers data as the section is being removed
  // Removed testimonials data as the section is being removed

  const features = [
    {
      icon: '🔒',
      title: 'Secure & Trusted',
      description: 'Verified student users and secure payment processing ensure safe peer-to-peer transactions.'
    },
    {
      icon: '🤝',
      title: 'Peer-to-Peer Rentals',
      description: 'Rent from fellow students and list your own items to earn money in our trusted campus community.'
    },
    {
      icon: '📊',
      title: 'All-in-One Dashboard',
      description: 'Manage your bookings, listings, payments, and wishlists all in one convenient place.'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Streamlined and easy process for renting items instantly with just a few clicks.'
    }
  ];

  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* About Hero Section */}
      <section className="relative overflow-hidden bg-[#D32F2F] min-h-[400px] flex items-center" style={{clipPath:'polygon(0 0, 100% 0, 100% 90%, 0 100%)'}}>
        {/* Left Triangle Graphics - Reusing Home page style */}
        <div className="absolute left-0 top-0 h-full w-1/3 hidden md:block z-0">
          <svg width="100%" height="100%" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 300,0 0,400" fill="#b71c1c"/>
            <g opacity="0.7">
              <polygon points="0,0 60,0 0,80" fill="#fff"/>
              <polygon points="30,100 90,60 60,180" fill="#fff"/>
              <polygon points="80,200 120,120 0,220" fill="#fff"/>
            </g>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24 z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center md:text-left md:ml-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 leading-tight tracking-wide">
              About KharidoMat
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              CampusRent is a student-driven platform for renting and lending furniture, electronics, and appliances. We make campus life affordable, flexible, and hassle-free.
            </p>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <img
              src={heroImg || 'https://via.placeholder.com/400x250?text=CampusRent+Community'}
              alt="CampusRent Community"
              className="rounded-xl shadow-lg border-4 border-white object-cover w-full max-w-sm h-60 md:h-72"
            />
          </motion.div>
          </div>
      </section>

      {/* Info Cards Section - Reusing home page trust section style */}
      <section className="w-full bg-[#fff3f3] py-10 px-2 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {infoCards.map((card, idx) => (
            <motion.div
              key={card.title}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-3 border-2 border-[#D32F2F] hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <span className="text-4xl mb-2">{card.title.split(' ')[0]}</span> {/* Displays emoji */}
              <span className="font-bold text-lg uppercase text-[#D32F2F]">{card.title.substring(card.title.indexOf(' ') + 1)}</span> {/* Displays text after emoji */}
              <div className="text-base text-gray-700 font-medium leading-relaxed">{card.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Section - Retaining existing structure but with new colors */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display text-[#D32F2F] mb-6 tracking-wide">
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
              className="bg-[#fff3f3] text-gray-900 shadow-lg border-2 border-[#D32F2F] rounded-xl p-8 lg:p-12 transition-colors duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#D32F2F]">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#D32F2F] mb-4 tracking-wide">
                  Our Mission
                </h3>
                                <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                  To make college life more affordable by empowering students to easily rent necessary items like books, electronics, and academic tools directly from their peers. We reduce financial stress by creating a trusted platform where students can access what they need without the burden of purchasing everything new.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#fff3f3] text-gray-900 shadow-lg border-2 border-[#D32F2F] rounded-xl p-8 lg:p-12 transition-colors duration-300 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-[#D32F2F]">
                  <span className="text-3xl">🔮</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase font-display text-[#D32F2F] mb-4 tracking-wide">
                  Our Vision
                </h3>
                                <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                  To build a sustainable and connected campus community where students share resources instead of buying new. We envision a future that reduces waste and ensures every student has access to the tools they need to succeed, creating a more collaborative and environmentally conscious academic environment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* Features Section - Renamed to "Why KharidoMat?" and adapted card style */}
      <section className="w-full bg-white py-16 md:py-24 px-2 md:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display text-center mb-12 text-[#D32F2F] tracking-wide">Why KharidoMat?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Adjusted grid for 4 features */}
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="bg-[#fff3f3] rounded-xl shadow-lg p-8 flex flex-col items-center text-center border-2 border-[#D32F2F] transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-3xl shadow-md bg-white text-[#D32F2F] border-2 border-[#D32F2F]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-extrabold uppercase font-display mb-2 text-[#D32F2F] tracking-wide">{feature.title}</h3>
                <p className="text-gray-700 text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Using home page button style */}
      <section className="py-16 md:py-24 bg-[#D32F2F] text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display mb-4 tracking-wide">Ready to Get Started?</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of students who are already saving money and building community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/register" className="bg-white text-[#D32F2F] font-bold text-lg px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-white hover:bg-[#D32F2F] hover:text-white hover:border-white transition-all duration-200">
              Get Started Today
            </Link>
            <Link to="/items" className="bg-white text-[#D32F2F] font-bold text-lg px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-white hover:bg-[#D32F2F] hover:text-white hover:border-white transition-all duration-200">
              Browse Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;