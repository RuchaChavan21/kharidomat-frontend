import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ProfileCompletionModal from '../components/ProfileCompletionModal'; // Assuming this path is correct

// Import your actual local images from src/assets/ with precise filenames
import bikesImg from '../assets/scooty.jpg';
import deskImg from '../assets/desk.jpg';
import electronicsImg from '../assets/electronics.jpg';
import hostelAppliancesImg from '../assets/hostelappliances.jpg';
import hostelFurnitureImg from '../assets/hostelfurniture.jpg';
import laptopImg from '../assets/laptop.jpg';
import mattressesImg from '../assets/mattresses.jpg';
import miniFridgeImg from '../assets/minifridge.jpg';
import studyTablesAndChairImg from '../assets/studytablesandchair.jpg';
import cycleImg from '../assets/scooty.jpg';
import inductionImg from '../assets/induction.jpg';
import calculatorImg from '../assets/calculator.jpg';
import gamingImg from '../assets/gaming1.jpg';

// For hero section, using the new images
const heroSectionImages = [
  cycleImg,
  inductionImg,
  calculatorImg,
  gamingImg,
];

// Now use the imported variables for categoryImages with precise filenames
const categoryImages = [
  { title: 'Hostel Furniture', img: hostelFurnitureImg },
  { title: 'Study Tables & Chairs', img: studyTablesAndChairImg },
  { title: 'Electronics', img: electronicsImg },
  { title: 'Appliances for PG/Hostels', img: hostelAppliancesImg },
  { title: 'Mattresses', img: mattressesImg },
  { title: 'Bikes', img: bikesImg },
];

const Home = () => {
  const { theme } = useTheme();
  const { user, isLoggedIn } = useAuth(); // Added 'user' from useAuth
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State for the modal

  // useEffect to check for profile completion and show modal
  useEffect(() => {
    if (isLoggedIn && user) {
      // Adjust the condition based on your actual user schema fields
      const isProfileComplete = user.phone && user.address;
      const alreadyShown = sessionStorage.getItem("profileModalShown");

      if (!isProfileComplete && !alreadyShown) {
        setShowModal(true);
        sessionStorage.setItem("profileModalShown", "true");
      }
    }
  }, [isLoggedIn, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-neutral-100 text-gray-900 font-sans font-inter cursor-default">
      {/* Modal for Profile Completion */}
      {showModal && <ProfileCompletionModal onClose={() => setShowModal(false)} />}

      {/* Teal Offer Bar */}
      <div className="w-full bg-[#70C9B0] text-center py-2 text-sm font-semibold text-gray-900">
        GET FLAT 20% OFF ON EACH MONTH'S RENT <span className="font-bold text-[#D32F2F]">VIBE20</span> ! <a href="#" className="underline hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer">Click For More Offers!</a>
      </div>

      {/* Hero Banner with Background Video */}
      <section className="relative overflow-hidden min-h-[100vh] flex flex-col md:flex-row items-center justify-between">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ 
            filter: 'brightness(0.7) contrast(1.1)',
            objectPosition: 'center center'
          }}
        >
          <source src="/Kharidomat_is_a_202508121623.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col items-start justify-center px-6 md:px-16 py-12 md:py-24">
          <div className="flex items-center mb-6">
            <span className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mr-2 drop-shadow-2xl"></span>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight font-inter drop-shadow-2xl">
              FURNITURE, ELECTRONICS & APPLIANCES ON RENT FOR STUDENTS
            </h1>
            <span className="text-white text-4xl md:text-5xl lg:text-6xl font-bold ml-2 drop-shadow-2xl"></span>
          </div>
          <p className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-8 uppercase tracking-wide drop-shadow-lg">
            AFFORDABLE. FLEXIBLE. HASSLE-FREE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/items')}
              className="bg-white text-[#D32F2F] font-bold uppercase px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-2xl text-base md:text-lg tracking-wide border-2 border-white hover:bg-[#D32F2F] hover:text-white hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer w-full sm:w-auto backdrop-blur-sm bg-white/90"
            >
              Start Renting
            </button>
            <button
              onClick={() => navigate('/post-item')}
              className="bg-[#D32F2F] text-white font-bold uppercase px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-2xl text-base md:text-lg tracking-wide border-2 border-[#D32F2F] hover:bg-white hover:text-[#D32F2F] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer w-full sm:w-auto backdrop-blur-sm bg-[#D32F2F]/90"
            >
              Post your item
            </button>
          </div>
        </div>
        

      </section>
      {/* Category Section */}
      <section className="w-full bg-white pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl font-semibold text-gray-800 tracking-tight font-inter">Browse by Category</h2>
            <div className="mt-2 mb-2 h-[3px] w-[60px] bg-[#D32F2F] rounded-full" />
          </div>
          <div
            className="flex overflow-x-auto gap-6 px-4 md:px-8 scrollbar-hide"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              paddingLeft: 32, paddingRight: 32,
            }}
            tabIndex={0}
            aria-label="Browse by Category"
          >
            {categoryImages.map((cat, idx) => (
              <a
                key={cat.title}
                href={cat.targetLink || '#'}
                aria-label={`Browse ${cat.title}`}
                tabIndex={0}
                className="group focus:outline-[#D32F2F] rounded-2xl shadow-xl bg-white border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 cursor-pointer flex flex-col justify-end min-w-[260px] max-w-[320px] h-[160px] relative overflow-hidden mr-5"
                style={{
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  background: `url(${cat.img}) center/cover no-repeat`,
                  outline: 'none',
                }}
                onFocus={e => e.currentTarget.classList.add('ring-2', 'ring-[#D32F2F]')}
                onBlur={e => e.currentTarget.classList.remove('ring-2', 'ring-[#D32F2F]')}
              >
                <div className="absolute left-0 right-0 bottom-0 h-[40%] bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute left-4 bottom-4 z-20 text-white font-bold text-lg uppercase tracking-wide drop-shadow-lg">
                  {cat.title}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Trust/Safety Section */}
      <section className="w-full bg-gradient-to-br from-[#fff3f3] via-white to-[#fff3f3] py-14 px-2 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {icon:'🎓', title:'Verified Student Rentals', desc:'Rent safely within your campus — only verified students can rent or post items.'},
            {icon:'⚡', title:'Instant Bookings & Extensions', desc:'Book items instantly and extend your rental duration with ease.'},
            {icon:'🔒', title:'Secure Online Payments', desc:'Make secure, verified payments with Razorpay integration.'},
          ].map((item, i) => (
            <motion.div key={item.title} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-3 border border-[#D32F2F] hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
              <span className="text-4xl">{item.icon}</span>
              <span className="font-semibold text-lg uppercase text-[#D32F2F] tracking-wide">{item.title}</span>
              <span className="text-gray-600 text-sm text-center leading-relaxed">{item.desc}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* How It Works */}
      <section className="w-full bg-white py-20 px-2 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#D32F2F] text-center tracking-tight font-inter mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {icon: ( <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff3f3] border-2 border-[#D32F2F] mb-4"> <svg width="36" height="36" fill="none" stroke="#D32F2F" strokeWidth="2"><rect x="8" y="12" width="20" height="14" rx="3"/><rect x="12" y="8" width="12" height="6" rx="2"/></svg> </span> ), title: 'Select what you need', desc: 'Choose from a wide range of rental products.'},
              {icon: ( <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff3f3] border-2 border-[#D32F2F] mb-4"> <svg width="36" height="36" fill="none" stroke="#D32F2F" strokeWidth="2"><circle cx="18" cy="14" r="6"/><rect x="10" y="22" width="16" height="8" rx="4"/></svg> </span> ), title: 'Verify your ID', desc: 'Upload your campus/student ID for verification.'},
              {icon: ( <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff3f3] border-2 border-[#D32F2F] mb-4"> <svg width="36" height="36" fill="none" stroke="#D32F2F" strokeWidth="2"><rect x="8" y="16" width="20" height="12" rx="4"/><path d="M18 16v-4"/><circle cx="18" cy="8" r="2"/></svg> </span> ), title: 'Pay & Relax', desc: 'Complete payment and enjoy hassle-free delivery.'},
            ].map((step, i) => (
              <div key={step.title} className="bg-[#fff3f3] rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer">
                {step.icon}
                <div className="font-semibold text-xl uppercase text-gray-800 mb-2 tracking-wide font-inter">{step.title}</div>
                <div className="text-gray-500 text-base font-medium font-inter">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Promise Section */}
      <section className="w-full bg-gradient-to-br from-[#fff3f3] via-white to-[#fff3f3] py-14 px-2 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          {[
            {icon:'🔁', title:'OTP-Verified Returns', desc:'Return items securely using one-time password verification.'},
            {icon:'🧑‍🎓', title:'Listed by Students', desc:'All rentals are posted by verified college students only.'},
            {icon:'❤️', title:'Save to Wishlist', desc:'Add items to your wishlist and access them anytime.'},
            {icon:'📊', title:'Track Bookings', desc:'View, manage, cancel, or extend your bookings with ease.'}
          ].map((item, i) => (
            <motion.div 
              key={item.title} 
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 border border-[#D32F2F] hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="text-4xl">{item.icon}</span>
              <span className="font-semibold text-lg uppercase text-[#D32F2F] tracking-wide text-center">{item.title}</span>
              <span className="text-gray-600 text-sm text-center leading-relaxed">{item.desc}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;