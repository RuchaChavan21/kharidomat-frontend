import React, { useState, useEffect } from 'react';

// --- CHANGE 1: Add 'error' to the props being received ---
const ExtendBookingModal = ({ isOpen, onClose, onSubmit, currentEndDate, minDate, loading, error: parentError }) => {
  const [newEndDate, setNewEndDate] = useState(currentEndDate || '');
  const [localError, setLocalError] = useState(''); // Use a different name for local validation errors

  useEffect(() => {
    setNewEndDate(currentEndDate || '');
    setLocalError('');
  }, [currentEndDate, isOpen]);

  if (!isOpen) return null;

  const handleDateChange = (e) => {
    setNewEndDate(e.target.value);
    setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- CHANGE 2: Add a console log to see if this function runs ---
    console.log("Modal's handleSubmit function was called!");

    if (!newEndDate) {
      setLocalError('Please select a new end date.');
      return;
    }
    if (new Date(newEndDate) <= new Date(minDate)) {
      setLocalError('End date must be after the current end date.');
      return;
    }
    // If validation passes, call the parent function
    onSubmit(newEndDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border-2 border-[#D32F2F] transition-colors duration-300 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#D32F2F] transition-colors"
          aria-label="Close modal"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-2xl font-extrabold uppercase text-[#D32F2F] mb-4 text-center">Extend Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newEndDate" className="block text-sm font-semibold text-gray-700 mb-2">Select New End Date</label>
            <input
              id="newEndDate"
              type="date"
              value={newEndDate}
              min={minDate}
              onChange={handleDateChange}
              className="w-full p-3 border border-[#D32F2F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] transition-colors duration-200 bg-white text-gray-900"
              required
              disabled={loading}
            />
          </div>
          
          {/* --- CHANGE 3: Display BOTH local validation errors and parent API errors --- */}
          {(localError || parentError) && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center border border-red-300">
              {localError || parentError}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition-colors duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#D32F2F] text-white font-medium hover:bg-white hover:text-[#D32F2F] hover:border-[#D32F2F] border-2 border-[#D32F2F] transition-colors duration-200 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Extend & Pay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtendBookingModal;