import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Calendar, User, Car, Phone, Clock, RefreshCcw, Send, MessageSquare } from 'lucide-react';
import { fetchReminders } from '../../supabase/reminders';
import { fetchMechanics } from '../../supabase/adminMechanic';
import { useNotifications } from '../../hooks/useNotifications';
import SendNotificationModal from '../../Components/admin/SendNotificationModal';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const AdminReminders = () => {
  const { user } = useAuth();
  const { adminNotifications, isLoading: notificationsLoading } = useNotifications();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' or 'mechanics'
  const [showSendModal, setShowSendModal] = useState(false);
  const [mechanics, setMechanics] = useState([]);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const [remindersData, mechanicsData] = await Promise.all([
        fetchReminders(),
        fetchMechanics()
      ]);
      setReminders(remindersData || []);
      setMechanics(mechanicsData || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const filteredReminders = reminders.filter(r => 
    r.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.vehicle_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotifications = (adminNotifications || []).filter(n => {
    const titleMatch = n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const msgMatch = n.message?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const mechMatch = n.mechanic?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return titleMatch || msgMatch || mechMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1e293b] tracking-tight flex items-center gap-3">
            <Bell className="text-blue-600" />
            Reminder & Notification History
          </h3>
          <p className="text-slate-500 text-sm font-medium">Tracking all sent reminders and mechanic notifications</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'mechanics' && (
            <button 
              onClick={() => setShowSendModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm cursor-pointer"
            >
              <Send size={16} />
              Send Notification
            </button>
          )}
          <button 
            onClick={loadReminders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-bold text-sm shadow-sm cursor-pointer"
          >
            <RefreshCcw size={16} className={loading || notificationsLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'customers' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 cursor-pointer'
          }`}
        >
          <User size={16} />
          Customer Reminders
          {activeTab === 'customers' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('mechanics')}
          className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${
            activeTab === 'mechanics' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 cursor-pointer'
          }`}
        >
          <MessageSquare size={16} />
          Mechanic Communications
          {activeTab === 'mechanics' && (
            <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={activeTab === 'customers' ? "Search by customer, vehicle, or topic..." : "Search notifications..."}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 text-slate-500 text-sm font-bold bg-slate-50 py-3 rounded-xl border border-slate-100">
          <span>{activeTab === 'customers' ? filteredReminders.length : filteredNotifications.length}</span>
          <span className="uppercase tracking-wider text-[10px]">Records</span>
        </div>
      </div>

      {/* List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {activeTab === 'customers' ? (
            loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              ))
            ) : filteredReminders.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 gap-4">
                <Bell size={48} className="opacity-20" />
                <p className="font-bold">No reminders logged yet.</p>
              </div>
            ) : (
              filteredReminders.map((reminder, idx) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      reminder.type === 'automatic_expiry' 
                        ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {reminder.type.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{reminder.customer_name}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Phone size={12} /> {reminder.contact_info}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-semibold bg-slate-50 p-2.5 rounded-lg">
                      <Car size={16} className="text-slate-400" />
                      {reminder.vehicle_no}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                      <Clock size={16} className="text-blue-500" />
                      {reminder.title}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sent Date</span>
                      <span className="text-xs font-bold text-slate-700">
                        {new Date(reminder.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</span>
                      <span className="text-xs font-bold text-amber-600">
                        {reminder.expiry_date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          ) : (
            notificationsLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))
            ) : filteredNotifications.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 gap-4">
                <MessageSquare size={48} className="opacity-20" />
                <p className="font-bold">No notifications logged yet.</p>
              </div>
            ) : (
              filteredNotifications.map((notification, idx) => {
                const isSentByAdmin = notification.sender_id === user?.id;
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isSentByAdmin
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {isSentByAdmin ? 'Sent to Mechanic' : 'Received'}
                      </span>
                      {notification.notification_type === 'expiry_alert' && (
                         <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                           System Alert
                         </span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mb-3 mt-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                        {isSentByAdmin ? <Send size={20} className="text-emerald-500" /> : <MessageSquare size={20} className="text-blue-500" />}
                      </div>
                      <div className="flex-1 pr-12">
                        <h4 className="font-bold text-slate-900 line-clamp-1" title={notification.title}>{notification.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-3 leading-relaxed" title={notification.message}>
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mechanic</span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                           <User size={10} />
                           {notification.mechanic?.full_name || 'All Mechanics'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                        <span className="text-xs font-bold text-slate-500">
                          {new Date(notification.created_at).toLocaleString(undefined, {
                             year: 'numeric', month: 'short', day: 'numeric',
                             hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* Send Notification Modal */}
      <AnimatePresence>
        {showSendModal && (
          <SendNotificationModal 
            onClose={() => {
              setShowSendModal(false);
              loadReminders(); // reload data after sending
            }} 
            mechanics={mechanics} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReminders;

