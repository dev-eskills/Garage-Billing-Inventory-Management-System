import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Calendar, MessageSquare, Clock, User, ShieldCheck, Send } from 'lucide-react';
import { createNotification, fetchAdmins } from '../../supabase/notifications';
import { useCustomers } from '../../hooks/useCustomers';
import { toast } from 'react-hot-toast';

const CreateReminderModal = ({ onClose, mechanicId }) => {
  const [loading, setLoading] = useState(false);
  const { customers } = useCustomers(mechanicId);
  const [admins, setAdmins] = useState([]);
  const [targetType, setTargetType] = useState('personal_reminder'); // 'personal_reminder', 'admin_notification', 'customer_reminder'
  const [selectedTargetId, setSelectedTargetId] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const adminData = await fetchAdmins();
        setAdmins(adminData);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    loadAdmins();
  }, []);

  const handleWhatsApp = (contact, name) => {
    const message = encodeURIComponent(
      `Hello ${name}, reminder from Garage Management: ${formData.title}. ${formData.message}`
    );
    window.open(
      `https://wa.me/${contact.replace(/\D/g, "")}?text=${message}`,
      "_blank",
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (targetType !== 'personal_reminder' && !selectedTargetId && targetType !== 'admin_notification') {
        toast.error('Please select a recipient');
        return;
    }

    setLoading(true);
    try {
      if (targetType === 'customer_reminder') {
        const customer = customers.find(c => c.id === selectedTargetId);
        // 1. Open WhatsApp
        handleWhatsApp(customer.customer_details?.contact, customer.customer_details?.name);
        
        // 2. Record in database for history/tracking
        await createNotification({
          ...formData,
          receiver_id: null, // Customers don't have IDs in this portal yet, or use their profile ID if they had one
          mechanic_id: mechanicId,
          notification_type: 'customer_reminder',
          status: 'read' // Mark as read since it was just sent
        });

        toast.success('WhatsApp opened & recorded');
        onClose();
        return;
      }

      await createNotification({
        ...formData,
        receiver_id: targetType === 'personal_reminder' 
          ? mechanicId 
          : (selectedTargetId === 'all' ? null : selectedTargetId),
        mechanic_id: mechanicId,
        notification_type: targetType,
      });
      
      toast.success(targetType === 'personal_reminder' ? 'Reminder set' : 'Notification sent');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Action failed');
    } finally {
      setLoading(false);
    }
  };

  const getTargetOptions = () => {
    if (targetType === 'admin_notification') return admins;
    if (targetType === 'customer_reminder') return customers;
    return [];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
                targetType === 'personal_reminder' ? 'bg-indigo-100 text-indigo-600' :
                targetType === 'admin_notification' ? 'bg-amber-100 text-amber-600' :
                'bg-emerald-100 text-emerald-600'
            }`}>
              {targetType === 'personal_reminder' ? <Clock size={22} /> :
               targetType === 'admin_notification' ? <ShieldCheck size={22} /> :
               <User size={22} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {targetType === 'personal_reminder' ? 'Set Reminder' :
                 targetType === 'admin_notification' ? 'Notify Admin' :
                 'Customer Reminder'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {targetType === 'personal_reminder' ? 'Keep track of your own tasks.' :
                 targetType === 'admin_notification' ? 'Send a message to the garage administrator.' :
                 'Send a WhatsApp reminder to a customer.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'personal_reminder', label: 'Self', icon: Clock },
              { id: 'admin_notification', label: 'Admin', icon: ShieldCheck },
              { id: 'customer_reminder', label: 'Customer', icon: User },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                    setTargetType(type.id);
                    setSelectedTargetId('');
                }}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  targetType === type.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                <type.icon size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{type.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {targetType !== 'personal_reminder' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
                  Select {targetType === 'admin_notification' ? 'Admin' : 'Customer'}
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold"
                  required
                >
                  <option value="">Choose Recipient...</option>
                  {targetType === 'admin_notification' && (
                    <option value="all" className="text-indigo-600 font-bold">📢 All Administrators</option>
                  )}
                  {getTargetOptions().map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {targetType === 'admin_notification' 
                        ? opt.full_name || 'Admin' 
                        : `${opt.customer_details?.name} (${opt.vehicle_details?.vehicle_number})`}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] flex items-center gap-2">
              <Bell size={12} className="text-indigo-500" /> {targetType === 'customer_reminder' ? 'Subject' : 'Title'}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={targetType === 'personal_reminder' ? "e.g., Check oil stock" : "Brief topic..."}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] flex items-center gap-2">
              <MessageSquare size={12} className="text-indigo-500" /> {targetType === 'customer_reminder' ? 'WhatsApp Message' : 'Message Details'}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={targetType === 'customer_reminder' ? "Write your message for the customer here..." : "Provide more details..."}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-semibold resize-none placeholder:text-slate-400"
              required
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer ${
                targetType === 'customer_reminder' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 
                'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {targetType === 'customer_reminder' ? <Send size={18} /> : <Bell size={18} />}
                  {targetType === 'personal_reminder' ? 'Set Reminder' :
                   targetType === 'admin_notification' ? 'Send to Admin' :
                   'Send WhatsApp'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateReminderModal;
