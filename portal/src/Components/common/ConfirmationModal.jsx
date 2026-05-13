import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X as XIcon, Loader2 } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
  isLoading = false
}) => {
  const themes = {
    danger: {
      icon: <AlertTriangle className="text-red-500" size={24} />,
      bg: "bg-red-50",
      button: "bg-red-600 hover:bg-red-700 shadow-red-100",
      accent: "border-red-100"
    },
    warning: {
      icon: <AlertTriangle className="text-amber-500" size={24} />,
      bg: "bg-amber-50",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-100",
      accent: "border-amber-100"
    },
    info: {
      icon: <AlertTriangle className="text-blue-500" size={24} />,
      bg: "bg-blue-50",
      button: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
      accent: "border-blue-100"
    }
  };

  const theme = themes[type] || themes.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-md shadow-2xl overflow-hidden z-10"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-md ${theme.bg} flex items-center justify-center shrink-0`}>
                  {theme.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">{title}</h4>
                  <p className="text-sm text-gray-500 font-medium mt-1">{message}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-6 py-2 text-sm font-bold text-white rounded-md transition-all shadow-md hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:opacity-50 ${theme.button}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    confirmText
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

export default ConfirmationModal;
