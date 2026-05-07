import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

import Mechanics from '../../pages/admin/Mechanics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'mechanics':
        return <Mechanics />;
      case 'dashboard':
      default:
        return (
          <>
            <div className="mb-8">
              <h3 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
                Welcome back, Admin 👋
              </h3>
              <p className="text-gray-500 font-medium mt-1">
                Here's what's happening with your garage today.
              </p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total Revenue', value: '$24,500', trend: '+12.5%', color: 'blue' },
                { label: 'Active Jobs', value: '48', trend: '+4', color: 'green' },
                { label: 'Completed Jobs', value: '1,240', trend: '+18%', color: 'indigo' },
                { label: 'New Customers', value: '124', trend: '+22%', color: 'purple' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Section Placeholder */}
            <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="text-[#2b5ae3] h-10 w-10" />
              </div>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Dashboard Insights</h4>
              <p className="text-gray-500 max-w-sm font-medium">
                Detailed charts and analytics will appear here soon.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex font-sans text-gray-900 overflow-x-hidden">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        logout={logout} 
      />

      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-[280px]' : 'pl-[80px]'}`}
      >
        <AdminHeader 
          activeTab={activeTab} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          user={user} 
          logout={logout} 
        />

        {/* Dynamic Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;