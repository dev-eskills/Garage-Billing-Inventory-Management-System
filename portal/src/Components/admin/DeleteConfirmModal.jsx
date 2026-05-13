import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isPending = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isPending ? onClose : undefined}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-md shadow-2xl overflow-hidden z-[101]"
          >
            <button
              type="button"
              onClick={!isPending ? onClose : undefined}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600 cursor-pointer z-10"
              disabled={isPending}
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border-4 border-red-100">
                  <AlertTriangle size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-md font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isPending}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Item'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
