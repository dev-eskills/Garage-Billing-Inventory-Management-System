import React from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  User,
  LogOut
} from 'lucide-react';

const AdminHeader = ({ activeTab, isSidebarOpen, setIsSidebarOpen, user, logout }) => {
  // console.log(activeTab , "active tab")
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        
        <h2 className="text-xl text-gray-900 tracking-tight capitalize">
          {activeTab}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-md transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
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

            {/* <button 
              onClick={() => logout()}
              className=" cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-bold border border-red-100"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden lg:inline">Sign Out</span>
            </button> */}
          </div> 
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
