import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X as XIcon, User, Mail, Lock, ShieldCheck, Loader2, Phone, Eye, EyeOff, MapPin, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdminMechanic } from '../../hooks/useAdminMechanic';

const AddMechanicModal = ({ onClose, editData = null }) => {
  const isEdit = !!editData;
  const {
    adminAddMechanic, adminAddMechanicPending,
    adminUpdateMechanic, adminUpdateMechanicPending
  } = useAdminMechanic();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: editData?.full_name || '',
    email: editData?.email || '',
    contact: editData?.phone || '',
    address: editData?.address || '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      if (isEdit) {
        await adminUpdateMechanic({ id: editData.id, formData });
      } else {
        await adminAddMechanic(formData);
      }
      onClose();
    } catch (err) {
      // Error handled by hook's toast
    }
  };

  const isPending = adminAddMechanicPending || adminUpdateMechanicPending;

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
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-center">
            {isEdit ? 'Update Mechanic Details' : 'Register New Mechanic'}
          </h4>
          <p className="text-blue-100 font-medium mt-1 text-center text-xs sm:text-sm px-4">
            {isEdit ? 'Modify team member profile information.' : 'Create a secure account for your team member.'}
          </p>
        </div>

        {/* Form Content - Scrollable area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Full Name
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
                    placeholder="Rahul Sharma"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contact"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 ">
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
                    disabled={isEdit}
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                    placeholder="mechanic@example.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  Address
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
                    placeholder="123 Main St, Anytown, USA"
                  />
                </div>
              </div>

              {!isEdit && (
                <>
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}
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
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {isEdit ? 'Update Mechanic' : 'Create Mechanic'}
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

export default AddMechanicModal;
