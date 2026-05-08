import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, User, Package, Hash, DollarSign, Calendar, ShieldCheck, Loader2, IndianRupee } from 'lucide-react';
import { useAdminVendor } from '../../hooks/useAdminVendor';
import { useAdminPurchase } from '../../hooks/useAdminPurchase';
import { usePartsByVendor } from '../../hooks/useParts';

const AddPurchaseModal = ({ onClose }) => {
  const { vendors } = useAdminVendor();
  const { addPurchase, addPurchasePending } = useAdminPurchase();

  const [formData, setFormData] = useState({
    vendor_id: '',
    part_id: '',
    quantity: 1,
    payment_status: 'Pending',
    purchase_date: new Date().toISOString().split('T')[0],
  });

  // Fetch parts dynamically when vendor is selected
  const { data: vendorParts, isLoading: partsLoading } = usePartsByVendor(formData.vendor_id);

  // Calculate total amount automatically
  const selectedPart = vendorParts?.find(p => p.id === formData.part_id);
  const totalAmount = useMemo(() => {
    if (!selectedPart) return 0;
    return (selectedPart.unit_price || 0) * formData.quantity;
  }, [selectedPart, formData.quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Reset part selection if vendor changes
      if (name === 'vendor_id') {
        newData.part_id = '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendor_id || !formData.part_id) return;

    try {
      await addPurchase({
        vendor_id: formData.vendor_id,
        total_amount: totalAmount,
        purchase_date: formData.purchase_date,
        payment_status: formData.payment_status,
        quantity: formData.quantity || 1,
        part_id: formData.part_id,
      });
      onClose();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
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
        className="relative bg-white w-full max-w-lg rounded-md shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#2b5ae3] px-6 py-8 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h4 className="text-2xl font-bold tracking-tight text-center">New Purchase Order</h4>
          <p className="text-blue-100 font-medium mt-1 text-center text-sm">
            Record inventory restock from your vendors.
          </p>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Vendor Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                Select Vendor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <select
                  name="vendor_id"
                  required
                  value={formData.vendor_id}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none"
                >
                  <option value="">Choose a vendor...</option>
                  {vendors?.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Part Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                Select Part / Item
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {partsLoading ? <Loader2 size={16} className="text-blue-500 animate-spin" /> : <Package size={16} className="text-gray-400" />}
                </div>
                <select
                  name="part_id"
                  required
                  disabled={!formData.vendor_id || partsLoading}
                  value={formData.part_id}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none disabled:opacity-50"
                >
                  <option value="">{formData.vendor_id ? (partsLoading ? 'Loading parts...' : 'Choose a part...') : 'Select a vendor first'}</option>
                  {vendorParts?.map(p => (
                    <option key={p.id} value={p.id}>{p.part_name} - ₹{p.unit_price}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Quantity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Total Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-[#2b5ae3]" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${totalAmount.toLocaleString()}`}
                    className="block w-full pl-10 pr-4 py-2.5 bg-blue-50 border border-blue-100 rounded-md text-[#2b5ae3] font-semibold text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Payment Status */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Purchase Date (Only if paid) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  {formData.payment_status === 'Paid' ? 'Payment Date' : 'Order Date'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="purchase_date"
                    required
                    value={formData.purchase_date}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-md font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addPurchasePending || !formData.vendor_id || !formData.part_id}
                className="px-6 py-2.5 bg-[#2b5ae3] text-white rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {addPurchasePending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Complete Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddPurchaseModal;
