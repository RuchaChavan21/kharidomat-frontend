import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

// Placeholder images for carousel and hero (replace with real assets as needed)
const categoryImages = [
  { title: 'Hostel Furniture', img: 'https://via.placeholder.com/200x120?text=Furniture' },
  { title: 'Study Tables & Chairs', img: 'https://via.placeholder.com/200x120?text=Study+Table' },
  { title: 'Electronics', img: 'https://via.placeholder.com/200x120?text=Electronics' },
  { title: 'Appliances for PG/Hostels', img: 'https://via.placeholder.com/200x120?text=Appliances' },
  { title: 'Mattresses', img: 'https://via.placeholder.com/200x120?text=Mattress' },
  { title: 'Bikes', img: 'https://via.placeholder.com/200x120?text=Bike' },
];
const heroImages = [
  'https://via.placeholder.com/180x120?text=Desk',
  'https://via.placeholder.com/120x120?text=Mini+Fridge',
  'https://via.placeholder.com/120x120?text=Bean+Bag',
  'https://via.placeholder.com/120x120?text=Laptop',
];

const Home = () => {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleStartRenting = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate('/post-item');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar (moved to Navbar.jsx, so not duplicated here) */}
      {/* Teal Offer Bar */}
      <div className="w-full bg-[#70C9B0] text-center py-2 text-sm font-semibold text-gray-900">
        GET FLAT 20% OFF ON EACH MONTH'S RENT <span className="font-bold text-[#D32F2F]">VIBE20</span> ! <a href="#" className="underline hover:text-[#D32F2F]">Click For More Offers!</a>
      </div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[540px] flex flex-col md:flex-row items-center justify-between bg-[#D32F2F]" style={{clipPath:'polygon(0 0, 100% 0, 100% 85%, 0 100%)'}}>
        {/* Left Triangle Graphics */}
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
        {/* Right Square Graphics */}
        <div className="absolute right-0 top-0 h-full w-1/2 hidden md:block z-0">
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#fff" strokeWidth="3">
              <rect x="40" y="40" width="40" height="40"/>
              <rect x="120" y="100" width="30" height="30"/>
              <rect x="200" y="60" width="50" height="50"/>
              <rect x="300" y="200" width="40" height="40"/>
              <rect x="350" y="300" width="30" height="30"/>
            </g>
          </svg>
        </div>
        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-6 md:px-16 py-12 md:py-24">
          <div className="flex items-center mb-4">
            <span className="text-white text-5xl font-bold mr-2">“</span>
            <h1 className="text-white text-2xl md:text-4xl font-extrabold uppercase leading-tight tracking-wide">
              FURNITURE, ELECTRONICS & APPLIANCES ON RENT FOR STUDENTS
            </h1>
            <span className="text-white text-5xl font-bold ml-2">”</span>
          </div>
          <p className="text-white text-lg md:text-2xl font-semibold mb-6 uppercase tracking-wide">AFFORDABLE. FLEXIBLE. HASSLE-FREE.</p>
          <button
            onClick={handleStartRenting}
            className="bg-white text-[#D32F2F] font-bold px-8 py-4 rounded-lg shadow-lg text-lg uppercase border-2 border-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition-all duration-200"
          >
                  Start Renting
          </button>
            </div>
        {/* Hero Images (layered) */}
        <div className="relative z-10 flex-1 flex items-end justify-center md:justify-end gap-4 px-6 md:px-16 py-8 md:py-24">
          {heroImages.map((img, i) => (
            <motion.img
              key={img}
              src={img}
              alt="Product"
              className={`rounded-xl shadow-lg border-4 border-white w-32 h-24 object-cover ${i!==0?'ml-[-24px]':''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              style={{zIndex: 10-i}}
            />
          ))}
        </div>
      </section>
      {/* Category Carousel */}
      {/* CATEGORY SECTION (Rentickle style) */}
      <section className="w-full bg-white pt-12 pb-12 md:pt-16 md:pb-16" style={{marginTop:48, marginBottom:48}}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Title */}
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-[#222] font-extrabold uppercase text-[20px] md:text-[24px] tracking-wide text-center font-sans">Browse by Category</h2>
            <div className="mt-2 mb-2 h-[2px] w-[60px] bg-[#D32F2F] rounded-full" />
          </div>
          {/* Horizontal Card Slider */}
          <div
            className="flex overflow-x-auto gap-5 md:gap-6 px-4 md:px-8 scrollbar-hide"
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
                className="group focus:outline-[#D32F2F]"
                style={{
                  minWidth: 260, maxWidth: 320, height: 160,
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                  borderRadius: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
                  background: `url(${cat.img}) center/cover no-repeat`,
                  position: 'relative',
                  overflow: 'hidden',
                  marginRight: idx === categoryImages.length - 1 ? 0 : 20,
                  outline: 'none',
                  transition: 'transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s cubic-bezier(.4,0,.2,1)',
                }}
                onFocus={e => e.currentTarget.classList.add('ring-2', 'ring-[#D32F2F]')}
                onBlur={e => e.currentTarget.classList.remove('ring-2', 'ring-[#D32F2F]')}
              >
                {/* Overlay gradient */}
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0, bottom: 0,
                  height: '40%',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.0) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }} />
                {/* Title */}
                <div style={{
                  position: 'absolute',
                  left: 16, bottom: 16, zIndex: 2,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 18,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}>
                  {cat.title}
                </div>
                {/* Hover effect */}
                <style>{`
                  a.group:hover, a.group:focus {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 8px 24px rgba(211,47,47,0.18);
                  }
                  .scrollbar-hide::-webkit-scrollbar { display: none; }
                  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Trust/Safety Section */}
      <section className="w-full bg-[#fff3f3] py-10 px-2 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {icon:'🔒', title:'Zero Deposit for Students'},
            {icon:'🧴', title:'Sanitized & Safe Delivery'},
            {icon:'🔄', title:'Easy Return'},
          ].map((item, i) => (
            <motion.div key={item.title} className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-3 border-2 border-[#D32F2F] hover:shadow-lg transition-all duration-200" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
              <span className="text-4xl">{item.icon}</span>
              <span className="font-bold text-lg uppercase text-[#D32F2F]">{item.title}</span>
        </motion.div>
          ))}
        </div>
      </section>
      {/* How It Works */}
      <section className="w-full bg-white py-16 px-2 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase mb-10 text-[#D32F2F] text-center tracking-tight">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff3f3] border-2 border-[#D32F2F] mb-4">
                  <svg width="36" height="36" fill="none" stroke="#D32F2F" strokeWidth="2"><rect x="8" y="12" width="20" height="14" rx="3"/><rect x="12" y="8" width="12" height="6" rx="2"/></svg>
                </span>
              ), title: 'Select what you need', desc: 'Choose from a wide range of rental products.'},
              {icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff3f3] border-2 border-[#D32F2F] mb-4">
                  <svg width="36" height="36" fill="none" stroke="#D32F2F" strokeWidth="2"><circle cx="18" cy="14" r="6"/><rect x="10" y="22" width="16" height="8" rx="4"/></svg>
                </span>
              ), title: 'Verify your ID', desc: 'Upload your campus/student ID for verification.'},
              {icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff3f3] border-2 border-[#D32F2F] mb-4">
                  <svg width="36" height="36" fill="none" stroke="#D32F2F" strokeWidth="2"><rect x="8" y="16" width="20" height="12" rx="4"/><path d="M18 16v-4"/><circle cx="18" cy="8" r="2"/></svg>
                </span>
              ), title: 'Pay & Relax', desc: 'Complete payment and enjoy hassle-free delivery.'},
            ].map((step, i) => (
              <div key={step.title} className="bg-[#fff3f3] rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                {step.icon}
                <div className="font-extrabold text-lg md:text-xl uppercase text-[#222] mb-2 tracking-wide">{step.title}</div>
                <div className="text-gray-600 text-base font-medium">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Promise Section */}
      <section className="w-full bg-[#fff3f3] py-10 px-2 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            {icon:'🔁', title:'Flexible Return'},
            {icon:'✅', title:'Verified Products'},
            {icon:'🤝', title:'Student Support'},
          ].map((item, i) => (
            <motion.div key={item.title} className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center gap-3 border-2 border-[#D32F2F] hover:shadow-lg transition-all duration-200" initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
              <span className="text-4xl">{item.icon}</span>
              <span className="font-bold text-lg uppercase text-[#D32F2F]">{item.title}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Testimonials */}
      <section className="w-full bg-white py-12 px-2 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8 text-[#D32F2F] text-center">What Students Say</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {[
              {name:'Amit S.', college:'IIT Bombay', img:'https://randomuser.me/api/portraits/men/32.jpg', text:'KharidoMat made my hostel life so much easier! Fast delivery and no deposit.'},
              {name:'Priya R.', college:'BITS Pilani', img:'https://randomuser.me/api/portraits/women/44.jpg', text:'Loved the sanitized products and easy returns. Highly recommended!'},
              {name:'Rahul T.', college:'VIT Vellore', img:'https://randomuser.me/api/portraits/men/54.jpg', text:'Affordable and flexible rental plans for students.'},
            ].map((review, i) => (
              <motion.div key={review.name} className="bg-[#fff3f3] rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 border-2 border-[#D32F2F] max-w-xs w-full relative" initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.2}}>
                <span className="absolute left-4 top-4 text-4xl text-[#D32F2F]">“</span>
                <img src={review.img} alt={review.name} className="w-16 h-16 rounded-full border-4 border-white shadow-md mb-2" />
                <p className="text-gray-800 font-medium text-base text-center">{review.text}</p>
                <div className="mt-2 text-sm text-[#D32F2F] font-bold">{review.name}</div>
                <div className="text-xs text-gray-500">{review.college}</div>
                <span className="absolute right-4 bottom-4 text-4xl text-[#D32F2F]">”</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
