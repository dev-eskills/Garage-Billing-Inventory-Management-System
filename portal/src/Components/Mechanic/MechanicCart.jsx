import React from "react";
import { 
  ShoppingCart, 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  CreditCard, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MechanicCart = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeFromCart, 
  cartTotal, 
  isProcessing, 
  handleCheckout 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[60]"
          />
          
          {/* Cart Sidebar Overlay */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[384px] bg-white shadow-2xl z-[70] flex flex-col border-l border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-slate-400" />
                <h2 className="text-base font-semibold text-slate-800">Shopping Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 cursor-pointer hover:bg-slate-100 rounded-md transition text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <ShoppingCart size={32} className="mb-3" />
                  <p className="text-sm">Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 flex gap-3 group relative shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-md border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.part_name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-slate-200" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="pr-6">
                        <h4 className="text-xs font-medium text-slate-800 truncate">{item.part_name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">₹{item.sale_price} / unit</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1, item.stock_quantity)}
                            className="p-1 cursor-pointer hover:bg-slate-100 transition text-slate-500"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-[10px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1, item.stock_quantity)}
                            className="p-1 cursor-pointer hover:bg-slate-100 transition text-slate-500"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">₹{item.sale_price * item.quantity}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm">Total Amount</span>
                <span className="text-xl font-semibold text-slate-900 tracking-tight">₹{cartTotal.toLocaleString()}</span>
              </div>

              <button
                disabled={cart.length === 0 || isProcessing}
                onClick={handleCheckout}
                className="w-full py-3 cursor-pointer bg-slate-900 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all active:scale-[0.98]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Confirm Order
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-slate-400">
                <AlertCircle size={12} />
                <p className="text-[10px]">Orders will deduct stock immediately.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MechanicCart;
