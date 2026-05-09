import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, IndianRupee, Package, Loader2 } from 'lucide-react';

const ReturnPartsModal = ({ isOpen, onClose, onConfirm, purchase, isPending }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !purchase) return null;

    const unitPrice = Number(purchase.unit_price) || 0;
    const maxQuantity = Number(purchase.quantity) || 1;
    const totalLoss = quantity * unitPrice;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(quantity, totalLoss);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden z-50"
            >
                <div className="bg-red-50 p-6 border-b border-red-100 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 hover:bg-red-100 rounded-full transition-colors text-red-500"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 text-red-600 mb-2">
                        <AlertTriangle size={24} />
                        <h3 className="text-xl font-bold">Mark Defective Return</h3>
                    </div>
                    <p className="text-red-600/80 text-sm font-medium">
                        Record financial loss for defective parts from this purchase.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Part Name:</span>
                                <span className="text-gray-900 font-bold">{purchase.parts?.part_name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Vendor:</span>
                                <span className="text-gray-900 font-bold">{purchase.vendors?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Unit Price:</span>
                                <span className="text-gray-900 font-bold">₹{unitPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block ml-1">
                                Return Quantity (Max: {maxQuantity})
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Package size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    max={maxQuantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 0)))}
                                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-bold"
                                    required
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-red-50/50 rounded-lg border border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-700">
                                <IndianRupee size={18} />
                                <span className="font-bold">Total Loss Amount</span>
                            </div>
                            <span className="text-xl font-black text-red-700">
                                ₹{totalLoss.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                'Confirm Loss'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ReturnPartsModal;
