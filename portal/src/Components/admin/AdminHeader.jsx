import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User,
  LogOut,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from "../../hooks/useNotifications"
import NotificationList from './NotificationList';

const AdminHeader = ({ activeTab, isSidebarOpen, setIsSidebarOpen, user, logout }) => {
  const { adminNotifications, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const unreadCount = adminNotifications?.filter(n => n.status === 'unread').length || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-md transition-all cursor-pointer"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-14 w-80 bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <NotificationList 
                  notifications={adminNotifications} 
                  onMarkAsRead={handleMarkAsRead} 
                />

                <div className="p-2 border-t border-gray-50 bg-gray-50/30">
                  <button className="w-full py-2 text-[11px] font-bold text-[#2b5ae3] hover:bg-blue-50 rounded-md transition-colors uppercase tracking-widest">
                    View All Activity
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user?.user_metadata?.full_name || 'Admin User'}</p>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-[#2b5ae3] shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div> 
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
