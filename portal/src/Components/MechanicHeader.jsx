import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import NotificationList from './admin/NotificationList';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import MechanicProfileButton from './MechanicProfileButton';

const MechanicHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { mechanicNotifications, markAsRead } = useNotifications(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const unreadCount = mechanicNotifications?.filter(n => n.status === 'unread').length || 0;

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

  const handleClick = () => {
    navigate("/")
  }

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
            G
          </div>
          <div className="hidden sm:block cursor-pointer" onClick={handleClick}>
            <h1 className="font-black text-slate-900 tracking-tight text-lg leading-none">Garage Portal</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Mechanic Panel</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer relative"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center">
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
                className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
              >
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Inbox</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <NotificationList
                    notifications={mechanicNotifications}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </div>

                <div className="p-3 border-t border-slate-50 bg-slate-50/30">
                  <button className="w-full py-2.5 text-[11px] font-black text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all uppercase tracking-[0.2em]">
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">{user?.user_metadata?.full_name || 'Mechanic'}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ready to work</p>
          </div>
          <MechanicProfileButton />
        </div>
      </div>
    </header>
  );
};

export default MechanicHeader;
