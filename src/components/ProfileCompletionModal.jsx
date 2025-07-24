// src/components/ProfileCompletionModal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileCompletionModal = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white p-6 md:p-8 rounded-xl shadow-2xl text-center w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 animate-scale-in border-t-8 border-[#D32F2F]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3f3] mb-4">
            <svg className="h-10 w-10 text-[#D32F2F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        </div>

        {/* Content */}
        <h2 id="modal-title" className="text-2xl font-extrabold uppercase text-gray-800 mb-2">
          Complete Your Profile
        </h2>
        <p className="mb-6 text-gray-600">
          Add your details to unlock all features and enjoy a personalized experience.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/edit-profile"
            onClick={onClose} // Close modal on navigation
            className="w-full sm:w-auto bg-[#D32F2F] text-white font-bold uppercase px-6 py-3 rounded-lg shadow-md hover:bg-[#b71c1c] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D32F2F]"
          >
            Complete Now
          </Link>
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Simple animation style */}
        <style>{`
          @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;