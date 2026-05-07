import {
  LayoutDashboard,
  Package,
  Users,
  UserSquare2,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/overview' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/admin/inventory' },
  { id: 'parts', label: 'Parts', icon: CarIcon, path: '/admin/parts'},
  { id: 'mechanics', label: 'Mechanics', icon: Users, path: '/admin/mechanics' },
  { id: 'vendors', label: 'Vendors', icon: ShoppingCart, path: '/admin/vendors' },
  { id: 'customers', label: 'Customers', icon: UserSquare2, path: '/admin/customers' },
  { id: 'invoices', label: 'Invoices', icon: FileText, path: '/admin/invoices' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = ({ activeTab, isSidebarOpen, setIsSidebarOpen, logout }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarOpen ? 280 : 80,
        x: typeof window !== 'undefined' && window.innerWidth < 1024 && !isSidebarOpen ? -280 : 0
      }}
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-sm 
        ${!isSidebarOpen ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-0'}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-gray-100 rounded-full hidden lg:flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.12)] hover:scale-110 transition-all z-[60] cursor-pointer text-[#2b5ae3]"
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50 overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2b5ae3] rounded-md flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
            <Package className="text-white h-6 w-6" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-xl tracking-tight text-[#1e293b] whitespace-nowrap"
              >
                Socioplace<span className="text-[#2b5ae3]">.</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 no-scrollbar space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 group relative ${isActive
                ? 'bg-[#2b5ae3] text-white shadow-md shadow-blue-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#2b5ae3]'
                }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-[14px] whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && isSidebarOpen && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white opacity-60"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section (Sign Out) */}
      <div className="p-4 border-t border-gray-50 shrink-0">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-md text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-sm whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
