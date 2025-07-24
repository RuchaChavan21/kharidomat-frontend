import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'bg-red-600 hover:bg-red-700', }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border-2 border-[#D32F2F] transition-colors duration-300"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <h2 className="text-xl font-bold mb-3 text-[#D32F2F] text-center">{title}</h2>
            <p className="text-gray-700 mb-6 text-center">{message}</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-white font-medium ${confirmColor} transition-colors duration-200`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal; 