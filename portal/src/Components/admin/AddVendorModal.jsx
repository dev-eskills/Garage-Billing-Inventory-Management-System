import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X as XIcon, User, Mail, ShieldCheck, Loader2, Phone, MapPin, X, Store } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdminVendor } from '../../hooks/useAdminVendor';

const AddVendorModal = ({ onClose, editData = null }) => {
  const isEdit = !!editData;
  const {
    adminAddVendor, adminAddVendorPending,
    adminUpdateVendor, adminUpdateVendorPending
  } = useAdminVendor();

  const [formData, setFormData] = useState({
    name: editData?.name || '',
    email: editData?.email || '',
    phone: editData?.phone || '',
    address: editData?.address || '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await adminUpdateVendor({ id: editData.id, formData });
      } else {
        await adminAddVendor(formData);
      }
      onClose();
    } catch (err) {
      // Error handled by hook's toast
    }
  };

  const isPending = adminAddVendorPending || adminUpdateVendorPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-xl rounded-md shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Header - Fixed at top */}
        <div className="bg-[#2b5ae3] px-4 py-6 sm:px-6 sm:py-8 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="hidden sm:flex w-16 h-16 bg-white/10 rounded-full items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Store size={32} className="text-white" />
          </div>
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-center">
            {isEdit ? 'Update Vendor Details' : 'Add New Vendor'}
          </h4>
          <p className="text-blue-100 font-medium mt-1 text-center text-xs sm:text-sm px-4">
            {isEdit ? 'Modify supplier information and contact details.' : 'Register a new supplier to your inventory network.'}
          </p>
        </div>

        {/* Form Content - Scrollable area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Vendor Name / Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="AutoParts Solutions"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="sales@autoparts.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Business Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="123 Industrial Area, Mumbai"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-md font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm cursor-pointer order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#2b5ae3] text-white rounded-md font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 order-1 sm:order-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {isEdit ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {isEdit ? 'Update Vendor' : 'Add Vendor'}
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

export default AddVendorModal;
